import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { compile } from "tailwindcss";

const sourceFiles = ["index.html", "src/App.jsx", "src/main.jsx", "src/index.css"];
const outputFile = "src/generated-tailwind.css";
const candidatePattern = /[A-Za-z0-9_:\/\-\.\[\]\(\),%#]+(?:\/[0-9]+)?/g;
const ignoredPrefixes = ["http", "https", "console", "import", "from", "return", "const", "function"];
const requiredUtilities = [
  "absolute",
  "block",
  "flex",
  "fixed",
  "grid",
  "hidden",
  "inline",
  "relative",
  "sticky",
  "table",
  "uppercase",
];

function collectCandidates(source) {
  const candidates = new Set(requiredUtilities);
  for (const match of source.matchAll(candidatePattern)) {
    const token = match[0];
    if (ignoredPrefixes.some((prefix) => token.startsWith(prefix))) continue;
    if (token.includes("..") || token.endsWith(".")) continue;
    candidates.add(token);
  }
  return candidates;
}

const css = String.raw`@import "tailwindcss";`;
const compiler = await compile(css, {
  from: "src/index.css",
  base: process.cwd(),
  async loadStylesheet(id, base) {
    const path = id === "tailwindcss" ? resolve("node_modules/tailwindcss/index.css") : resolve(base, id);
    return { content: await readFile(path, "utf8"), base: dirname(path) };
  },
});

const candidates = new Set(requiredUtilities);
for (const file of sourceFiles) {
  try {
    const content = await readFile(file, "utf8");
    for (const candidate of collectCandidates(content)) candidates.add(candidate);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}

const generated = compiler.build([...candidates]);
await writeFile(outputFile, generated);
console.log(`Generated ${outputFile} with ${candidates.size} Tailwind candidates.`);

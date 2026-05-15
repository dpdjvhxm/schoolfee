import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

const initialEmployees = [
  { id: "EMP-001", name: "Daniel Kim", country: "Singapore", department: "APAC Sales", child: "Emma Kim", school: "Singapore International School", grade: "G5", policyLimit: 22000, usedAmount: 13800, invoiceCount: 4, status: "정상" },
  { id: "EMP-002", name: "Maria Gomez", country: "Spain", department: "Global Marketing", child: "Lucas Gomez", school: "British School of Madrid", grade: "G8", policyLimit: 18000, usedAmount: 17750, invoiceCount: 5, status: "한도주의" },
  { id: "EMP-003", name: "Kenji Sato", country: "Japan", department: "Product", child: "Aoi Sato", school: "Tokyo Global Academy", grade: "G3", policyLimit: 20000, usedAmount: 9200, invoiceCount: 2, status: "검토중" },
  { id: "EMP-004", name: "Sophie Müller", country: "Germany", department: "Finance", child: "Lena Müller", school: "Berlin International School", grade: "G10", policyLimit: 24000, usedAmount: 25100, invoiceCount: 6, status: "초과" },
  { id: "EMP-005", name: "Aisha Khan", country: "UAE", department: "HR Operations", child: "Noor Khan", school: "Dubai Scholars School", grade: "G6", policyLimit: 26000, usedAmount: 15100, invoiceCount: 3, status: "정상" },
];

const initialInvoices = [
  { no: "INV-2026-001", employee: "Daniel Kim", child: "Emma Kim", school: "Singapore International School", category: "Tuition Fee", term: "2026 Q1", amount: 5200, currency: "USD", submitted: "2026-03-04", dueDate: "2026-03-31", status: "승인완료", issue: "없음", confidence: 98, template: "SIS 표준형" },
  { no: "INV-2026-002", employee: "Maria Gomez", child: "Lucas Gomez", school: "British School of Madrid", category: "Tuition Fee", term: "2026 Q1", amount: 6800, currency: "EUR", submitted: "2026-03-08", dueDate: "2026-03-29", status: "검토중", issue: "정책 한도 임박", confidence: 93, template: "BSM 테이블형" },
  { no: "INV-2026-003", employee: "Sophie Müller", child: "Lena Müller", school: "Berlin International School", category: "School Trip", term: "2026 Spring", amount: 2100, currency: "EUR", submitted: "2026-03-11", dueDate: "2026-03-20", status: "보류", issue: "증빙 누락", confidence: 68, template: "BIS 자유형" },
  { no: "INV-2026-004", employee: "Kenji Sato", child: "Aoi Sato", school: "Tokyo Global Academy", category: "Books & Materials", term: "2026 Q1", amount: 980, currency: "JPY", submitted: "2026-03-12", dueDate: "2026-04-02", status: "승인대기", issue: "환율 확인 필요", confidence: 87, template: "TGA 일본어형" },
  { no: "INV-2026-005", employee: "Aisha Khan", child: "Noor Khan", school: "Dubai Scholars School", category: "Tuition Fee", term: "2026 Q1", amount: 7300, currency: "USD", submitted: "2026-03-14", dueDate: "2026-03-27", status: "승인완료", issue: "없음", confidence: 96, template: "DSS 표준형" },
];

const initialTemplates = [
  { school: "Singapore International School", template: "SIS 표준형", fields: "Invoice No, Student Name, Term, Total Amount", successRate: 98, status: "활성" },
  { school: "British School of Madrid", template: "BSM 테이블형", fields: "Concept, Period, Amount, VAT", successRate: 94, status: "활성" },
  { school: "Berlin International School", template: "BIS 자유형", fields: "Description, Child Name, Due Date", successRate: 72, status: "검수필요" },
  { school: "Tokyo Global Academy", template: "TGA 일본어형", fields: "請求番号, 生徒名, 金額, 支払期限", successRate: 89, status: "활성" },
];

const policiesSeed = [
  { id: "POL-001", title: "APAC 일반 직원", region: "APAC", limit: 20000, currency: "USD", note: "초과 시 HR 승인 필요" },
  { id: "POL-002", title: "EU 주재원", region: "EU", limit: 22000, currency: "EUR", note: "환율 기준일 자동 적용" },
  { id: "POL-003", title: "중동 지사", region: "MEA", limit: 26000, currency: "USD", note: "입학금 별도 검토" },
  { id: "POL-004", title: "임원/특수계약", region: "GLOBAL", limit: 35000, currency: "USD", note: "계약서 기준 개별 한도" },
];

const monthlyData = [
  { month: "1월", amount: 18200 }, { month: "2월", amount: 24900 }, { month: "3월", amount: 36400 },
  { month: "4월", amount: 31100 }, { month: "5월", amount: 42800 }, { month: "6월", amount: 39700 },
];

const statusStyle = {
  정상: "bg-emerald-50 text-emerald-700 border-emerald-200", 검토중: "bg-blue-50 text-blue-700 border-blue-200",
  한도주의: "bg-amber-50 text-amber-700 border-amber-200", 초과: "bg-red-50 text-red-700 border-red-200",
  승인완료: "bg-emerald-50 text-emerald-700 border-emerald-200", 승인대기: "bg-amber-50 text-amber-700 border-amber-200",
  보류: "bg-red-50 text-red-700 border-red-200", 반려: "bg-slate-100 text-slate-700 border-slate-300",
  활성: "bg-emerald-50 text-emerald-700 border-emerald-200", 검수필요: "bg-amber-50 text-amber-700 border-amber-200",
};
const COLORS = ["#111827", "#4b5563", "#6b7280", "#9ca3af", "#d1d5db"];
const navItems = [["dashboard", "대시보드", "📊"], ["employees", "직원/자녀 관리", "👥"], ["invoices", "인보이스 관리", "🧾"], ["templates", "인보이스 템플릿", "🧩"], ["policy", "정책/한도 관리", "📄"]];

function money(value, currency = "$") { return `${currency}${Number(value || 0).toLocaleString()}`; }
function today() { return new Date().toISOString().slice(0, 10); }
function StatusBadge({ status }) { return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyle[status] || "bg-slate-50 text-slate-700 border-slate-200"}`}>{status}</span>; }
function EmojiIcon({ label, className = "" }) { return <span aria-hidden="true" className={`inline-flex shrink-0 items-center justify-center leading-none ${className}`}>{label}</span>; }
function Button({ children, onClick, variant = "dark", type = "button", disabled = false }) {
  const cls = variant === "dark" ? "bg-slate-950 text-white hover:bg-slate-800" : variant === "danger" ? "bg-red-600 text-white hover:bg-red-700" : "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50";
  return <button type={type} disabled={disabled} onClick={onClick} className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold shadow-sm transition disabled:opacity-50 ${cls}`}>{children}</button>;
}
function Field({ label, value, onChange, type = "text", options }) {
  return <label className="block"><span className="text-xs font-bold text-slate-500">{label}</span>{options ? <select value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400">{options.map(x => <option key={x}>{x}</option>)}</select> : <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400" />}</label>;
}
function Modal({ title, children, onClose }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"><motion.div initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-3xl bg-white p-6 shadow-2xl"><div className="mb-5 flex items-center justify-between gap-4"><h3 className="text-xl font-bold">{title}</h3><button onClick={onClose} className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold hover:bg-slate-200">닫기</button></div>{children}</motion.div></div>;
}
function getDashboardMetrics(employeeList, invoiceList) {
  const totalUsed = employeeList.reduce((sum, item) => sum + Number(item.usedAmount || 0), 0);
  const totalLimit = employeeList.reduce((sum, item) => sum + Number(item.policyLimit || 0), 0);
  const pendingCount = invoiceList.filter((item) => ["검토중", "승인대기", "보류"].includes(item.status)).length;
  const issueCount = invoiceList.filter((item) => item.issue !== "없음").length;
  const budgetRate = totalLimit > 0 ? Math.round((totalUsed / totalLimit) * 100) : 0;
  return { totalUsed, totalLimit, pendingCount, issueCount, budgetRate };
}
function filterInvoices(list, query, statusFilter) {
  return list.filter((item) => `${item.no} ${item.employee} ${item.child} ${item.school} ${item.category} ${item.status}`.toLowerCase().includes(String(query || "").toLowerCase()) && (statusFilter === "전체" || item.status === statusFilter));
}
function validateInvoice(inv, employees, existing) {
  const target = employees.find(e => e.name === inv.employee && e.child === inv.child);
  const issues = [];
  if (!target) issues.push("직원/자녀 매칭 실패");
  if (existing.some(x => x.no === inv.no)) issues.push("중복 인보이스 번호");
  if (!inv.school || !inv.amount || !inv.currency) issues.push("필수값 누락");
  if (target && Number(target.usedAmount) + Number(inv.amount) > Number(target.policyLimit)) issues.push("정책 한도 초과/임박");
  if (Number(inv.confidence || 0) < 80) issues.push("OCR 신뢰도 낮음");
  return issues.length ? issues.join(", ") : "없음";
}
function buildCharts(employees, invoices) {
  const countryMap = employees.reduce((acc, e) => ({ ...acc, [e.country]: (acc[e.country] || 0) + Number(e.usedAmount || 0) }), {});
  const categoryMap = invoices.reduce((acc, i) => ({ ...acc, [i.category]: (acc[i.category] || 0) + Number(i.amount || 0) }), {});
  const countryData = Object.entries(countryMap).map(([country, amount]) => ({ country, amount }));
  const categoryData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));
  return { countryData, categoryData };
}
function StatCard({ icon, title, value, desc, tone }) {
  return <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-medium text-slate-500">{title}</p><p className="mt-2 text-2xl font-bold text-slate-950">{value}</p><p className="mt-1 text-xs text-slate-500">{desc}</p></div><div className={`rounded-2xl p-3 ${tone || "bg-slate-100"}`}><EmojiIcon label={icon} className="text-xl" /></div></div></motion.div>;
}
function runSelfTests() {
  const metrics = getDashboardMetrics(initialEmployees, initialInvoices);
  console.assert(metrics.totalUsed === 80950, "총 사용 비용 계산 오류");
  console.assert(metrics.pendingCount === 3, "처리 대기 건수 계산 오류");
  console.assert(metrics.issueCount === 3, "이슈 인보이스 건수 계산 오류");
  console.assert(filterInvoices(initialInvoices, "Maria", "전체").length === 1, "검색 필터 오류");
  console.assert(validateInvoice({ no: "INV-2026-001", employee: "Daniel Kim", child: "Emma Kim", school: "SIS", amount: 10, currency: "USD", confidence: 99 }, initialEmployees, initialInvoices).includes("중복"), "중복 검증 오류");
  console.assert(validateInvoice({ no: "NEW", employee: "Daniel Kim", child: "Emma Kim", school: "SIS", amount: 100, currency: "USD", confidence: 99 }, initialEmployees, initialInvoices) === "없음", "정상 인보이스 검증 오류");
}
runSelfTests();

export default function EducationExpenseManagementDemo() {
  const [employees, setEmployees] = useState(initialEmployees);
  const [invoices, setInvoices] = useState(initialInvoices);
  const [templates, setTemplates] = useState(initialTemplates);
  const [policies, setPolicies] = useState(policiesSeed);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("전체");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [modal, setModal] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [notice, setNotice] = useState("데모 데이터가 준비되었습니다. 버튼을 눌러 실제 흐름을 테스트할 수 있습니다.");
  const [employeeForm, setEmployeeForm] = useState({ name: "", country: "", department: "", child: "", school: "", grade: "", policyLimit: 20000 });
  const [invoiceForm, setInvoiceForm] = useState({ no: "", employee: "Daniel Kim", child: "Emma Kim", school: "Singapore International School", category: "Tuition Fee", term: "2026 Q2", amount: 1000, currency: "USD", dueDate: "2026-06-30", confidence: 92, template: "SIS 표준형" });
  const [templateForm, setTemplateForm] = useState({ school: "", template: "", fields: "Invoice No, Student Name, Amount, Due Date", successRate: 80, status: "검수필요" });

  const filteredInvoices = useMemo(() => filterInvoices(invoices, query, statusFilter), [invoices, query, statusFilter]);
  const { totalUsed, totalLimit, pendingCount, issueCount, budgetRate } = getDashboardMetrics(employees, invoices);
  const { countryData, categoryData } = buildCharts(employees, invoices);

  function recalcEmployees(nextInvoices = invoices) {
    setEmployees(prev => prev.map(e => {
      const used = nextInvoices.filter(i => i.employee === e.name && i.child === e.child && i.status !== "반려").reduce((s, i) => s + Number(i.amount || 0), 0);
      const rate = used / Number(e.policyLimit || 1);
      return { ...e, usedAmount: used, invoiceCount: nextInvoices.filter(i => i.employee === e.name && i.child === e.child).length, status: rate > 1 ? "초과" : rate > .9 ? "한도주의" : "정상" };
    }));
  }
  function addEmployee(e) {
    e.preventDefault();
    const id = `EMP-${String(employees.length + 1).padStart(3, "0")}`;
    setEmployees([...employees, { ...employeeForm, id, usedAmount: 0, invoiceCount: 0, status: "정상", policyLimit: Number(employeeForm.policyLimit || 0) }]);
    setModal(null); setNotice(`${employeeForm.name} 직원/자녀 정보가 등록되었습니다.`);
  }
  function addInvoice(e) {
    e.preventDefault();
    const draft = { ...invoiceForm, amount: Number(invoiceForm.amount || 0), confidence: Number(invoiceForm.confidence || 0), submitted: today(), status: "검토중" };
    const issue = validateInvoice(draft, employees, invoices);
    const next = [...invoices, { ...draft, issue }];
    setInvoices(next); recalcEmployees(next); setModal(null); setNotice(`${draft.no} 인보이스가 등록되었고 자동 검증 결과: ${issue}`);
  }
  function simulateUpload() {
    const samples = [
      { no: `OCR-${Math.floor(Math.random() * 9000 + 1000)}`, employee: "Maria Gomez", child: "Lucas Gomez", school: "British School of Madrid", category: "Tuition Fee", term: "2026 Q2", amount: 1250, currency: "EUR", dueDate: "2026-07-15", confidence: 91, template: "BSM 테이블형" },
      { no: `OCR-${Math.floor(Math.random() * 9000 + 1000)}`, employee: "Sophie Müller", child: "Lena Müller", school: "Berlin International School", category: "Books & Materials", term: "2026 Summer", amount: 540, currency: "EUR", dueDate: "2026-07-01", confidence: 64, template: "BIS 자유형" },
      { no: `OCR-${Math.floor(Math.random() * 9000 + 1000)}`, employee: "Kenji Sato", child: "Aoi Sato", school: "Tokyo Global Academy", category: "School Bus", term: "2026 Q2", amount: 330, currency: "JPY", dueDate: "2026-07-10", confidence: 88, template: "TGA 일본어형" },
    ];
    const draft = samples[Math.floor(Math.random() * samples.length)];
    const issue = validateInvoice(draft, employees, invoices);
    const next = [...invoices, { ...draft, submitted: today(), status: issue === "없음" ? "승인대기" : "검토중", issue }];
    setInvoices(next); recalcEmployees(next); setActiveTab("invoices"); setNotice(`파일 업로드/OCR 시뮬레이션 완료: ${draft.school} 양식을 ${draft.template}으로 인식했습니다. 검증 결과: ${issue}`);
  }
  function updateInvoiceStatus(no, status) {
    const next = invoices.map(i => i.no === no ? { ...i, status, issue: status === "승인완료" ? "없음" : i.issue } : i);
    setInvoices(next); recalcEmployees(next); setSelectedInvoice(next.find(i => i.no === no)); setNotice(`${no} 상태가 ${status}(으)로 변경되었습니다.`);
  }
  function addTemplate(e) {
    e.preventDefault();
    setTemplates([...templates, { ...templateForm, successRate: Number(templateForm.successRate || 0) }]);
    setModal(null); setNotice(`${templateForm.school} 인보이스 템플릿이 추가되었습니다.`);
  }
  function exportCsv() {
    const header = ["no", "employee", "child", "school", "category", "term", "amount", "currency", "status", "issue"].join(",");
    const rows = filteredInvoices.map(i => [i.no, i.employee, i.child, i.school, i.category, i.term, i.amount, i.currency, i.status, i.issue].map(v => `"${String(v).replaceAll('"', '""')}"`).join(","));
    const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "education-expense-invoices.csv"; a.click(); URL.revokeObjectURL(url);
    setNotice("현재 필터 기준 인보이스 CSV를 다운로드했습니다.");
  }

  return <div className="min-h-screen bg-slate-50 text-slate-950">
    <aside className="fixed left-0 top-0 hidden h-full w-72 border-r border-slate-200 bg-white p-6 lg:block">
      <div className="flex items-center gap-3"><div className="rounded-2xl bg-slate-950 p-3 text-white"><EmojiIcon label="🎓" className="text-2xl" /></div><div><h1 className="text-lg font-bold">EduCost Hub</h1><p className="text-xs text-slate-500">Global Education Expense</p></div></div>
      <nav className="mt-10 space-y-2">{navItems.map(([key, label, icon]) => <button key={key} onClick={() => setActiveTab(key)} className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${activeTab === key ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-100"}`}><EmojiIcon label={icon} />{label}</button>)}</nav>
      <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-slate-100 p-4"><p className="text-sm font-bold">학교별 양식 처리 방식</p><p className="mt-2 text-xs leading-5 text-slate-600">OCR → 학교 템플릿 매칭 → 표준 필드 변환 → 사람이 예외만 검수합니다.</p></div>
    </aside>

    <main className="lg:ml-72">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/85 px-5 py-4 backdrop-blur lg:px-8"><div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div><p className="text-sm font-semibold text-slate-500">HR Cost Operations</p><h2 className="text-2xl font-bold tracking-tight">외국 직원 자녀 학비/학업비 관리 데모</h2><p className="mt-1 text-sm text-slate-500">{notice}</p></div><div className="flex flex-wrap gap-2"><Button variant="light" onClick={simulateUpload}><EmojiIcon label="⬆️" /> 인보이스 업로드/OCR</Button><Button onClick={() => setModal("employee")}><EmojiIcon label="➕" /> 직원 등록</Button></div></div></header>

      <section className="p-5 lg:p-8">
        {activeTab === "dashboard" && <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><StatCard icon="💵" title="총 사용 비용" value={money(totalUsed)} desc={`전체 한도 ${money(totalLimit)} 대비 ${budgetRate}% 사용`} tone="bg-emerald-50" /><StatCard icon="👥" title="관리 직원" value={`${employees.length}명`} desc="등록된 해외/외국 직원 기준" tone="bg-blue-50" /><StatCard icon="⏳" title="처리 대기" value={`${pendingCount}건`} desc="검토중/승인대기/보류 포함" tone="bg-amber-50" /><StatCard icon="⚠️" title="이슈 인보이스" value={`${issueCount}건`} desc="증빙/한도/OCR/환율 확인 필요" tone="bg-red-50" /></div>
          <div className="grid gap-6 xl:grid-cols-3"><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2"><div className="mb-5 flex items-center justify-between"><div><h3 className="text-lg font-bold">월별 학업 비용 추이</h3><p className="text-sm text-slate-500">월별 승인/지급 기준 비용 흐름</p></div><Button variant="light" onClick={() => setActiveTab("invoices")}>상세 보기</Button></div><div className="h-80"><ResponsiveContainer width="100%" height="100%"><LineChart data={monthlyData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip formatter={(value) => money(value)} /><Line type="monotone" dataKey="amount" strokeWidth={3} dot={{ r: 4 }} /></LineChart></ResponsiveContainer></div></div><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h3 className="text-lg font-bold">비용 항목 비중</h3><p className="text-sm text-slate-500">현재 인보이스 데이터 기준</p><div className="mt-4 h-72"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={58} outerRadius={92} paddingAngle={3}>{categoryData.map((entry, index) => <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />)}</Pie><Tooltip formatter={(value) => money(value)} /></PieChart></ResponsiveContainer></div></div></div>
          <div className="grid gap-6 xl:grid-cols-2"><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h3 className="text-lg font-bold">국가별 사용 금액</h3><p className="text-sm text-slate-500">직원 국가 기준 비용 비교</p><div className="mt-5 h-80"><ResponsiveContainer width="100%" height="100%"><BarChart data={countryData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="country" /><YAxis /><Tooltip formatter={(value) => money(value)} /><Bar dataKey="amount" radius={[10, 10, 0, 0]} /></BarChart></ResponsiveContainer></div></div><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h3 className="text-lg font-bold">처리 필요 인보이스</h3><p className="text-sm text-slate-500">클릭하면 상세 검수/승인 가능</p><div className="mt-5 space-y-3">{invoices.filter(i => i.issue !== "없음" || i.status !== "승인완료").slice(0, 5).map(i => <button key={i.no} onClick={() => { setSelectedInvoice(i); setModal("invoiceDetail"); }} className="w-full rounded-2xl border border-slate-200 p-4 text-left hover:bg-slate-50"><div className="flex justify-between gap-3"><p className="font-bold">{i.no} · {i.employee}</p><StatusBadge status={i.status} /></div><p className="mt-1 text-sm text-slate-500">{i.school} / {i.issue}</p></button>)}</div></div></div>
        </div>}

        {activeTab === "employees" && <div className="space-y-5"><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><div><h3 className="text-lg font-bold">직원/자녀/학교 관리</h3><p className="text-sm text-slate-500">행을 클릭하면 상세 정보를 확인합니다.</p></div><Button onClick={() => setModal("employee")}><EmojiIcon label="➕" /> 신규 등록</Button></div></div><div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm"><table className="w-full min-w-[900px] text-left text-sm"><thead className="bg-slate-100 text-xs uppercase text-slate-500"><tr><th className="px-5 py-4">직원</th><th className="px-5 py-4">국가/부서</th><th className="px-5 py-4">자녀/학년</th><th className="px-5 py-4">학교</th><th className="px-5 py-4">한도 사용률</th><th className="px-5 py-4">상태</th></tr></thead><tbody className="divide-y divide-slate-100">{employees.map(emp => { const rate = Math.round((emp.usedAmount / emp.policyLimit) * 100); return <tr key={emp.id} onClick={() => { setNotice(`${emp.name} 상세: ${emp.child}, ${emp.school}, 한도 사용률 ${rate}%`); }} className="cursor-pointer hover:bg-slate-50"><td className="px-5 py-4"><p className="font-bold">{emp.name}</p><p className="text-xs text-slate-500">{emp.id}</p></td><td className="px-5 py-4"><p>{emp.country}</p><p className="text-xs text-slate-500">{emp.department}</p></td><td className="px-5 py-4"><p className="font-semibold">{emp.child}</p><p className="text-xs text-slate-500">{emp.grade}</p></td><td className="px-5 py-4">{emp.school}</td><td className="px-5 py-4"><div className="flex items-center justify-between text-xs font-semibold"><span>{money(emp.usedAmount)}</span><span>{rate}%</span></div><div className="mt-2 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-slate-950" style={{ width: `${Math.min(rate, 100)}%` }} /></div><p className="mt-1 text-xs text-slate-500">한도 {money(emp.policyLimit)}</p></td><td className="px-5 py-4"><StatusBadge status={emp.status} /></td></tr>; })}</tbody></table></div></div>}

        {activeTab === "invoices" && <div className="space-y-5"><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between"><div><h3 className="text-lg font-bold">인보이스 관리</h3><p className="text-sm text-slate-500">등록, OCR 시뮬레이션, 검토, 승인/반려, CSV 다운로드가 동작합니다.</p></div><div className="flex flex-col gap-2 sm:flex-row"><div className="relative"><span className="pointer-events-none absolute left-3 top-2.5 text-sm text-slate-400">🔎</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="직원, 학교, 인보이스 검색" className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-slate-400 sm:w-72" /></div><select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400">{["전체", "승인완료", "검토중", "승인대기", "보류", "반려"].map(item => <option key={item}>{item}</option>)}</select><Button variant="light" onClick={exportCsv}>⬇️ CSV</Button><Button onClick={() => setModal("invoice")}>➕ 수동 등록</Button></div></div></div><div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm"><table className="w-full min-w-[1150px] text-left text-sm"><thead className="bg-slate-100 text-xs uppercase text-slate-500"><tr><th className="px-5 py-4">인보이스</th><th className="px-5 py-4">직원/자녀</th><th className="px-5 py-4">학교/템플릿</th><th className="px-5 py-4">항목</th><th className="px-5 py-4">금액</th><th className="px-5 py-4">OCR</th><th className="px-5 py-4">상태</th><th className="px-5 py-4">이슈</th><th className="px-5 py-4">액션</th></tr></thead><tbody className="divide-y divide-slate-100">{filteredInvoices.map(inv => <tr key={inv.no} className="hover:bg-slate-50"><td className="px-5 py-4"><p className="font-bold">{inv.no}</p><p className="text-xs text-slate-500">{inv.term} · 마감 {inv.dueDate}</p></td><td className="px-5 py-4"><p className="font-semibold">{inv.employee}</p><p className="text-xs text-slate-500">{inv.child}</p></td><td className="px-5 py-4"><p>{inv.school}</p><p className="text-xs text-slate-500">{inv.template}</p></td><td className="px-5 py-4">{inv.category}</td><td className="px-5 py-4 font-bold">{Number(inv.amount).toLocaleString()} {inv.currency}</td><td className="px-5 py-4"><div className="font-bold">{inv.confidence}%</div><div className="mt-1 h-1.5 rounded-full bg-slate-100"><div className="h-1.5 rounded-full bg-slate-950" style={{ width: `${inv.confidence}%` }} /></div></td><td className="px-5 py-4"><StatusBadge status={inv.status} /></td><td className="px-5 py-4"><span className={inv.issue === "없음" ? "text-slate-400" : "font-semibold text-red-600"}>{inv.issue}</span></td><td className="px-5 py-4"><Button variant="light" onClick={() => { setSelectedInvoice(inv); setModal("invoiceDetail"); }}>검수</Button></td></tr>)}</tbody></table></div></div>}

        {activeTab === "templates" && <div className="space-y-6"><div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div><h3 className="text-lg font-bold">학교별 인보이스 양식 해결 구조</h3><p className="text-sm text-slate-500">학교마다 양식이 달라도 최종 저장 필드는 하나의 표준 데이터로 통일합니다.</p></div><Button onClick={() => setModal("template")}>➕ 템플릿 추가</Button></div><div className="mt-5 grid gap-3 md:grid-cols-4"><div className="rounded-2xl bg-slate-50 p-4"><p className="font-bold">1. 파일 수집</p><p className="mt-1 text-sm text-slate-500">PDF, 이미지, 이메일 첨부</p></div><div className="rounded-2xl bg-slate-50 p-4"><p className="font-bold">2. OCR/파싱</p><p className="mt-1 text-sm text-slate-500">언어/통화/표 구조 인식</p></div><div className="rounded-2xl bg-slate-50 p-4"><p className="font-bold">3. 템플릿 매핑</p><p className="mt-1 text-sm text-slate-500">학교별 필드 위치 저장</p></div><div className="rounded-2xl bg-slate-50 p-4"><p className="font-bold">4. 예외 검수</p><p className="mt-1 text-sm text-slate-500">신뢰도 낮은 건만 사람이 확인</p></div></div></div><div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm"><table className="w-full min-w-[850px] text-left text-sm"><thead className="bg-slate-100 text-xs uppercase text-slate-500"><tr><th className="px-5 py-4">학교</th><th className="px-5 py-4">템플릿</th><th className="px-5 py-4">추출 필드</th><th className="px-5 py-4">성공률</th><th className="px-5 py-4">상태</th></tr></thead><tbody className="divide-y divide-slate-100">{templates.map(t => <tr key={t.school + t.template} className="hover:bg-slate-50"><td className="px-5 py-4 font-bold">{t.school}</td><td className="px-5 py-4">{t.template}</td><td className="px-5 py-4 text-slate-600">{t.fields}</td><td className="px-5 py-4"><strong>{t.successRate}%</strong></td><td className="px-5 py-4"><StatusBadge status={t.status} /></td></tr>)}</tbody></table></div></div>}

        {activeTab === "policy" && <div className="grid gap-6 xl:grid-cols-2"><div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h3 className="text-lg font-bold">정책/한도 관리</h3><p className="text-sm text-slate-500">정책 수정 버튼을 누르면 한도가 즉시 변경됩니다.</p><div className="mt-6 space-y-3">{policies.map(p => <div key={p.id} className="rounded-2xl border border-slate-200 p-4"><div className="flex items-center justify-between gap-3"><p className="font-bold">{p.title}</p><Button variant="light" onClick={() => { const next = policies.map(x => x.id === p.id ? { ...x, limit: Number(x.limit) + 1000 } : x); setPolicies(next); setNotice(`${p.title} 한도를 1,000 상향 조정했습니다.`); }}>한도 +1000</Button></div><p className="mt-1 text-sm text-slate-700">자녀 1명당 연간 {p.limit.toLocaleString()} {p.currency}</p><p className="mt-1 text-xs text-slate-500">{p.note}</p></div>)}</div></div><div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h3 className="text-lg font-bold">자동 검증 룰</h3><p className="text-sm text-slate-500">인보이스 등록 시 실제로 검증 로직이 적용됩니다.</p><div className="mt-6 space-y-3">{["직원/자녀 매칭 실패", "동일 인보이스 번호 중복", "필수값 누락", "정책 한도 초과/임박", "OCR 신뢰도 80% 미만", "학교별 템플릿 미등록"].map(rule => <div key={rule} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4"><EmojiIcon label="✅" /><p className="text-sm font-medium text-slate-700">{rule}</p></div>)}</div></div></div>}
      </section>
    </main>

    {modal === "employee" && <Modal title="직원/자녀 신규 등록" onClose={() => setModal(null)}><form onSubmit={addEmployee} className="grid gap-4 md:grid-cols-2"><Field label="직원명" value={employeeForm.name} onChange={v => setEmployeeForm({ ...employeeForm, name: v })} /><Field label="국가" value={employeeForm.country} onChange={v => setEmployeeForm({ ...employeeForm, country: v })} /><Field label="부서" value={employeeForm.department} onChange={v => setEmployeeForm({ ...employeeForm, department: v })} /><Field label="자녀명" value={employeeForm.child} onChange={v => setEmployeeForm({ ...employeeForm, child: v })} /><Field label="학교" value={employeeForm.school} onChange={v => setEmployeeForm({ ...employeeForm, school: v })} /><Field label="학년" value={employeeForm.grade} onChange={v => setEmployeeForm({ ...employeeForm, grade: v })} /><Field label="연간 한도" type="number" value={employeeForm.policyLimit} onChange={v => setEmployeeForm({ ...employeeForm, policyLimit: v })} /><div className="flex items-end"><Button type="submit">등록 저장</Button></div></form></Modal>}
    {modal === "invoice" && <Modal title="인보이스 수동 등록" onClose={() => setModal(null)}><form onSubmit={addInvoice} className="grid gap-4 md:grid-cols-2"><Field label="인보이스 번호" value={invoiceForm.no} onChange={v => setInvoiceForm({ ...invoiceForm, no: v })} /><Field label="직원" value={invoiceForm.employee} options={employees.map(e => e.name)} onChange={v => { const e = employees.find(x => x.name === v); setInvoiceForm({ ...invoiceForm, employee: v, child: e?.child || "", school: e?.school || "" }); }} /><Field label="자녀" value={invoiceForm.child} onChange={v => setInvoiceForm({ ...invoiceForm, child: v })} /><Field label="학교" value={invoiceForm.school} onChange={v => setInvoiceForm({ ...invoiceForm, school: v })} /><Field label="항목" value={invoiceForm.category} options={["Tuition Fee", "Books & Materials", "School Trip", "School Bus", "Admission Fee"]} onChange={v => setInvoiceForm({ ...invoiceForm, category: v })} /><Field label="학기/기간" value={invoiceForm.term} onChange={v => setInvoiceForm({ ...invoiceForm, term: v })} /><Field label="금액" type="number" value={invoiceForm.amount} onChange={v => setInvoiceForm({ ...invoiceForm, amount: v })} /><Field label="통화" value={invoiceForm.currency} options={["USD", "EUR", "JPY", "SGD", "AED"]} onChange={v => setInvoiceForm({ ...invoiceForm, currency: v })} /><Field label="마감일" type="date" value={invoiceForm.dueDate} onChange={v => setInvoiceForm({ ...invoiceForm, dueDate: v })} /><Field label="OCR 신뢰도" type="number" value={invoiceForm.confidence} onChange={v => setInvoiceForm({ ...invoiceForm, confidence: v })} /><div className="md:col-span-2 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">저장 시 직원/자녀 매칭, 중복번호, 필수값, 한도, OCR 신뢰도를 자동 검증합니다.</div><Button type="submit">검증 후 등록</Button></form></Modal>}
    {modal === "invoiceDetail" && selectedInvoice && <Modal title={`인보이스 검수 · ${selectedInvoice.no}`} onClose={() => setModal(null)}><div className="grid gap-4 md:grid-cols-2"><div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-bold text-slate-500">학교/템플릿</p><p className="mt-1 font-bold">{selectedInvoice.school}</p><p className="text-sm text-slate-500">{selectedInvoice.template}</p></div><div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-bold text-slate-500">OCR 신뢰도</p><p className="mt-1 text-2xl font-bold">{selectedInvoice.confidence}%</p></div><div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-bold text-slate-500">직원/자녀</p><p className="mt-1 font-bold">{selectedInvoice.employee} / {selectedInvoice.child}</p></div><div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-bold text-slate-500">금액</p><p className="mt-1 font-bold">{Number(selectedInvoice.amount).toLocaleString()} {selectedInvoice.currency}</p></div><div className="md:col-span-2 rounded-2xl border border-red-100 bg-red-50 p-4"><p className="text-xs font-bold text-red-500">검증 이슈</p><p className="mt-1 font-semibold text-red-700">{selectedInvoice.issue}</p></div><div className="md:col-span-2 flex flex-wrap gap-2"><Button onClick={() => updateInvoiceStatus(selectedInvoice.no, "승인완료")}>✅ 승인</Button><Button variant="light" onClick={() => updateInvoiceStatus(selectedInvoice.no, "보류")}>⏳ 보류</Button><Button variant="danger" onClick={() => updateInvoiceStatus(selectedInvoice.no, "반려")}>❌ 반려</Button></div></div></Modal>}
    {modal === "template" && <Modal title="학교별 인보이스 템플릿 추가" onClose={() => setModal(null)}><form onSubmit={addTemplate} className="grid gap-4 md:grid-cols-2"><Field label="학교명" value={templateForm.school} onChange={v => setTemplateForm({ ...templateForm, school: v })} /><Field label="템플릿명" value={templateForm.template} onChange={v => setTemplateForm({ ...templateForm, template: v })} /><Field label="추출 필드" value={templateForm.fields} onChange={v => setTemplateForm({ ...templateForm, fields: v })} /><Field label="예상 성공률" type="number" value={templateForm.successRate} onChange={v => setTemplateForm({ ...templateForm, successRate: v })} /><Field label="상태" value={templateForm.status} options={["활성", "검수필요"]} onChange={v => setTemplateForm({ ...templateForm, status: v })} /><div className="flex items-end"><Button type="submit">템플릿 저장</Button></div><div className="md:col-span-2 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">실제 서비스에서는 학교별 샘플 인보이스 3~5장을 업로드해 필드 위치를 학습/저장하고, 이후 같은 학교의 인보이스는 자동으로 표준 필드에 매핑합니다.</div></form></Modal>}
  </div>;
}

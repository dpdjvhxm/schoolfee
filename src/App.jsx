import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
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
  { month: "1월", amount: 18200 },
  { month: "2월", amount: 24900 },
  { month: "3월", amount: 36400 },
  { month: "4월", amount: 31100 },
  { month: "5월", amount: 42800 },
  { month: "6월", amount: 39700 },
];

const statusStyle = {
  정상: "border-emerald-200 bg-emerald-50 text-emerald-700",
  검토중: "border-blue-200 bg-blue-50 text-blue-700",
  한도주의: "border-amber-200 bg-amber-50 text-amber-700",
  초과: "border-red-200 bg-red-50 text-red-700",
  승인완료: "border-emerald-200 bg-emerald-50 text-emerald-700",
  승인대기: "border-amber-200 bg-amber-50 text-amber-700",
  보류: "border-red-200 bg-red-50 text-red-700",
  반려: "border-slate-300 bg-slate-100 text-slate-700",
  활성: "border-emerald-200 bg-emerald-50 text-emerald-700",
  검수필요: "border-amber-200 bg-amber-50 text-amber-700",
};

const chartColors = ["#2563eb", "#14b8a6", "#f97316", "#8b5cf6", "#64748b"];
const navItems = [
  ["dashboard", "대시보드", "📊"],
  ["employees", "직원/자녀", "👥"],
  ["invoices", "인보이스", "🧾"],
  ["templates", "템플릿", "🧩"],
  ["policy", "정책/한도", "📄"],
];

function money(value, currency = "$") {
  return `${currency}${Number(value || 0).toLocaleString()}`;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyle[status] || "border-slate-200 bg-slate-50 text-slate-700"}`}>
      {status}
    </span>
  );
}

function Button({ children, onClick, variant = "primary", type = "button", disabled = false }) {
  const variants = {
    primary: "bg-slate-950 text-white shadow-slate-950/20 hover:-translate-y-0.5 hover:bg-slate-800",
    light: "border border-slate-200 bg-white text-slate-800 hover:-translate-y-0.5 hover:bg-slate-50",
    danger: "bg-red-600 text-white shadow-red-600/20 hover:-translate-y-0.5 hover:bg-red-700",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]}`}
    >
      {children}
    </button>
  );
}

function Field({ label, value, onChange, type = "text", options }) {
  const controlClass = "mt-1.5 w-full rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100";

  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</span>
      {options ? (
        <select value={value} onChange={(event) => onChange(event.target.value)} className={controlClass}>
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      ) : (
        <input type={type} value={value} onChange={(event) => onChange(event.target.value)} className={controlClass} />
      )}
    </label>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-[2rem] border border-white/70 bg-white p-6 shadow-2xl"
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <h3 className="text-xl font-black text-slate-950">{title}</h3>
          <button onClick={onClose} className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-bold text-slate-600 hover:bg-slate-200">
            닫기
          </button>
        </div>
        {children}
      </motion.div>
    </div>
  );
}

function Card({ children, className = "" }) {
  return <div className={`rounded-[1.75rem] border border-white/70 bg-white/90 shadow-xl shadow-slate-200/60 backdrop-blur ${className}`}>{children}</div>;
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
  return list.filter((item) => {
    const target = `${item.no} ${item.employee} ${item.child} ${item.school} ${item.category} ${item.status}`.toLowerCase();
    return target.includes(String(query || "").toLowerCase()) && (statusFilter === "전체" || item.status === statusFilter);
  });
}

function validateInvoice(inv, employees, existing) {
  const target = employees.find((employee) => employee.name === inv.employee && employee.child === inv.child);
  const issues = [];
  if (!target) issues.push("직원/자녀 매칭 실패");
  if (existing.some((item) => item.no === inv.no)) issues.push("중복 인보이스 번호");
  if (!inv.school || !inv.amount || !inv.currency) issues.push("필수값 누락");
  if (target && Number(target.usedAmount) + Number(inv.amount) > Number(target.policyLimit)) issues.push("정책 한도 초과/임박");
  if (Number(inv.confidence || 0) < 80) issues.push("OCR 신뢰도 낮음");
  return issues.length ? issues.join(", ") : "없음";
}

function buildCharts(employees, invoices) {
  const countryMap = employees.reduce((acc, employee) => ({ ...acc, [employee.country]: (acc[employee.country] || 0) + Number(employee.usedAmount || 0) }), {});
  const categoryMap = invoices.reduce((acc, invoice) => ({ ...acc, [invoice.category]: (acc[invoice.category] || 0) + Number(invoice.amount || 0) }), {});
  return {
    countryData: Object.entries(countryMap).map(([country, amount]) => ({ country, amount })),
    categoryData: Object.entries(categoryMap).map(([name, value]) => ({ name, value })),
  };
}

function StatCard({ icon, title, value, desc, accent }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-[1.5rem] border border-white/80 bg-white/85 p-5 shadow-lg shadow-slate-200/50">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-black text-slate-950">{value}</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">{desc}</p>
        </div>
        <div className={`grid h-12 w-12 place-items-center rounded-2xl text-xl ${accent}`}>{icon}</div>
      </div>
    </motion.div>
  );
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
  const activeTitle = navItems.find(([key]) => key === activeTab)?.[1] || "대시보드";

  function recalcEmployees(nextInvoices = invoices) {
    setEmployees((prev) => prev.map((employee) => {
      const used = nextInvoices
        .filter((invoice) => invoice.employee === employee.name && invoice.child === employee.child && invoice.status !== "반려")
        .reduce((sum, invoice) => sum + Number(invoice.amount || 0), 0);
      const rate = used / Number(employee.policyLimit || 1);
      return {
        ...employee,
        usedAmount: used,
        invoiceCount: nextInvoices.filter((invoice) => invoice.employee === employee.name && invoice.child === employee.child).length,
        status: rate > 1 ? "초과" : rate > 0.9 ? "한도주의" : "정상",
      };
    }));
  }

  function addEmployee(event) {
    event.preventDefault();
    const id = `EMP-${String(employees.length + 1).padStart(3, "0")}`;
    setEmployees([...employees, { ...employeeForm, id, usedAmount: 0, invoiceCount: 0, status: "정상", policyLimit: Number(employeeForm.policyLimit || 0) }]);
    setModal(null);
    setNotice(`${employeeForm.name} 직원/자녀 정보가 등록되었습니다.`);
  }

  function addInvoice(event) {
    event.preventDefault();
    const draft = { ...invoiceForm, amount: Number(invoiceForm.amount || 0), confidence: Number(invoiceForm.confidence || 0), submitted: today(), status: "검토중" };
    const issue = validateInvoice(draft, employees, invoices);
    const next = [...invoices, { ...draft, issue }];
    setInvoices(next);
    recalcEmployees(next);
    setModal(null);
    setNotice(`${draft.no} 인보이스가 등록되었고 자동 검증 결과: ${issue}`);
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
    setInvoices(next);
    recalcEmployees(next);
    setActiveTab("invoices");
    setNotice(`파일 업로드/OCR 시뮬레이션 완료: ${draft.school} 양식을 ${draft.template}으로 인식했습니다. 검증 결과: ${issue}`);
  }

  function updateInvoiceStatus(no, status) {
    const next = invoices.map((invoice) => (invoice.no === no ? { ...invoice, status } : invoice));
    setInvoices(next);
    recalcEmployees(next);
    setModal(null);
    setNotice(`${no} 상태를 ${status}(으)로 변경했습니다.`);
  }

  function addTemplate(event) {
    event.preventDefault();
    setTemplates([...templates, { ...templateForm, successRate: Number(templateForm.successRate || 0) }]);
    setModal(null);
    setNotice(`${templateForm.school} 템플릿을 추가했습니다.`);
  }

  function exportCsv() {
    const header = "invoice,employee,child,school,category,amount,currency,status,issue";
    const rows = invoices.map((invoice) => [invoice.no, invoice.employee, invoice.child, invoice.school, invoice.category, invoice.amount, invoice.currency, invoice.status, invoice.issue].join(","));
    const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "education-expense-invoices.csv";
    anchor.click();
    URL.revokeObjectURL(url);
    setNotice("현재 인보이스 목록을 CSV로 내보냈습니다.");
  }

  const pendingItems = invoices.filter((invoice) => invoice.issue !== "없음" || invoice.status !== "승인완료").slice(0, 5);

  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,#dbeafe_0,#f8fafc_32%,#eef2ff_68%,#f8fafc_100%)] text-slate-900">
      <div className="pointer-events-none fixed -left-24 top-20 h-72 w-72 rounded-full bg-blue-300/30 blur-3xl" />
      <div className="pointer-events-none fixed bottom-4 right-4 h-96 w-96 rounded-full bg-cyan-200/40 blur-3xl" />

      <div className="relative flex min-h-screen flex-col xl:flex-row">
        <aside className="sticky top-0 z-30 border-b border-white/70 bg-white/80 px-4 py-4 shadow-sm backdrop-blur-xl xl:h-screen xl:w-72 xl:border-b-0 xl:border-r xl:px-5 xl:py-6">
          <div className="flex items-center justify-between gap-4 xl:block">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-950 text-2xl text-white shadow-lg">🎓</div>
              <div>
                <p className="text-lg font-black leading-tight">EduCost Hub</p>
                <p className="text-xs font-semibold text-slate-500">Global school fee ops</p>
              </div>
            </div>
            <div className="hidden rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 sm:block xl:mt-5 xl:inline-flex">Live Demo</div>
          </div>

          <nav className="mt-5 flex gap-2 overflow-x-auto pb-1 xl:block xl:space-y-2 xl:overflow-visible xl:pb-0">
            {navItems.map(([key, label, icon]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex min-w-max items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition xl:w-full ${activeTab === key ? "bg-slate-950 text-white shadow-lg shadow-slate-950/15" : "text-slate-600 hover:bg-white hover:text-slate-950"}`}
              >
                <span>{icon}</span>
                <span>{label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-6 hidden rounded-[1.5rem] bg-slate-950 p-4 text-white xl:block">
            <p className="text-sm font-bold">이번 달 처리율</p>
            <p className="mt-2 text-3xl font-black">92%</p>
            <div className="mt-4 h-2 rounded-full bg-white/20">
              <div className="h-2 w-[92%] rounded-full bg-cyan-300" />
            </div>
            <p className="mt-3 text-xs leading-5 text-slate-300">OCR 자동 매핑과 정책 검증으로 HR 수작업을 줄입니다.</p>
          </div>
        </aside>

        <main className="relative flex min-h-screen flex-1 flex-col p-4 sm:p-6 lg:p-8">
          <header className="mb-6 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-bold text-blue-600">Education Expense Management</p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{activeTitle}</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">페이지 전체 폭과 높이를 활용하도록 사이드바·상단 요약·콘텐츠 그리드를 재구성했습니다.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="light" onClick={() => setActiveTab("templates")}>🧩 템플릿 관리</Button>
              <Button onClick={simulateUpload}>📤 파일 업로드/OCR</Button>
            </div>
          </header>

          <div className="mb-6 rounded-[1.5rem] border border-blue-100 bg-blue-50/80 px-5 py-4 text-sm font-semibold text-blue-800 shadow-sm">
            {notice}
          </div>

          <section className="flex-1">
            {activeTab === "dashboard" && (
              <div className="grid min-h-full gap-6 2xl:grid-cols-[1fr_420px]">
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <StatCard icon="💳" title="총 사용 비용" value={money(totalUsed)} desc={`전체 한도 ${money(totalLimit)} 중 ${budgetRate}% 사용`} accent="bg-blue-50 text-blue-700" />
                    <StatCard icon="⏳" title="처리 대기" value={`${pendingCount}건`} desc="검토중/승인대기/보류 인보이스" accent="bg-amber-50 text-amber-700" />
                    <StatCard icon="⚠️" title="검증 이슈" value={`${issueCount}건`} desc="정책, 증빙, OCR 이슈 포함" accent="bg-red-50 text-red-700" />
                    <StatCard icon="🏫" title="등록 학교" value={`${templates.length}개`} desc="학교별 인보이스 템플릿" accent="bg-emerald-50 text-emerald-700" />
                  </div>

                  <Card className="p-5 lg:p-6">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h2 className="text-xl font-black">월별 교육비 지출 추이</h2>
                        <p className="text-sm text-slate-500">큰 캔버스형 차트로 전체 화면의 여백을 활용합니다.</p>
                      </div>
                      <StatusBadge status={budgetRate > 85 ? "한도주의" : "정상"} />
                    </div>
                    <div className="mt-6 h-[330px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={monthlyData} margin={{ top: 10, right: 18, bottom: 0, left: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="month" stroke="#64748b" />
                          <YAxis stroke="#64748b" />
                          <Tooltip formatter={(value) => money(value)} />
                          <Line type="monotone" dataKey="amount" stroke="#2563eb" strokeWidth={4} dot={{ r: 5, fill: "#2563eb" }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>

                  <div className="grid gap-6 xl:grid-cols-2">
                    <Card className="p-5 lg:p-6">
                      <h2 className="text-lg font-black">국가별 사용액</h2>
                      <div className="mt-5 h-[280px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={countryData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="country" stroke="#64748b" />
                            <YAxis stroke="#64748b" />
                            <Tooltip formatter={(value) => money(value)} />
                            <Bar dataKey="amount" radius={[12, 12, 0, 0]} fill="#0f172a" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </Card>
                    <Card className="p-5 lg:p-6">
                      <h2 className="text-lg font-black">항목별 비중</h2>
                      <div className="mt-5 h-[280px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={62} outerRadius={98} paddingAngle={3}>
                              {categoryData.map((entry, index) => <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />)}
                            </Pie>
                            <Tooltip formatter={(value) => money(value)} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </Card>
                  </div>
                </div>

                <div className="space-y-6">
                  <Card className="p-5 lg:p-6">
                    <h2 className="text-lg font-black">오늘의 검수 큐</h2>
                    <p className="text-sm text-slate-500">클릭하면 상세 검수/승인 모달을 엽니다.</p>
                    <div className="mt-5 space-y-3">
                      {pendingItems.map((invoice) => (
                        <button
                          key={invoice.no}
                          onClick={() => { setSelectedInvoice(invoice); setModal("invoiceDetail"); }}
                          className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-black text-slate-950">{invoice.no}</p>
                              <p className="mt-1 text-sm text-slate-500">{invoice.employee} · {invoice.school}</p>
                            </div>
                            <StatusBadge status={invoice.status} />
                          </div>
                          <p className="mt-3 text-sm font-semibold text-red-600">{invoice.issue}</p>
                        </button>
                      ))}
                    </div>
                  </Card>
                  <Card className="overflow-hidden">
                    <div className="bg-slate-950 p-6 text-white">
                      <p className="text-sm font-bold text-cyan-200">Budget Health</p>
                      <p className="mt-2 text-5xl font-black">{budgetRate}%</p>
                      <p className="mt-2 text-sm text-slate-300">전체 정책 한도 대비 집행률</p>
                    </div>
                    <div className="p-6">
                      <div className="h-3 rounded-full bg-slate-100">
                        <div className="h-3 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400" style={{ width: `${Math.min(budgetRate, 100)}%` }} />
                      </div>
                      <p className="mt-4 text-sm leading-6 text-slate-600">초과·임박 항목은 정책/한도 페이지에서 바로 시뮬레이션할 수 있습니다.</p>
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === "employees" && (
              <div className="space-y-5">
                <Card className="p-5">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-lg font-black">직원/자녀/학교 관리</h3>
                      <p className="text-sm text-slate-500">행을 클릭하면 상세 정보를 확인합니다.</p>
                    </div>
                    <Button onClick={() => setModal("employee")}>➕ 신규 등록</Button>
                  </div>
                </Card>
                <Card className="overflow-x-auto">
                  <table className="w-full min-w-[900px] text-left text-sm">
                    <thead className="bg-slate-100 text-xs uppercase text-slate-500">
                      <tr><th className="px-5 py-4">직원</th><th className="px-5 py-4">국가/부서</th><th className="px-5 py-4">자녀/학년</th><th className="px-5 py-4">학교</th><th className="px-5 py-4">한도 사용률</th><th className="px-5 py-4">상태</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {employees.map((employee) => {
                        const rate = Math.round((employee.usedAmount / employee.policyLimit) * 100);
                        return (
                          <tr key={employee.id} onClick={() => setNotice(`${employee.name} 상세: ${employee.child}, ${employee.school}, 한도 사용률 ${rate}%`)} className="cursor-pointer bg-white/70 hover:bg-blue-50/60">
                            <td className="px-5 py-4"><p className="font-black">{employee.name}</p><p className="text-xs text-slate-500">{employee.id}</p></td>
                            <td className="px-5 py-4"><p>{employee.country}</p><p className="text-xs text-slate-500">{employee.department}</p></td>
                            <td className="px-5 py-4"><p className="font-semibold">{employee.child}</p><p className="text-xs text-slate-500">{employee.grade}</p></td>
                            <td className="px-5 py-4">{employee.school}</td>
                            <td className="px-5 py-4"><div className="flex items-center justify-between text-xs font-semibold"><span>{money(employee.usedAmount)}</span><span>{rate}%</span></div><div className="mt-2 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-slate-950" style={{ width: `${Math.min(rate, 100)}%` }} /></div><p className="mt-1 text-xs text-slate-500">한도 {money(employee.policyLimit)}</p></td>
                            <td className="px-5 py-4"><StatusBadge status={employee.status} /></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </Card>
              </div>
            )}

            {activeTab === "invoices" && (
              <div className="space-y-5">
                <Card className="p-5">
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <div>
                      <h3 className="text-lg font-black">인보이스 관리</h3>
                      <p className="text-sm text-slate-500">등록, OCR 시뮬레이션, 검토, 승인/반려, CSV 다운로드가 동작합니다.</p>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="직원, 학교, 인보이스 검색" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 sm:w-72" />
                      <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-400">
                        {["전체", "승인완료", "검토중", "승인대기", "보류", "반려"].map((item) => <option key={item}>{item}</option>)}
                      </select>
                      <Button variant="light" onClick={exportCsv}>⬇️ CSV</Button>
                      <Button onClick={() => setModal("invoice")}>➕ 수동 등록</Button>
                    </div>
                  </div>
                </Card>
                <Card className="overflow-x-auto">
                  <table className="w-full min-w-[1150px] text-left text-sm">
                    <thead className="bg-slate-100 text-xs uppercase text-slate-500">
                      <tr><th className="px-5 py-4">인보이스</th><th className="px-5 py-4">직원/자녀</th><th className="px-5 py-4">학교/템플릿</th><th className="px-5 py-4">항목</th><th className="px-5 py-4">금액</th><th className="px-5 py-4">OCR</th><th className="px-5 py-4">상태</th><th className="px-5 py-4">이슈</th><th className="px-5 py-4">액션</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredInvoices.map((invoice) => (
                        <tr key={invoice.no} className="bg-white/70 hover:bg-blue-50/60">
                          <td className="px-5 py-4"><p className="font-black">{invoice.no}</p><p className="text-xs text-slate-500">{invoice.term} · 마감 {invoice.dueDate}</p></td>
                          <td className="px-5 py-4"><p className="font-semibold">{invoice.employee}</p><p className="text-xs text-slate-500">{invoice.child}</p></td>
                          <td className="px-5 py-4"><p>{invoice.school}</p><p className="text-xs text-slate-500">{invoice.template}</p></td>
                          <td className="px-5 py-4">{invoice.category}</td>
                          <td className="px-5 py-4 font-black">{Number(invoice.amount).toLocaleString()} {invoice.currency}</td>
                          <td className="px-5 py-4"><div className="font-black">{invoice.confidence}%</div><div className="mt-1 h-1.5 rounded-full bg-slate-100"><div className="h-1.5 rounded-full bg-slate-950" style={{ width: `${invoice.confidence}%` }} /></div></td>
                          <td className="px-5 py-4"><StatusBadge status={invoice.status} /></td>
                          <td className="px-5 py-4"><span className={invoice.issue === "없음" ? "text-slate-400" : "font-semibold text-red-600"}>{invoice.issue}</span></td>
                          <td className="px-5 py-4"><Button variant="light" onClick={() => { setSelectedInvoice(invoice); setModal("invoiceDetail"); }}>검수</Button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card>
              </div>
            )}

            {activeTab === "templates" && (
              <div className="space-y-6">
                <Card className="p-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-lg font-black">학교별 인보이스 양식 해결 구조</h3>
                      <p className="text-sm text-slate-500">학교마다 양식이 달라도 최종 저장 필드는 하나의 표준 데이터로 통일합니다.</p>
                    </div>
                    <Button onClick={() => setModal("template")}>➕ 템플릿 추가</Button>
                  </div>
                  <div className="mt-5 grid gap-3 md:grid-cols-4">
                    {["파일 수집", "OCR/파싱", "템플릿 매핑", "예외 검수"].map((step, index) => (
                      <div key={step} className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs font-black text-blue-600">0{index + 1}</p>
                        <p className="mt-1 font-black">{step}</p>
                        <p className="mt-1 text-sm text-slate-500">표준 필드로 자동 정규화</p>
                      </div>
                    ))}
                  </div>
                </Card>
                <Card className="overflow-x-auto">
                  <table className="w-full min-w-[850px] text-left text-sm">
                    <thead className="bg-slate-100 text-xs uppercase text-slate-500">
                      <tr><th className="px-5 py-4">학교</th><th className="px-5 py-4">템플릿</th><th className="px-5 py-4">추출 필드</th><th className="px-5 py-4">성공률</th><th className="px-5 py-4">상태</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {templates.map((template) => (
                        <tr key={template.school + template.template} className="bg-white/70 hover:bg-blue-50/60">
                          <td className="px-5 py-4 font-black">{template.school}</td><td className="px-5 py-4">{template.template}</td><td className="px-5 py-4 text-slate-600">{template.fields}</td><td className="px-5 py-4"><strong>{template.successRate}%</strong></td><td className="px-5 py-4"><StatusBadge status={template.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card>
              </div>
            )}

            {activeTab === "policy" && (
              <div className="grid gap-6 xl:grid-cols-2">
                <Card className="p-6">
                  <h3 className="text-lg font-black">정책/한도 관리</h3>
                  <p className="text-sm text-slate-500">정책 수정 버튼을 누르면 한도가 즉시 변경됩니다.</p>
                  <div className="mt-6 space-y-3">
                    {policies.map((policy) => (
                      <div key={policy.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-black">{policy.title}</p>
                          <Button variant="light" onClick={() => { setPolicies(policies.map((item) => item.id === policy.id ? { ...item, limit: Number(item.limit) + 1000 } : item)); setNotice(`${policy.title} 한도를 1,000 상향 조정했습니다.`); }}>한도 +1000</Button>
                        </div>
                        <p className="mt-1 text-sm text-slate-700">자녀 1명당 연간 {policy.limit.toLocaleString()} {policy.currency}</p>
                        <p className="mt-1 text-xs text-slate-500">{policy.region} · {policy.note}</p>
                      </div>
                    ))}
                  </div>
                </Card>
                <Card className="p-6">
                  <h3 className="text-lg font-black">자동 검증 룰</h3>
                  <p className="text-sm text-slate-500">인보이스 등록 시 실제로 검증 로직이 적용됩니다.</p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {["직원/자녀 매칭 실패", "동일 인보이스 번호 중복", "필수값 누락", "정책 한도 초과/임박", "OCR 신뢰도 80% 미만", "학교별 템플릿 미등록"].map((rule) => (
                      <div key={rule} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4"><span>✅</span><p className="text-sm font-semibold text-slate-700">{rule}</p></div>
                    ))}
                  </div>
                </Card>
              </div>
            )}
          </section>
        </main>
      </div>

      {modal === "employee" && (
        <Modal title="직원/자녀 신규 등록" onClose={() => setModal(null)}>
          <form onSubmit={addEmployee} className="grid gap-4 md:grid-cols-2">
            <Field label="직원명" value={employeeForm.name} onChange={(value) => setEmployeeForm({ ...employeeForm, name: value })} />
            <Field label="국가" value={employeeForm.country} onChange={(value) => setEmployeeForm({ ...employeeForm, country: value })} />
            <Field label="부서" value={employeeForm.department} onChange={(value) => setEmployeeForm({ ...employeeForm, department: value })} />
            <Field label="자녀명" value={employeeForm.child} onChange={(value) => setEmployeeForm({ ...employeeForm, child: value })} />
            <Field label="학교" value={employeeForm.school} onChange={(value) => setEmployeeForm({ ...employeeForm, school: value })} />
            <Field label="학년" value={employeeForm.grade} onChange={(value) => setEmployeeForm({ ...employeeForm, grade: value })} />
            <Field label="연간 한도" type="number" value={employeeForm.policyLimit} onChange={(value) => setEmployeeForm({ ...employeeForm, policyLimit: value })} />
            <div className="flex items-end"><Button type="submit">등록 저장</Button></div>
          </form>
        </Modal>
      )}

      {modal === "invoice" && (
        <Modal title="인보이스 수동 등록" onClose={() => setModal(null)}>
          <form onSubmit={addInvoice} className="grid gap-4 md:grid-cols-2">
            <Field label="인보이스 번호" value={invoiceForm.no} onChange={(value) => setInvoiceForm({ ...invoiceForm, no: value })} />
            <Field label="직원" value={invoiceForm.employee} options={employees.map((employee) => employee.name)} onChange={(value) => { const employee = employees.find((item) => item.name === value); setInvoiceForm({ ...invoiceForm, employee: value, child: employee?.child || "", school: employee?.school || "" }); }} />
            <Field label="자녀" value={invoiceForm.child} onChange={(value) => setInvoiceForm({ ...invoiceForm, child: value })} />
            <Field label="학교" value={invoiceForm.school} onChange={(value) => setInvoiceForm({ ...invoiceForm, school: value })} />
            <Field label="항목" value={invoiceForm.category} options={["Tuition Fee", "Books & Materials", "School Trip", "School Bus", "Admission Fee"]} onChange={(value) => setInvoiceForm({ ...invoiceForm, category: value })} />
            <Field label="학기/기간" value={invoiceForm.term} onChange={(value) => setInvoiceForm({ ...invoiceForm, term: value })} />
            <Field label="금액" type="number" value={invoiceForm.amount} onChange={(value) => setInvoiceForm({ ...invoiceForm, amount: value })} />
            <Field label="통화" value={invoiceForm.currency} options={["USD", "EUR", "JPY", "SGD", "AED"]} onChange={(value) => setInvoiceForm({ ...invoiceForm, currency: value })} />
            <Field label="마감일" type="date" value={invoiceForm.dueDate} onChange={(value) => setInvoiceForm({ ...invoiceForm, dueDate: value })} />
            <Field label="OCR 신뢰도" type="number" value={invoiceForm.confidence} onChange={(value) => setInvoiceForm({ ...invoiceForm, confidence: value })} />
            <div className="md:col-span-2 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">저장 시 직원/자녀 매칭, 중복번호, 필수값, 한도, OCR 신뢰도를 자동 검증합니다.</div>
            <Button type="submit">검증 후 등록</Button>
          </form>
        </Modal>
      )}

      {modal === "invoiceDetail" && selectedInvoice && (
        <Modal title={`인보이스 검수 · ${selectedInvoice.no}`} onClose={() => setModal(null)}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-bold text-slate-500">학교/템플릿</p><p className="mt-1 font-bold">{selectedInvoice.school}</p><p className="text-sm text-slate-500">{selectedInvoice.template}</p></div>
            <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-bold text-slate-500">OCR 신뢰도</p><p className="mt-1 text-2xl font-bold">{selectedInvoice.confidence}%</p></div>
            <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-bold text-slate-500">직원/자녀</p><p className="mt-1 font-bold">{selectedInvoice.employee} / {selectedInvoice.child}</p></div>
            <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-bold text-slate-500">금액</p><p className="mt-1 font-bold">{Number(selectedInvoice.amount).toLocaleString()} {selectedInvoice.currency}</p></div>
            <div className="md:col-span-2 rounded-2xl border border-red-100 bg-red-50 p-4"><p className="text-xs font-bold text-red-500">검증 이슈</p><p className="mt-1 font-semibold text-red-700">{selectedInvoice.issue}</p></div>
            <div className="md:col-span-2 flex flex-wrap gap-2"><Button onClick={() => updateInvoiceStatus(selectedInvoice.no, "승인완료")}>✅ 승인</Button><Button variant="light" onClick={() => updateInvoiceStatus(selectedInvoice.no, "보류")}>⏳ 보류</Button><Button variant="danger" onClick={() => updateInvoiceStatus(selectedInvoice.no, "반려")}>❌ 반려</Button></div>
          </div>
        </Modal>
      )}

      {modal === "template" && (
        <Modal title="학교별 인보이스 템플릿 추가" onClose={() => setModal(null)}>
          <form onSubmit={addTemplate} className="grid gap-4 md:grid-cols-2">
            <Field label="학교명" value={templateForm.school} onChange={(value) => setTemplateForm({ ...templateForm, school: value })} />
            <Field label="템플릿명" value={templateForm.template} onChange={(value) => setTemplateForm({ ...templateForm, template: value })} />
            <Field label="추출 필드" value={templateForm.fields} onChange={(value) => setTemplateForm({ ...templateForm, fields: value })} />
            <Field label="예상 성공률" type="number" value={templateForm.successRate} onChange={(value) => setTemplateForm({ ...templateForm, successRate: value })} />
            <Field label="상태" value={templateForm.status} options={["활성", "검수필요"]} onChange={(value) => setTemplateForm({ ...templateForm, status: value })} />
            <div className="flex items-end"><Button type="submit">템플릿 저장</Button></div>
            <div className="md:col-span-2 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">실제 서비스에서는 학교별 샘플 인보이스 3~5장을 업로드해 필드 위치를 학습/저장하고, 이후 같은 학교의 인보이스는 자동으로 표준 필드에 매핑합니다.</div>
          </form>
        </Modal>
      )}
    </div>
  );
}

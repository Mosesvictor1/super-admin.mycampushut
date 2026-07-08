// Centralized seeded mock data source for the CampusHut admin dashboard.
// All pages, KPIs, charts, tables, and feeds read from here so switching to a
// real API later is a single-module change.

export type Plan = "Free" | "Basic" | "Premium";
export type UserStatus = "Active" | "Inactive" | "Suspended";

/* ------------------------------------------------------------------ */
/* Platform Overview                                                  */
/* ------------------------------------------------------------------ */

export const overviewKPIs = {
  totalStudents: { value: 125_420, delta: 12.4 },
  dau: { value: 18_540, delta: 8.2 },
  mrr: { value: 84_200, delta: 15.7 },
  activeSubs: { value: 3_421, delta: -2.1 },
};

export const studentGrowth = [
  { m: "Apr", students: 68200, active: 9800 },
  { m: "May", students: 72400, active: 10500 },
  { m: "Jun", students: 78900, active: 11800 },
  { m: "Jul", students: 84300, active: 12900 },
  { m: "Aug", students: 91200, active: 13700 },
  { m: "Sep", students: 96500, active: 14600 },
  { m: "Oct", students: 102800, active: 15400 },
  { m: "Nov", students: 108400, active: 16100 },
  { m: "Dec", students: 112900, active: 16800 },
  { m: "Jan", students: 117200, active: 17500 },
  { m: "Feb", students: 121800, active: 18100 },
  { m: "Mar", students: 125420, active: 18540 },
];

export const planDistribution = [
  { name: "Free" as Plan, value: 64, count: 80_269, color: "oklch(0.75 0.02 250)" },
  { name: "Basic" as Plan, value: 24, count: 30_101, color: "oklch(0.55 0.15 240)" },
  { name: "Premium" as Plan, value: 12, count: 15_050, color: "oklch(0.62 0.17 148)" },
];

export const topUniversities = [
  { name: "University of Lagos", v: 14200 },
  { name: "University of Ibadan", v: 11800 },
  { name: "Obafemi Awolowo University", v: 10400 },
  { name: "Ahmadu Bello University", v: 9200 },
  { name: "University of Nigeria, Nsukka", v: 8600 },
  { name: "Covenant University", v: 7100 },
  { name: "University of Benin", v: 6300 },
];

export const applicationFunnel = [
  { stage: "Applied", v: 12800, c: "oklch(0.62 0.17 148)" },
  { stage: "Reviewed", v: 7400, c: "oklch(0.65 0.16 175)" },
  { stage: "Shortlisted", v: 3100, c: "oklch(0.55 0.15 240)" },
  { stage: "Hired", v: 820, c: "oklch(0.72 0.18 50)" },
];

/* ------------------------------------------------------------------ */
/* Users Analytics                                                    */
/* ------------------------------------------------------------------ */

export const userKPIs = {
  newSignups: { value: 4_820, delta: 18.6 },
  retention30d: { value: 72.4, delta: 3.1 },
  avgSession: { value: "14m 32s", delta: 5.4 },
  activationRate: { value: 61.8, delta: -1.2 },
};

export const dailyActive = [
  { d: "Mon", dau: 16_820, wau: 42_100 },
  { d: "Tue", dau: 17_940, wau: 43_800 },
  { d: "Wed", dau: 18_320, wau: 44_600 },
  { d: "Thu", dau: 18_780, wau: 45_200 },
  { d: "Fri", dau: 19_120, wau: 46_800 },
  { d: "Sat", dau: 15_420, wau: 47_100 },
  { d: "Sun", dau: 14_820, wau: 47_400 },
];

export const cohortRetention = [
  { cohort: "Jan", w1: 100, w2: 74, w3: 61, w4: 52, w8: 41, w12: 34 },
  { cohort: "Feb", w1: 100, w2: 76, w3: 63, w4: 55, w8: 43, w12: 36 },
  { cohort: "Mar", w1: 100, w2: 78, w3: 66, w4: 58, w8: 46, w12: 38 },
  { cohort: "Apr", w1: 100, w2: 81, w3: 68, w4: 60, w8: 48, w12: 0 },
  { cohort: "May", w1: 100, w2: 82, w3: 70, w4: 62, w8: 0, w12: 0 },
  { cohort: "Jun", w1: 100, w2: 84, w3: 72, w4: 0, w8: 0, w12: 0 },
];

export const geoDistribution = [
  { region: "Lagos", pct: 22, users: 27_593 },
  { region: "Abuja", pct: 18, users: 22_575 },
  { region: "Ibadan", pct: 16, users: 20_067 },
  { region: "Port Harcourt", pct: 11, users: 13_796 },
  { region: "Benin City", pct: 9, users: 11_287 },
  { region: "Kano", pct: 8, users: 10_033 },
  { region: "Other", pct: 16, users: 20_069 },
];

export const deviceSplit = [
  { name: "Mobile", value: 68, color: "oklch(0.62 0.17 148)" },
  { name: "Desktop", value: 26, color: "oklch(0.55 0.15 240)" },
  { name: "Tablet", value: 6, color: "oklch(0.72 0.18 50)" },
];

export const studentRows: {
  name: string;
  email: string;
  university: string;
  plan: Plan;
  lastActive: string;
  status: UserStatus;
}[] = [
  { name: "Chinedu Okafor", email: "chinedu@unilag.edu.ng", university: "University of Lagos", plan: "Premium", lastActive: "2 min ago", status: "Active" },
  { name: "Aisha Bello", email: "aisha@abu.edu.ng", university: "Ahmadu Bello University", plan: "Premium", lastActive: "12 min ago", status: "Active" },
  { name: "Tunde Adebayo", email: "tunde@ui.edu.ng", university: "University of Ibadan", plan: "Basic", lastActive: "1 hr ago", status: "Active" },
  { name: "Ngozi Eze", email: "ngozi@unn.edu.ng", university: "University of Nigeria, Nsukka", plan: "Free", lastActive: "3 hr ago", status: "Inactive" },
  { name: "Emeka Nwosu", email: "emeka@oauife.edu.ng", university: "Obafemi Awolowo University", plan: "Premium", lastActive: "5 hr ago", status: "Active" },
  { name: "Fatima Ibrahim", email: "fatima@buk.edu.ng", university: "Bayero University Kano", plan: "Basic", lastActive: "1 day ago", status: "Suspended" },
  { name: "Oluwaseun Adeyemi", email: "seun@covenantuniversity.edu.ng", university: "Covenant University", plan: "Basic", lastActive: "2 days ago", status: "Active" },
  { name: "Chiamaka Obi", email: "chiamaka@uniben.edu", university: "University of Benin", plan: "Free", lastActive: "3 days ago", status: "Inactive" },
  { name: "Ibrahim Musa", email: "ibrahim@futminna.edu.ng", university: "FUT Minna", plan: "Premium", lastActive: "20 min ago", status: "Active" },
  { name: "Yetunde Ajayi", email: "yetunde@lasu.edu.ng", university: "Lagos State University", plan: "Premium", lastActive: "45 min ago", status: "Active" },
  { name: "Kelechi Nnamdi", email: "kelechi@babcock.edu.ng", university: "Babcock University", plan: "Basic", lastActive: "6 hr ago", status: "Active" },
  { name: "Hauwa Sani", email: "hauwa@unimaid.edu.ng", university: "University of Maiduguri", plan: "Free", lastActive: "4 days ago", status: "Suspended" },
];

/* ------------------------------------------------------------------ */
/* Finance & Subscription                                             */
/* ------------------------------------------------------------------ */

export const financeKPIs = {
  mrr: { value: "₦84,200", delta: 15.7 },
  arr: { value: "₦1.01M", delta: 22.4 },
  arpu: { value: "₦246", delta: 4.8 },
  churn: { value: "3.4%", delta: -0.6 },
};

export const revenueTrend = [
  { m: "Apr", revenue: 42_100, target: 45_000 },
  { m: "May", revenue: 48_600, target: 50_000 },
  { m: "Jun", revenue: 54_200, target: 55_000 },
  { m: "Jul", revenue: 58_900, target: 60_000 },
  { m: "Aug", revenue: 63_400, target: 62_500 },
  { m: "Sep", revenue: 68_100, target: 65_000 },
  { m: "Oct", revenue: 72_800, target: 70_000 },
  { m: "Nov", revenue: 76_300, target: 74_000 },
  { m: "Dec", revenue: 79_100, target: 77_500 },
  { m: "Jan", revenue: 81_400, target: 80_000 },
  { m: "Feb", revenue: 82_900, target: 82_500 },
  { m: "Mar", revenue: 84_200, target: 84_000 },
];

export const revenueByPlan = [
  { name: "Premium", value: 58_940, color: "oklch(0.62 0.17 148)" },
  { name: "Basic", value: 22_720, color: "oklch(0.55 0.15 240)" },
  { name: "Add-ons", value: 2_540, color: "oklch(0.72 0.18 50)" },
];

export const paymentMethods = [
  { name: "Card", value: 46 },
  { name: "Bank Transfer", value: 32 },
  { name: "USSD", value: 14 },
  { name: "Wallet", value: 8 },
];

export const transactions = [
  { id: "TX-90214", user: "Chinedu Okafor", plan: "Premium" as Plan, amount: 24000, method: "Card", status: "Success" as const, date: "Today, 09:24" },
  { id: "TX-90213", user: "Aisha Bello", plan: "Premium" as Plan, amount: 24000, method: "Card", status: "Success" as const, date: "Today, 08:12" },
  { id: "TX-90212", user: "Tunde Adebayo", plan: "Basic" as Plan, amount: 8000, method: "Transfer", status: "Success" as const, date: "Today, 07:58" },
  { id: "TX-90211", user: "Ngozi Eze", plan: "Basic" as Plan, amount: 8000, method: "Card", status: "Failed" as const, date: "Yesterday, 22:41" },
  { id: "TX-90210", user: "Emeka Nwosu", plan: "Premium" as Plan, amount: 24000, method: "Transfer", status: "Success" as const, date: "Yesterday, 19:03" },
  { id: "TX-90209", user: "Fatima Ibrahim", plan: "Premium" as Plan, amount: 24000, method: "Card", status: "Refunded" as const, date: "Yesterday, 14:22" },
  { id: "TX-90208", user: "Oluwaseun Adeyemi", plan: "Basic" as Plan, amount: 8000, method: "Wallet", status: "Success" as const, date: "Yesterday, 11:07" },
  { id: "TX-90207", user: "Yetunde Ajayi", plan: "Premium" as Plan, amount: 24000, method: "Card", status: "Success" as const, date: "2 days ago" },
];

/* ------------------------------------------------------------------ */
/* Jobs Analytics                                                     */
/* ------------------------------------------------------------------ */

export const jobsKPIs = {
  activeJobs: { value: 842, delta: 6.4 },
  applications: { value: 12_800, delta: 21.3 },
  interviews: { value: 1_940, delta: 9.7 },
  hired: { value: 820, delta: 14.2 },
};

export const applicationsOverTime = [
  { d: "W1", applied: 1420, interviews: 220, hired: 84 },
  { d: "W2", applied: 1680, interviews: 260, hired: 96 },
  { d: "W3", applied: 1520, interviews: 240, hired: 88 },
  { d: "W4", applied: 1890, interviews: 290, hired: 110 },
  { d: "W5", applied: 2110, interviews: 320, hired: 128 },
  { d: "W6", applied: 2240, interviews: 340, hired: 142 },
  { d: "W7", applied: 2340, interviews: 360, hired: 158 },
];

export const topRoles = [
  { role: "Frontend Intern", apps: 1840 },
  { role: "Data Analyst", apps: 1620 },
  { role: "SDE-1", apps: 1420 },
  { role: "Product Intern", apps: 980 },
  { role: "ML Engineer", apps: 860 },
  { role: "UX Designer", apps: 640 },
];

export const topRecruiters = [
  { name: "Acme Labs", jobs: 42, hires: 18, rating: 4.8 },
  { name: "Nova Fintech", jobs: 38, hires: 14, rating: 4.6 },
  { name: "Orbit Health", jobs: 31, hires: 12, rating: 4.7 },
  { name: "Vega Robotics", jobs: 27, hires: 9, rating: 4.5 },
  { name: "Meridian AI", jobs: 24, hires: 11, rating: 4.9 },
];

/* ------------------------------------------------------------------ */
/* Assignments                                                        */
/* ------------------------------------------------------------------ */

export const assignmentKPIs = {
  active: { value: 214, delta: 3.2 },
  submissionRate: { value: 82.6, delta: 4.1 },
  onTime: { value: 74.2, delta: 2.4 },
  overdue: { value: 186, delta: -6.8 },
};

export const submissionByWeek = [
  { w: "W1", onTime: 620, late: 140, missed: 60 },
  { w: "W2", onTime: 680, late: 130, missed: 55 },
  { w: "W3", onTime: 710, late: 120, missed: 50 },
  { w: "W4", onTime: 740, late: 110, missed: 48 },
  { w: "W5", onTime: 790, late: 105, missed: 44 },
  { w: "W6", onTime: 820, late: 100, missed: 40 },
];

export const assignmentsList = [
  { title: "Neural Networks — Homework 3", course: "Deep Learning 401", due: "In 2 days", submissions: 428, total: 512, avgScore: 84 },
  { title: "SQL Joins Practice Set", course: "Database Systems", due: "In 4 days", submissions: 612, total: 720, avgScore: 78 },
  { title: "React Hooks Deep Dive", course: "Frontend Masterclass", due: "Tomorrow", submissions: 340, total: 420, avgScore: 88 },
  { title: "Linear Regression Lab", course: "Statistics 201", due: "Overdue", submissions: 189, total: 380, avgScore: 71 },
  { title: "Docker & CI/CD Setup", course: "DevOps Foundations", due: "In 6 days", submissions: 210, total: 360, avgScore: 82 },
  { title: "Product Case Study", course: "Product Management", due: "In 8 days", submissions: 128, total: 240, avgScore: 79 },
];

/* ------------------------------------------------------------------ */
/* AI Courses                                                         */
/* ------------------------------------------------------------------ */

export const aiCourseKPIs = {
  enrollments: { value: 42_180, delta: 24.6 },
  completion: { value: 68.4, delta: 4.2 },
  aiSessions: { value: 128_400, delta: 32.1 },
  csat: { value: 4.7, delta: 0.3 },
};

export const enrollmentTrend = [
  { m: "Apr", enrolled: 2400, completed: 1420 },
  { m: "May", enrolled: 2820, completed: 1690 },
  { m: "Jun", enrolled: 3120, completed: 1980 },
  { m: "Jul", enrolled: 3480, completed: 2210 },
  { m: "Aug", enrolled: 3820, completed: 2480 },
  { m: "Sep", enrolled: 4160, completed: 2740 },
  { m: "Oct", enrolled: 4520, completed: 3020 },
  { m: "Nov", enrolled: 4860, completed: 3280 },
];

export const aiCourses = [
  { title: "Generative AI Fundamentals", students: 8420, completion: 78, rating: 4.9, hours: 12 },
  { title: "Prompt Engineering Pro", students: 6210, completion: 74, rating: 4.8, hours: 8 },
  { title: "LLM App Development", students: 5480, completion: 66, rating: 4.7, hours: 18 },
  { title: "Computer Vision with PyTorch", students: 4120, completion: 62, rating: 4.6, hours: 22 },
  { title: "Ethics & Safety in AI", students: 3860, completion: 82, rating: 4.9, hours: 6 },
  { title: "MLOps in Production", students: 3210, completion: 58, rating: 4.5, hours: 20 },
];

/* ------------------------------------------------------------------ */
/* Learning Library                                                   */
/* ------------------------------------------------------------------ */

export const libraryKPIs = {
  resources: { value: 8_420, delta: 6.1 },
  views30d: { value: 214_800, delta: 18.4 },
  avgRating: { value: 4.6, delta: 0.2 },
  hoursConsumed: { value: 42_100, delta: 12.9 },
};

export const resourceByType = [
  { name: "Video", value: 42, color: "oklch(0.62 0.17 148)" },
  { name: "Article", value: 28, color: "oklch(0.55 0.15 240)" },
  { name: "PDF/Notes", value: 18, color: "oklch(0.65 0.18 300)" },
  { name: "Interactive", value: 12, color: "oklch(0.72 0.18 50)" },
];

export const topResources = [
  { title: "System Design Primer", type: "Video", views: 24_820, rating: 4.9 },
  { title: "DSA Cheatsheet — 2026 Edition", type: "PDF", views: 21_140, rating: 4.8 },
  { title: "SQL Interview Playbook", type: "Article", views: 18_620, rating: 4.7 },
  { title: "React Performance Patterns", type: "Video", views: 15_940, rating: 4.8 },
  { title: "Product Sense Framework", type: "Interactive", views: 14_210, rating: 4.6 },
  { title: "Behavioral Interview Bank", type: "Article", views: 12_840, rating: 4.7 },
];

/* ------------------------------------------------------------------ */
/* Reports                                                            */
/* ------------------------------------------------------------------ */

export const reportsList = [
  { name: "Monthly Revenue Digest", type: "Finance", schedule: "1st of month", format: "PDF", owner: "Finance Ops", lastRun: "Mar 1, 2026" },
  { name: "Weekly Growth Snapshot", type: "Users", schedule: "Every Monday", format: "CSV", owner: "Growth Team", lastRun: "Yesterday" },
  { name: "Placement & Hiring Report", type: "Jobs", schedule: "Bi-weekly", format: "PDF", owner: "Placements", lastRun: "Mar 18, 2026" },
  { name: "AI Learning Engagement", type: "Courses", schedule: "Weekly", format: "XLSX", owner: "Product", lastRun: "Mar 25, 2026" },
  { name: "Churn Deep-Dive", type: "Finance", schedule: "On demand", format: "PDF", owner: "Finance Ops", lastRun: "Mar 12, 2026" },
  { name: "System Audit Log", type: "Ops", schedule: "Daily", format: "CSV", owner: "Platform SRE", lastRun: "Today, 06:00" },
];

export const auditEvents = [
  { actor: "Adebayo Ogunleye", action: "Updated pricing tier", target: "Plan: Premium", time: "10 min ago" },
  { actor: "Chidinma Umeh", action: "Exported CSV", target: "Users (all)", time: "42 min ago" },
  { actor: "System", action: "Auto-backup completed", target: "DB snapshot", time: "3 h ago" },
  { actor: "Ibrahim Danjuma", action: "Suspended user", target: "hauwa@unimaid.edu.ng", time: "5 h ago" },
  { actor: "Adebayo Ogunleye", action: "Rotated API key", target: "Payments webhook", time: "Yesterday" },
];

/* ------------------------------------------------------------------ */
/* Marketplace & Vendors                                              */
/* ------------------------------------------------------------------ */

export type VendorStatus = "Active" | "Pending" | "Suspended";
export type VendorTier = "Standard" | "Verified" | "Elite";

export const marketplaceKPIs = {
  gmv: { value: "₦42.8M", delta: 18.9 },
  vendors: { value: 486, delta: 12.4 },
  orders: { value: 24_140, delta: 22.1 },
  takeRate: { value: "8.4%", delta: 0.6 },
};

export const gmvTrend = [
  { m: "Apr", gmv: 18.4, orders: 12100 },
  { m: "May", gmv: 21.2, orders: 13800 },
  { m: "Jun", gmv: 24.6, orders: 15400 },
  { m: "Jul", gmv: 27.9, orders: 16900 },
  { m: "Aug", gmv: 30.4, orders: 18200 },
  { m: "Sep", gmv: 33.1, orders: 19700 },
  { m: "Oct", gmv: 36.2, orders: 21100 },
  { m: "Nov", gmv: 38.8, orders: 22400 },
  { m: "Dec", gmv: 40.6, orders: 23200 },
  { m: "Jan", gmv: 41.7, orders: 23700 },
  { m: "Feb", gmv: 42.2, orders: 23980 },
  { m: "Mar", gmv: 42.8, orders: 24140 },
];

export const vendorCategories = [
  { name: "Textbooks", value: 28, color: "oklch(0.62 0.17 148)" },
  { name: "Electronics", value: 22, color: "oklch(0.55 0.15 240)" },
  { name: "Fashion", value: 18, color: "oklch(0.65 0.18 300)" },
  { name: "Food & Snacks", value: 14, color: "oklch(0.72 0.18 50)" },
  { name: "Services", value: 10, color: "oklch(0.65 0.16 175)" },
  { name: "Other", value: 8, color: "oklch(0.70 0.02 250)" },
];

export const topVendors: {
  name: string;
  owner: string;
  category: string;
  gmv: number;
  orders: number;
  rating: number;
  tier: VendorTier;
  status: VendorStatus;
  joined: string;
}[] = [
  { name: "Naija Book Hub", owner: "Chinedu Okafor", category: "Textbooks", gmv: 4_820_000, orders: 2140, rating: 4.9, tier: "Elite", status: "Active", joined: "Jan 2024" },
  { name: "Campus Tech Store", owner: "Aisha Bello", category: "Electronics", gmv: 3_940_000, orders: 1620, rating: 4.8, tier: "Verified", status: "Active", joined: "Mar 2024" },
  { name: "Ankara Threads", owner: "Yetunde Ajayi", category: "Fashion", gmv: 2_610_000, orders: 1840, rating: 4.7, tier: "Verified", status: "Active", joined: "May 2024" },
  { name: "Jollof Express", owner: "Emeka Nwosu", category: "Food & Snacks", gmv: 1_980_000, orders: 3120, rating: 4.6, tier: "Standard", status: "Active", joined: "Jun 2024" },
  { name: "Lagos Print Works", owner: "Tunde Adebayo", category: "Services", gmv: 1_420_000, orders: 980, rating: 4.5, tier: "Standard", status: "Active", joined: "Aug 2024" },
  { name: "Naija Gadgets Co.", owner: "Ibrahim Musa", category: "Electronics", gmv: 1_180_000, orders: 640, rating: 4.4, tier: "Verified", status: "Pending", joined: "Feb 2026" },
  { name: "Sabi Notes", owner: "Ngozi Eze", category: "Textbooks", gmv: 940_000, orders: 720, rating: 4.3, tier: "Standard", status: "Active", joined: "Sep 2024" },
  { name: "Kampus Kicks", owner: "Kelechi Nnamdi", category: "Fashion", gmv: 820_000, orders: 540, rating: 4.2, tier: "Standard", status: "Active", joined: "Nov 2024" },
  { name: "Quick Print NG", owner: "Oluwaseun Adeyemi", category: "Services", gmv: 610_000, orders: 420, rating: 4.1, tier: "Standard", status: "Suspended", joined: "Oct 2024" },
  { name: "Zaria Snacks", owner: "Fatima Ibrahim", category: "Food & Snacks", gmv: 480_000, orders: 890, rating: 4.0, tier: "Standard", status: "Pending", joined: "Feb 2026" },
];

export const marketplaceOrders = [
  { id: "OR-58120", buyer: "Chiamaka Obi", vendor: "Naija Book Hub", items: 3, amount: 18400, status: "Delivered" as const, date: "Today, 10:12" },
  { id: "OR-58119", buyer: "Hauwa Sani", vendor: "Ankara Threads", items: 1, amount: 12500, status: "Shipped" as const, date: "Today, 09:41" },
  { id: "OR-58118", buyer: "Ibrahim Musa", vendor: "Campus Tech Store", items: 2, amount: 96000, status: "Processing" as const, date: "Today, 08:20" },
  { id: "OR-58117", buyer: "Aisha Bello", vendor: "Jollof Express", items: 4, amount: 6800, status: "Delivered" as const, date: "Yesterday, 20:14" },
  { id: "OR-58116", buyer: "Emeka Nwosu", vendor: "Lagos Print Works", items: 1, amount: 3500, status: "Cancelled" as const, date: "Yesterday, 16:02" },
  { id: "OR-58115", buyer: "Yetunde Ajayi", vendor: "Sabi Notes", items: 2, amount: 5200, status: "Delivered" as const, date: "Yesterday, 12:47" },
];

export const pendingVendors = [
  { name: "Naija Gadgets Co.", owner: "Ibrahim Musa", category: "Electronics", submitted: "2 days ago" },
  { name: "Zaria Snacks", owner: "Fatima Ibrahim", category: "Food & Snacks", submitted: "3 days ago" },
  { name: "Enugu Craft House", owner: "Ngozi Eze", category: "Fashion", submitted: "5 days ago" },
];

/* ------------------------------------------------------------------ */
/* News & Blog Post                                                   */
/* ------------------------------------------------------------------ */

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: "News" | "Blog";
  status: "Published" | "Draft";
  publishedAt: string;
  views: number;
  likes: number;
  coverImage: string;
}

export const initialBlogPosts: BlogPost[] = [
  {
    id: "post-1",
    title: "CampusHut Launches New AI Study Companion",
    excerpt: "We are excited to announce the launch of our new AI-powered study companion to help students learn faster and smarter.",
    content: "Today, CampusHut is taking a giant leap forward in student productivity. We have integrated state-of-the-art LLMs to create an interactive study partner available 24/7. Students can upload their course materials, generate custom quizzes, and get explanations of complex topics instantly. Early beta tests showed a 40% improvement in exam preparation speed...",
    author: "Adebayo Ogunleye",
    category: "News",
    status: "Published",
    publishedAt: "2026-07-05",
    views: 1240,
    likes: 312,
    coverImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: "post-2",
    title: "How to Manage Your Finances in University",
    excerpt: "A practical guide for college students on budgeting, saving money, and using CampusHut discounts.",
    content: "Finances in university can be stressful. Between textbooks, tuition, rent, and socializing, it is easy to run out of cash before the semester ends. In this article, we outline five key budgeting frameworks tailored specifically for Nigerian students. We also show how to leverage the CampusHut marketplace to find deals on shared student accommodation and textbooks...",
    author: "Sarah Johnson",
    category: "Blog",
    status: "Published",
    publishedAt: "2026-07-01",
    views: 890,
    likes: 215,
    coverImage: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: "post-3",
    title: "Top 10 Internship Opportunities for Summer 2026",
    excerpt: "Discover the highest-paying and most student-friendly remote internships available on CampusHut Jobs.",
    content: "Summer is just around the corner, and securing an internship is the best way to kickstart your career. We have partnered with top tech companies and consulting firms to list exclusive internship openings directly on our portal. Here is a curated list of the top ten roles, including qualifications, pay ranges, and tips on how to polish your resume to stand out...",
    author: "Michael Okeke",
    category: "Blog",
    status: "Draft",
    publishedAt: "2026-07-07",
    views: 0,
    likes: 0,
    coverImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=60"
  }
];

/* ------------------------------------------------------------------ */
/* Brand Ads                                                          */
/* ------------------------------------------------------------------ */

export type AdPlacement = "Dashboard Banner" | "Sidebar Ad" | "Job Board Sponsor" | "Marketplace Special";
export type AdStatus = "Active" | "Scheduled" | "Ended";

export interface BrandAd {
  id: string;
  companyName: string;
  campaignTitle: string;
  placement: AdPlacement;
  status: AdStatus;
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  startDate: string;
  endDate: string;
  targetAudience: string;
  imageUrl: string;
  linkUrl: string;
}

export const initialBrandAds: BrandAd[] = [
  {
    id: "ad-1",
    companyName: "Paystack",
    campaignTitle: "Student Developer Account Launch",
    placement: "Dashboard Banner",
    status: "Active",
    budget: 500000,
    spent: 320000,
    impressions: 45000,
    clicks: 3800,
    startDate: "2026-06-01",
    endDate: "2026-08-01",
    targetAudience: "Computer Science & Engineering Students",
    imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=60",
    linkUrl: "https://paystack.com"
  },
  {
    id: "ad-2",
    companyName: "PiggyVest",
    campaignTitle: "Target Savings Challenge for Students",
    placement: "Sidebar Ad",
    status: "Active",
    budget: 750000,
    spent: 150000,
    impressions: 120000,
    clicks: 8400,
    startDate: "2026-07-01",
    endDate: "2026-10-01",
    targetAudience: "All students (Focus: Finance)",
    imageUrl: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&auto=format&fit=crop&q=60",
    linkUrl: "https://piggyvest.com"
  },
  {
    id: "ad-3",
    companyName: "MTN Nigeria",
    campaignTitle: "Pulse Pulse Pulse - Student Data Bundle Deals",
    placement: "Marketplace Special",
    status: "Scheduled",
    budget: 1200000,
    spent: 0,
    impressions: 0,
    clicks: 0,
    startDate: "2026-07-15",
    endDate: "2026-09-15",
    targetAudience: "Ages 16-25, heavy data users",
    imageUrl: "https://images.unsplash.com/photo-1610484826967-09c5720778c7?w=800&auto=format&fit=crop&q=60",
    linkUrl: "https://mtn.ng"
  },
  {
    id: "ad-4",
    companyName: "AltSchool Africa",
    campaignTitle: "Learn Software Engineering - 20% Off Tuition",
    placement: "Job Board Sponsor",
    status: "Ended",
    budget: 400000,
    spent: 400000,
    impressions: 89000,
    clicks: 5200,
    startDate: "2026-04-01",
    endDate: "2026-06-30",
    targetAudience: "Final year students, job seekers",
    imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=60",
    linkUrl: "https://altschoolafrica.com"
  }
];

export const adPerformanceTrend = [
  { day: "Mon", impressions: 18000, clicks: 1240 },
  { day: "Tue", impressions: 22000, clicks: 1530 },
  { day: "Wed", impressions: 24500, clicks: 1890 },
  { day: "Thu", impressions: 28000, clicks: 2100 },
  { day: "Fri", impressions: 32000, clicks: 2420 },
  { day: "Sat", impressions: 21000, clicks: 1560 },
  { day: "Sun", impressions: 19500, clicks: 1480 },
];


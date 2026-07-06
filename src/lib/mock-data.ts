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
  { region: "Delhi NCR", pct: 22, users: 27_593 },
  { region: "Mumbai", pct: 18, users: 22_575 },
  { region: "Bangalore", pct: 16, users: 20_067 },
  { region: "Hyderabad", pct: 11, users: 13_796 },
  { region: "Chennai", pct: 9, users: 11_287 },
  { region: "Pune", pct: 8, users: 10_033 },
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
  { name: "Ananya Sharma", email: "ananya@iitb.ac.in", university: "IIT Bombay", plan: "Premium", lastActive: "2 min ago", status: "Active" },
  { name: "Karan Mehta", email: "karan@bits.ac.in", university: "BITS Pilani", plan: "Premium", lastActive: "12 min ago", status: "Active" },
  { name: "Riya Patel", email: "riya@du.ac.in", university: "Delhi University", plan: "Basic", lastActive: "1 hr ago", status: "Active" },
  { name: "Mohit Verma", email: "mohit@dtu.ac.in", university: "DTU", plan: "Free", lastActive: "3 hr ago", status: "Inactive" },
  { name: "Sneha Reddy", email: "sneha@iisc.ac.in", university: "IISc Bangalore", plan: "Premium", lastActive: "5 hr ago", status: "Active" },
  { name: "Arjun Singh", email: "arjun@iitm.ac.in", university: "IIT Madras", plan: "Basic", lastActive: "1 day ago", status: "Suspended" },
  { name: "Pooja Iyer", email: "pooja@nitt.edu", university: "NIT Trichy", plan: "Basic", lastActive: "2 days ago", status: "Active" },
  { name: "Vikram Joshi", email: "vikram@vit.ac.in", university: "VIT Vellore", plan: "Free", lastActive: "3 days ago", status: "Inactive" },
  { name: "Neha Kapoor", email: "neha@iiitd.ac.in", university: "IIIT Delhi", plan: "Premium", lastActive: "20 min ago", status: "Active" },
  { name: "Rahul Nair", email: "rahul@iitk.ac.in", university: "IIT Kanpur", plan: "Premium", lastActive: "45 min ago", status: "Active" },
  { name: "Tara Bose", email: "tara@jadav.edu", university: "Jadavpur University", plan: "Basic", lastActive: "6 hr ago", status: "Active" },
  { name: "Imran Khan", email: "imran@amu.ac.in", university: "AMU", plan: "Free", lastActive: "4 days ago", status: "Suspended" },
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
  { name: "UPI", value: 46 },
  { name: "Card", value: 32 },
  { name: "Netbanking", value: 14 },
  { name: "Wallet", value: 8 },
];

export const transactions = [
  { id: "TX-90214", user: "Ananya Sharma", plan: "Premium" as Plan, amount: 24000, method: "UPI", status: "Success" as const, date: "Today, 09:24" },
  { id: "TX-90213", user: "Karan Mehta", plan: "Premium" as Plan, amount: 24000, method: "Card", status: "Success" as const, date: "Today, 08:12" },
  { id: "TX-90212", user: "Riya Patel", plan: "Basic" as Plan, amount: 8000, method: "UPI", status: "Success" as const, date: "Today, 07:58" },
  { id: "TX-90211", user: "Mohit Verma", plan: "Basic" as Plan, amount: 8000, method: "Card", status: "Failed" as const, date: "Yesterday, 22:41" },
  { id: "TX-90210", user: "Sneha Reddy", plan: "Premium" as Plan, amount: 24000, method: "Netbanking", status: "Success" as const, date: "Yesterday, 19:03" },
  { id: "TX-90209", user: "Arjun Singh", plan: "Premium" as Plan, amount: 24000, method: "UPI", status: "Refunded" as const, date: "Yesterday, 14:22" },
  { id: "TX-90208", user: "Pooja Iyer", plan: "Basic" as Plan, amount: 8000, method: "Wallet", status: "Success" as const, date: "Yesterday, 11:07" },
  { id: "TX-90207", user: "Neha Kapoor", plan: "Premium" as Plan, amount: 24000, method: "UPI", status: "Success" as const, date: "2 days ago" },
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
  { actor: "Aarav Khanna", action: "Updated pricing tier", target: "Plan: Premium", time: "10 min ago" },
  { actor: "Priya Menon", action: "Exported CSV", target: "Users (all)", time: "42 min ago" },
  { actor: "System", action: "Auto-backup completed", target: "DB snapshot", time: "3 h ago" },
  { actor: "Rohit Das", action: "Suspended user", target: "imran@amu.ac.in", time: "5 h ago" },
  { actor: "Aarav Khanna", action: "Rotated API key", target: "Payments webhook", time: "Yesterday" },
];

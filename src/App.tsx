import { Routes, Route } from "react-router-dom";
import IndexPage from "./pages/Index";
import PlatformPage from "./pages/Platform";
import UsersInsightsPage from "./pages/UsersInsights";
import FinancePage from "./pages/Finance";
import JobsPage from "./pages/Jobs";
import AssignmentsPage from "./pages/Assignments";
import MarketplacePage from "./pages/Marketplace";
import AiCoursesPage from "./pages/AiCourses";
import LibraryPage from "./pages/Library";
import ReportsPage from "./pages/Reports";
import SettingsPage from "./pages/Settings";
import NotFoundPage from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<IndexPage />} />
      <Route path="/platform" element={<PlatformPage />} />
      <Route path="/users" element={<UsersInsightsPage />} />
      <Route path="/finance" element={<FinancePage />} />
      <Route path="/jobs" element={<JobsPage />} />
      <Route path="/assignments" element={<AssignmentsPage />} />
      <Route path="/marketplace" element={<MarketplacePage />} />
      <Route path="/ai-courses" element={<AiCoursesPage />} />
      <Route path="/library" element={<LibraryPage />} />
      <Route path="/reports" element={<ReportsPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

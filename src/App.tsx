import { Navigate, Routes, Route } from "react-router-dom";
import PlatformPage from "./pages/Platform";
import UsersInsightsPage from "./pages/UsersInsights";
import FinancePage from "./pages/Finance";
import JobsPage from "./pages/Jobs";
import AssignmentsPage from "./pages/Assignments";
import MarketplacePage from "./pages/Marketplace";
import AiCoursesPage from "./pages/AiCourses";
import LibraryPage from "./pages/Library";
import NewsBlogPage from "./pages/NewsBlog";
import BrandPage from "./pages/Brand";
import ReportsPage from "./pages/Reports";
import NotFoundPage from "./pages/NotFound";
import { dashboardModules } from "./lib/dashboard-modules";

export default function App() {
  const unavailable = <Navigate to="/" replace />;

  return (
    <Routes>
      <Route path="/" element={dashboardModules.platform ? <PlatformPage /> : <NotFoundPage />} />
      <Route
        path="/platform"
        element={dashboardModules.platform ? <PlatformPage /> : unavailable}
      />
      <Route path="/users" element={dashboardModules.users ? <UsersInsightsPage /> : unavailable} />
      <Route path="/finance" element={dashboardModules.finance ? <FinancePage /> : unavailable} />
      <Route path="/jobs" element={dashboardModules.jobs ? <JobsPage /> : unavailable} />
      <Route
        path="/assignments"
        element={dashboardModules.assignments ? <AssignmentsPage /> : unavailable}
      />
      <Route
        path="/marketplace"
        element={dashboardModules.marketplace ? <MarketplacePage /> : unavailable}
      />
      <Route
        path="/ai-courses"
        element={dashboardModules.aiCourses ? <AiCoursesPage /> : unavailable}
      />
      <Route path="/library" element={dashboardModules.library ? <LibraryPage /> : unavailable} />
      <Route
        path="/news-blog"
        element={dashboardModules.newsBlog ? <NewsBlogPage /> : unavailable}
      />
      <Route path="/brand" element={dashboardModules.brand ? <BrandPage /> : unavailable} />
      <Route path="/reports" element={dashboardModules.reports ? <ReportsPage /> : unavailable} />
      <Route path="/settings" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

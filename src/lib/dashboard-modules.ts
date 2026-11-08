export const dashboardModules = {
  platform: true,
  users: true,
  finance: true,
  aiCourses: true,
  jobs: false,
  assignments: false,
  marketplace: false,
  library: false,
  newsBlog: false,
  brand: false,
  reports: false,
} as const;

export type DashboardModule = keyof typeof dashboardModules;

const API_BASE_URL = (
  import.meta.env.VITE_CAMPUSHUT_API_URL ??
  "https://staging.mycampushut.com/campusHutNews"
).replace(/\/+$/, "");

export interface NewsArticle {
  id?: number;
  title?: string;
  newsType?: string;
  summary?: string;
  content?: string;
  author?: string;
  imageUrl?: string;
  status?: string;
  createdAt?: string;
  [key: string]: unknown;
}

export interface AppVersionRequest {
  platform: "ANDROID" | "IOS";
  version: string;
  buildNumber: number;
  downloadUrl: string;
  active: boolean;
}

export interface ApiRequestOptions extends RequestInit {
  query?: Record<string, string | number | boolean | undefined>;
}

export async function contentApiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { query, headers, ...init } = options;
  const url = new URL(`${API_BASE_URL}${path}`);
  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
  });

  const response = await fetch(url, {
    ...init,
    headers: { Accept: "application/json", ...headers },
  });
  const contentType = response.headers.get("content-type") ?? "";
  const result = contentType.includes("json")
    ? await response.json().catch(() => null)
    : await response.text().catch(() => "");

  if (!response.ok) {
    const message =
      typeof result === "object" && result !== null && "message" in result
        ? String((result as { message: unknown }).message)
        : typeof result === "string" && result.trim()
          ? result
          : `${response.status} ${response.statusText}`;
    throw new Error(`CampusHut API: ${message}`);
  }
  return result as T;
}

export function readArrayPayload<T>(value: unknown, keys: string[] = []): T[] {
  if (Array.isArray(value)) return value as T[];
  if (!value || typeof value !== "object") return [];
  const record = value as Record<string, unknown>;
  for (const key of [...keys, "content", "items", "data", "results", "campaigns", "advertisers"]) {
    const nested = record[key];
    if (Array.isArray(nested)) return nested as T[];
    if (nested && typeof nested === "object") {
      const extracted = readArrayPayload<T>(nested, keys);
      if (extracted.length) return extracted;
    }
  }
  return [];
}

export const contentApi = {
  news: {
    list: (page = 0, size = 100) =>
      contentApiRequest<unknown>("/api/news/getAllNews", {
        query: { page, size, sort: "id,desc" },
      }),
    byId: (id: number) => contentApiRequest<NewsArticle>(`/api/news/getNews/${id}`),
    searchTitle: (title: string) =>
      contentApiRequest<unknown>("/api/news/search/title", { query: { title } }),
    searchType: (type: string) =>
      contentApiRequest<unknown>("/api/news/search/type", { query: { type } }),
    searchAuthor: (author: string) =>
      contentApiRequest<unknown>("/api/news/search/author", { query: { author } }),
    create: (article: Omit<NewsArticle, "id">, image?: File | null) => {
      const form = new FormData();
      form.set("news", JSON.stringify(article));
      if (image) form.set("images", image);
      return contentApiRequest<unknown>("/api/news/createNews", { method: "POST", body: form });
    },
    update: (id: number, article: Pick<NewsArticle, "newsType" | "summary" | "content">) =>
      contentApiRequest<NewsArticle>(`/api/news/updateNews/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(article),
      }),
    remove: (id: number) =>
      contentApiRequest<void>(`/api/news/deleteNews/${id}`, { method: "DELETE" }),
  },
  versions: {
    create: (request: AppVersionRequest) =>
      contentApiRequest<unknown>("/api/version", {
        method: "POST",
        query: { request: JSON.stringify(request) },
      }),
    update: (id: number, request: AppVersionRequest) =>
      contentApiRequest<unknown>(`/api/version/${id}`, {
        method: "PUT",
        query: { id, request: JSON.stringify(request) },
      }),
    check: (platform: AppVersionRequest["platform"], version: string, buildNumber: number) =>
      contentApiRequest<unknown>("/api/version/check", {
        headers: {
          "X-App-Version": version,
          "X-App-Build": String(buildNumber),
          "X-Platform": platform,
        },
      }),
    adminCheck: (platform: AppVersionRequest["platform"]) =>
      contentApiRequest<unknown>("/api/admin/version/check", {
        headers: { "X-Platform": platform },
      }),
  },
  advertisers: {
    list: () => contentApiRequest<unknown>("/api/getAllAdvertiser"),
    byId: (id: number) => contentApiRequest<unknown>(`/api/getAdvertiser/${id}`),
    create: (request: Record<string, unknown>, image?: File | null) => {
      const form = new FormData();
      form.set("request", JSON.stringify(request));
      if (image) form.set("images", image);
      return contentApiRequest<unknown>("/api/createAdvertiser", { method: "POST", body: form });
    },
    update: (id: number, request: Record<string, unknown>, image?: File | null) => {
      const form = new FormData();
      form.set("request", JSON.stringify(request));
      if (image) form.set("images", image);
      return contentApiRequest<unknown>(`/api/updateAdvertiser/${id}`, { method: "POST", body: form });
    },
    deactivate: (id: number) =>
      contentApiRequest<unknown>(`/api/${id}/deactivate`, { method: "PATCH" }),
  },
  ads: {
    dashboard: () => contentApiRequest<unknown>("/api/ad-campaigns/dashboard"),
    adminCampaigns: () => contentApiRequest<unknown>("/api/ad-campaigns/getAdminAllCampaign"),
    campaigns: () => contentApiRequest<unknown>("/api/ad-campaigns/getAllCampaign"),
    byId: (id: number) => contentApiRequest<unknown>(`/api/ad-campaigns/getCampaign/${id}`),
    analytics: (id: number) =>
      contentApiRequest<unknown>(`/api/ad-campaigns/${id}/campaignAnalytics`),
    placements: () => contentApiRequest<unknown>("/api/ad-campaigns/placements"),
    priorities: () => contentApiRequest<unknown>("/api/ad-campaigns/priorities"),
    active: (placement: string) =>
      contentApiRequest<unknown>("/api/ad-campaigns/active", { query: { placement } }),
    create: (request: Record<string, unknown>, image?: File | null) => {
      const form = new FormData();
      if (image) form.set("images", image);
      return contentApiRequest<unknown>("/api/ad-campaigns/createCampaign", {
        method: "POST",
        query: { request: JSON.stringify(request) },
        body: form,
      });
    },
    update: (id: number, request: Record<string, unknown>, image?: File | null) => {
      const form = new FormData();
      form.set("request", JSON.stringify(request));
      if (image) form.set("banner", image);
      return contentApiRequest<unknown>("/api/ad-campaigns/updateCampaign", {
        method: "POST",
        query: { campaignId: id },
        body: form,
      });
    },
    transition: (id: number, action: "pause" | "resume" | "complete" | "archive" | "approve") =>
      contentApiRequest<unknown>(`/api/ad-campaigns/${id}/${action}`, { method: "PATCH" }),
  },
};
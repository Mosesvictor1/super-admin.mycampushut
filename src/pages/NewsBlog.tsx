import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  FileText,
  ImagePlus,
  LoaderCircle,
  Newspaper,
  Pencil,
  Plus,
  Search,
  Send,
  Trash2,
  Upload,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { MiniStat } from "@/components/dashboard/MiniStat";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { contentApi, readArrayPayload, type NewsArticle } from "@/lib/campushut-content-api";
import { initialBlogPosts } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type NewsForm = { title: string; author: string; newsType: string; summary: string; content: string };
const blankForm: NewsForm = { title: "", author: "Adebayo Ogunleye", newsType: "News", summary: "", content: "" };
const demoPosts: NewsArticle[] = initialBlogPosts.map((post) => ({
  id: Number(post.id.replace(/\D/g, "")) || 1,
  title: post.title,
  author: post.author,
  newsType: post.category,
  summary: post.excerpt,
  content: post.content,
  imageUrl: post.coverImage,
  status: post.status,
  createdAt: post.publishedAt,
}));

function normalizeArticle(article: NewsArticle): NewsArticle {
  return {
    ...article,
    title: article.title ?? "Untitled article",
    author: article.author ?? "CampusHut Editorial",
    newsType: article.newsType ?? "News",
    summary: article.summary ?? "",
    content: article.content ?? "",
    imageUrl: article.imageUrl ?? "",
  };
}

export default function NewsBlogPage() {
  useDocumentTitle("CampusHut Admin — News");
  const [articles, setArticles] = useState<NewsArticle[]>(demoPosts);
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All types");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selected, setSelected] = useState<NewsArticle | null>(null);
  const [form, setForm] = useState<NewsForm>(blankForm);
  const [image, setImage] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const loadArticles = useCallback(async () => {
    setLoading(true);
    try {
      const payload = await contentApi.news.list();
      setArticles(readArrayPayload<NewsArticle>(payload, ["news", "articles"]).map(normalizeArticle));
      setIsLive(true);
      setError(null);
    } catch (cause) {
      setArticles(demoPosts);
      setIsLive(false);
      setError(cause instanceof Error ? cause.message : "The news service is unavailable.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadArticles();
  }, [loadArticles]);

  const filtered = useMemo(() => articles.filter((article) => {
    const matchesQuery = [article.title, article.summary, article.author]
      .some((value) => String(value ?? "").toLowerCase().includes(query.toLowerCase()));
    return matchesQuery && (typeFilter === "All types" || article.newsType === typeFilter);
  }), [articles, query, typeFilter]);

  const openCreate = () => {
    setSelected(null);
    setForm(blankForm);
    setImage(null);
    setDialogOpen(true);
  };

  const openEdit = (article: NewsArticle) => {
    setSelected(article);
    setForm({
      title: String(article.title ?? ""),
      author: String(article.author ?? ""),
      newsType: String(article.newsType ?? "News"),
      summary: String(article.summary ?? ""),
      content: String(article.content ?? ""),
    });
    setImage(null);
    setDialogOpen(true);
  };

  const saveArticle = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selected && !isLive) {
      toast.error("Connect to the News API to publish articles. Demo mode is read-only.");
      return;
    }
    if (selected && !selected.id) {
      toast.error("This sample article has no live record ID and cannot be edited on the service.");
      return;
    }
    setSaving(true);
    try {
      if (selected?.id) {
        const response = await contentApi.news.update(selected.id, {
          newsType: form.newsType,
          summary: form.summary,
          content: form.content,
        });
        setArticles((all) => all.map((article) => article.id === selected.id
          ? normalizeArticle({ ...article, ...response, ...form })
          : article));
      } else {
        await contentApi.news.create(form, image);
        await loadArticles();
      }
      toast.success(selected ? "Article updated" : "Article created");
      setDialogOpen(false);
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : "The article could not be saved.");
    } finally {
      setSaving(false);
    }
  };

  const deleteArticle = async (article: NewsArticle) => {
    if (!article.id || !isLive) {
      toast.error("Sample articles cannot be deleted from the live service.");
      return;
    }
    if (!window.confirm(`Delete “${article.title}”? This cannot be undone.`)) return;
    try {
      await contentApi.news.remove(article.id);
      setArticles((all) => all.filter((entry) => entry.id !== article.id));
      toast.success("Article deleted");
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : "The article could not be deleted.");
    }
  };

  const newsCount = articles.filter((article) => /^news$/i.test(String(article.newsType ?? ""))).length;
  const blogCount = articles.filter((article) => /^blog$/i.test(String(article.newsType ?? ""))).length;

  return (
    <DashboardLayout title="News" subtitle="CampusHut announcements and editorial updates">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MiniStat icon={Newspaper} label="Total articles" value={articles.length} tone="primary" />
        <MiniStat icon={CheckCircle2} label="News articles" value={newsCount} tone="blue" />
        <MiniStat icon={FileText} label="Blog articles" value={blogCount} tone="accent" />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex h-10 items-center gap-2 rounded-lg border border-input bg-card px-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input aria-label="Search articles" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search articles or authors" className="h-8 w-56 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0" />
          </div>
          <select aria-label="Filter by article type" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)} className="h-10 rounded-lg border border-input bg-card px-3 text-sm">
            <option>All types</option>
            {[...new Set(articles.map((article) => String(article.newsType ?? "News")))].map((type) => <option key={type}>{type}</option>)}
          </select>
        </div>
        <Button onClick={openCreate} disabled={!isLive} title={!isLive ? "Publishing is unavailable while using sample data" : undefined}>
          <Plus /> New article
        </Button>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm">
        <div className="flex items-center gap-2">
          <span className={cn("h-2 w-2 rounded-full", isLive ? "bg-success" : "bg-accent")} />
          <span className="font-medium">{isLive ? "Live API data" : "Sample data"}</span>
          {loading && <LoaderCircle className="h-4 w-4 animate-spin text-muted-foreground" />}
        </div>
        {error && <p role="status" className="max-w-2xl text-xs text-muted-foreground">News API unavailable — showing sample articles. {error}</p>}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-5 border-y border-dashed border-border py-16 text-center">
          <Newspaper className="mx-auto h-10 w-10 text-muted-foreground" />
          <h2 className="mt-3 font-semibold">No matching articles</h2>
          <p className="mt-1 text-sm text-muted-foreground">Try another search or article type.</p>
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-x-5 gap-y-0 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((article) => (
            <article key={article.id ?? article.title} className="group flex min-w-0 flex-col border-b border-border py-5">
              <div className="relative mb-4 aspect-[16/9] overflow-hidden rounded-lg bg-muted">
                {article.imageUrl ? (
                  <img src={article.imageUrl} alt="" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
                ) : (
                  <div className="grid h-full place-items-center text-muted-foreground"><ImagePlus className="h-8 w-8" /></div>
                )}
                <span className="absolute left-3 top-3 rounded-md bg-card/90 px-2 py-1 text-xs font-medium">{String(article.newsType ?? "News")}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CalendarDays className="h-3.5 w-3.5" />
                <span>{String(article.createdAt ?? "CampusHut News")}</span>
                <span>·</span><span className="truncate">{String(article.author)}</span>
              </div>
              <h2 className="mt-2 line-clamp-2 text-lg font-semibold leading-snug">{String(article.title)}</h2>
              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{String(article.summary)}</p>
              <div className="mt-4 flex items-center gap-1 border-t border-border pt-3">
                <Button variant="ghost" size="sm" onClick={() => openEdit(article)} disabled={!isLive} aria-label={`Edit ${article.title}`} title={!isLive ? "Read-only sample data" : undefined}><Pencil /> Edit</Button>
                <Button variant="ghost" size="sm" onClick={() => void deleteArticle(article)} disabled={!isLive} aria-label={`Delete ${article.title}`} className="text-destructive hover:text-destructive"><Trash2 /></Button>
              </div>
            </article>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selected ? "Edit article" : "Create an article"}</DialogTitle>
            <DialogDescription>{selected ? "Updates follow the fields supported by the news service." : "Write an update for the CampusHut community."}</DialogDescription>
          </DialogHeader>
          <form onSubmit={saveArticle} className="space-y-4">
            <label className="block space-y-1.5 text-sm font-medium">Title
              <Input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required disabled={Boolean(selected)} placeholder="Article title" />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block space-y-1.5 text-sm font-medium">Author
                <Input value={form.author} onChange={(event) => setForm({ ...form, author: event.target.value })} required disabled={Boolean(selected)} />
              </label>
              <label className="block space-y-1.5 text-sm font-medium">Type
                <Input value={form.newsType} onChange={(event) => setForm({ ...form, newsType: event.target.value })} required />
              </label>
            </div>
            <label className="block space-y-1.5 text-sm font-medium">Summary
              <Textarea value={form.summary} onChange={(event) => setForm({ ...form, summary: event.target.value })} required rows={3} />
            </label>
            <label className="block space-y-1.5 text-sm font-medium">Article content
              <Textarea value={form.content} onChange={(event) => setForm({ ...form, content: event.target.value })} required rows={8} />
            </label>
            {!selected && <label className="block space-y-1.5 text-sm font-medium">Cover image <Input type="file" accept="image/*" onChange={(event) => setImage(event.target.files?.[0] ?? null)} /></label>}
            {image && <p className="flex items-center gap-2 text-xs text-muted-foreground"><Upload className="h-3.5 w-3.5" />{image.name}</p>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={saving}>{saving ? <LoaderCircle className="animate-spin" /> : <Send />}{selected ? "Save changes" : "Publish article"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
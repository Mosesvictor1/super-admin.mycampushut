import { useState, useMemo } from "react";
import {
  Newspaper,
  Plus,
  Search,
  Trash2,
  Edit,
  Eye,
  ThumbsUp,
  FileText,
  Calendar,
  CheckCircle,
  AlertCircle,
  User,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { MiniStat } from "@/components/dashboard/MiniStat";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  initialBlogPosts,
  type BlogPost,
} from "@/lib/mock-data";

const CATEGORIES = ["News", "Blog"] as const;
const STATUSES = ["Published", "Draft"] as const;

const IMAGE_PRESETS = [
  { name: "Campus & Tech", url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60" },
  { name: "Student Budgeting", url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=60" },
  { name: "Group Study", url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=60" },
  { name: "Library", url: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&auto=format&fit=crop&q=60" },
  { name: "Graduation", url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=60" },
];

export default function NewsBlogPage() {
  useDocumentTitle("CampusHut Admin — News & Blog Management");

  const [posts, setPosts] = useState<BlogPost[]>(initialBlogPosts);
  const [q, setQ] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"All" | BlogPost["category"]>("All");
  const [statusFilter, setStatusFilter] = useState<"All" | BlogPost["status"]>("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState("");
  const [formExcerpt, setFormExcerpt] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formAuthor, setFormAuthor] = useState("");
  const [formCategory, setFormCategory] = useState<BlogPost["category"]>("News");
  const [formStatus, setFormStatus] = useState<BlogPost["status"]>("Published");
  const [formCoverImage, setFormCoverImage] = useState(IMAGE_PRESETS[0].url);
  const [customImageUrl, setCustomImageUrl] = useState("");

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchQuery =
        !q ||
        post.title.toLowerCase().includes(q.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(q.toLowerCase()) ||
        post.author.toLowerCase().includes(q.toLowerCase());

      const matchCategory = categoryFilter === "All" || post.category === categoryFilter;
      const matchStatus = statusFilter === "All" || post.status === statusFilter;

      return matchQuery && matchCategory && matchStatus;
    });
  }, [posts, q, categoryFilter, statusFilter]);

  const kpis = useMemo(() => {
    const total = posts.length;
    const published = posts.filter((p) => p.status === "Published").length;
    const drafts = total - published;
    const views = posts.reduce((sum, p) => sum + p.views, 0);

    return { total, published, drafts, views };
  }, [posts]);

  const openCreateModal = () => {
    setEditingPost(null);
    setFormTitle("");
    setFormExcerpt("");
    setFormContent("");
    setFormAuthor("Adebayo Ogunleye"); // Default author
    setFormCategory("News");
    setFormStatus("Published");
    setFormCoverImage(IMAGE_PRESETS[0].url);
    setCustomImageUrl("");
    setIsModalOpen(true);
  };

  const openEditModal = (post: BlogPost) => {
    setEditingPost(post);
    setFormTitle(post.title);
    setFormExcerpt(post.excerpt);
    setFormContent(post.content);
    setFormAuthor(post.author);
    setFormCategory(post.category);
    setFormStatus(post.status);
    
    const isPreset = IMAGE_PRESETS.some((preset) => preset.url === post.coverImage);
    if (isPreset) {
      setFormCoverImage(post.coverImage);
      setCustomImageUrl("");
    } else {
      setFormCoverImage("custom");
      setCustomImageUrl(post.coverImage);
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formTitle.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!formExcerpt.trim()) {
      toast.error("Excerpt is required");
      return;
    }
    if (!formContent.trim()) {
      toast.error("Content body is required");
      return;
    }
    if (!formAuthor.trim()) {
      toast.error("Author name is required");
      return;
    }

    const finalImageUrl = formCoverImage === "custom" ? customImageUrl : formCoverImage;

    if (!finalImageUrl.trim()) {
      toast.error("Please select a cover image or enter a custom URL");
      return;
    }

    if (editingPost) {
      // Edit post
      setPosts((prev) =>
        prev.map((p) =>
          p.id === editingPost.id
            ? {
                ...p,
                title: formTitle,
                excerpt: formExcerpt,
                content: formContent,
                author: formAuthor,
                category: formCategory,
                status: formStatus,
                coverImage: finalImageUrl,
              }
            : p
        )
      );
      toast.success("Post updated successfully");
    } else {
      // Create post
      const newPost: BlogPost = {
        id: `post-${Date.now()}`,
        title: formTitle,
        excerpt: formExcerpt,
        content: formContent,
        author: formAuthor,
        category: formCategory,
        status: formStatus,
        coverImage: finalImageUrl,
        publishedAt: new Date().toISOString().split("T")[0],
        views: 0,
        likes: 0,
      };
      setPosts((prev) => [newPost, ...prev]);
      toast.success("New post created successfully");
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Post deleted successfully");
    }
  };

  const toggleStatus = (post: BlogPost) => {
    const newStatus = post.status === "Published" ? "Draft" : "Published";
    setPosts((prev) =>
      prev.map((p) => (p.id === post.id ? { ...p, status: newStatus } : p))
    );
    toast.success(`Post marked as ${newStatus}`);
  };

  return (
    <DashboardLayout
      title="News & Blog Management"
      subtitle="Publish announcements, tutorials, and informational posts for CampusHut users"
    >
      {/* Top statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MiniStat
          icon={Newspaper}
          tone="primary"
          label="Total Articles"
          value={kpis.total.toString()}
          delta={0}
        />
        <MiniStat
          icon={CheckCircle}
          tone="blue"
          label="Published Posts"
          value={kpis.published.toString()}
          delta={0}
        />
        <MiniStat
          icon={AlertCircle}
          tone="accent"
          label="Draft Posts"
          value={kpis.drafts.toString()}
          delta={0}
        />
        <MiniStat
          icon={Eye}
          tone="violet"
          label="Cumulative Views"
          value={kpis.views.toLocaleString()}
          delta={0}
        />
      </div>

      {/* Control bar */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 p-5 rounded-2xl border border-border bg-card shadow-card">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-1.5 text-sm">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search posts or authors…"
              className="w-56 bg-transparent outline-none placeholder:text-muted-foreground/70"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[12px] font-medium text-muted-foreground">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
              className="rounded-xl border border-border bg-background px-3 py-1.5 text-sm outline-none cursor-pointer focus:border-primary/40"
            >
              <option value="All">All Categories</option>
              <option value="News">News</option>
              <option value="Blog">Blog</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[12px] font-medium text-muted-foreground">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="rounded-xl border border-border bg-background px-3 py-1.5 text-sm outline-none cursor-pointer focus:border-primary/40"
            >
              <option value="All">All Statuses</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:brightness-110 transition shadow-card"
        >
          <Plus className="h-4 w-4" />
          Create Post
        </button>
      </div>

      {/* Main articles display */}
      <div className="mt-5">
        {filteredPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 rounded-2xl border border-dashed border-border bg-card">
            <FileText className="h-12 w-12 text-muted-foreground/60 mb-2" />
            <p className="font-medium text-foreground/80">No articles found</p>
            <p className="text-sm text-muted-foreground text-center mt-1">
              Try adjusting your filters or create a new post to get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card hover:shadow-elevated transition duration-200"
              >
                {/* Cover image wrapper */}
                <div className="relative h-48 w-full bg-muted overflow-hidden">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Badges overlay */}
                  <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                    <span
                      className={cn(
                        "rounded-md px-2 py-0.5 text-[11px] font-semibold tracking-wide text-white uppercase shadow-sm",
                        post.category === "News"
                          ? "bg-[oklch(0.62_0.17_148)]" // CampusHut Green
                          : "bg-[oklch(0.55_0.15_240)]" // Blue
                      )}
                    >
                      {post.category}
                    </span>
                    <span
                      className={cn(
                        "rounded-md px-2 py-0.5 text-[11px] font-semibold tracking-wide text-white uppercase shadow-sm",
                        post.status === "Published"
                          ? "bg-[oklch(0.65_0.16_150)]" // Light green success
                          : "bg-[oklch(0.60_0.02_250)]" // Gray
                      )}
                    >
                      {post.status}
                    </span>
                  </div>
                </div>

                {/* Content area */}
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center gap-1.5 text-[11.5px] text-muted-foreground mb-2">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{post.publishedAt}</span>
                    <span className="text-muted-foreground/40">•</span>
                    <User className="h-3.5 w-3.5" />
                    <span className="font-medium text-foreground/70 truncate max-w-[120px]">
                      {post.author}
                    </span>
                  </div>

                  <h4 className="text-[15.5px] font-bold leading-snug tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h4>

                  <p className="mt-2 text-[12.5px] text-muted-foreground leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="mt-auto pt-4 border-t border-border/60 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-muted-foreground text-[12px]">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" />
                        {post.views.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="h-3.5 w-3.5" />
                        {post.likes}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => toggleStatus(post)}
                        className={cn(
                          "rounded-lg px-2 py-1 text-[11px] font-medium border border-border transition hover:bg-muted",
                          post.status === "Published"
                            ? "text-accent border-accent/20 hover:bg-accent/5"
                            : "text-primary border-primary/20 hover:bg-primary/5"
                        )}
                        title={post.status === "Published" ? "Make Draft" : "Publish"}
                      >
                        {post.status === "Published" ? "Unpublish" : "Publish"}
                      </button>
                      <button
                        onClick={() => openEditModal(post)}
                        className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition"
                        title="Edit Article"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="rounded-lg p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition"
                        title="Delete Article"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPost ? "Edit Article" : "Create New Article"}</DialogTitle>
            <DialogDescription>
              Write and style your content. Publish updates directly to CampusHut mobile and web portals.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Article Title
                </label>
                <input
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Enter a compelling title"
                  className="flex h-10 w-full rounded-xl border border-input bg-background px-3.5 py-2 text-sm outline-none focus:border-primary/50"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Author Name
                </label>
                <input
                  value={formAuthor}
                  onChange={(e) => setFormAuthor(e.target.value)}
                  placeholder="Author"
                  className="flex h-10 w-full rounded-xl border border-input bg-background px-3.5 py-2 text-sm outline-none focus:border-primary/50"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="flex h-10 w-full rounded-xl border border-input bg-background px-3.5 py-2 text-sm outline-none focus:border-primary/50 cursor-pointer"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="flex h-10 w-full rounded-xl border border-input bg-background px-3.5 py-2 text-sm outline-none focus:border-primary/50 cursor-pointer"
                  >
                    {STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="col-span-2 space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Short Excerpt
                </label>
                <input
                  value={formExcerpt}
                  onChange={(e) => setFormExcerpt(e.target.value)}
                  placeholder="Summary shown on listing cards"
                  className="flex h-10 w-full rounded-xl border border-input bg-background px-3.5 py-2 text-sm outline-none focus:border-primary/50"
                  required
                />
              </div>

              <div className="col-span-2 space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Content Body (Markdown Supported)
                </label>
                <textarea
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="Write the full content body of your article here..."
                  className="flex min-h-[140px] w-full rounded-xl border border-input bg-background px-3.5 py-2 text-sm outline-none focus:border-primary/50"
                  required
                />
              </div>

              <div className="col-span-2 space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Cover Image URL
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                  <div className="space-y-1.5">
                    <span className="text-[11px] text-muted-foreground block">Choose from Presets:</span>
                    <select
                      value={formCoverImage === "custom" || IMAGE_PRESETS.some(p => p.url === formCoverImage) ? formCoverImage : "custom"}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormCoverImage(val);
                        if (val !== "custom") {
                          setCustomImageUrl("");
                        }
                      }}
                      className="flex h-10 w-full rounded-xl border border-input bg-background px-3.5 py-2 text-sm outline-none focus:border-primary/50 cursor-pointer"
                    >
                      {IMAGE_PRESETS.map((preset) => (
                        <option key={preset.name} value={preset.url}>
                          {preset.name}
                        </option>
                      ))}
                      <option value="custom">Custom Image Link...</option>
                    </select>
                  </div>
                  
                  {(formCoverImage === "custom" || !IMAGE_PRESETS.some(p => p.url === formCoverImage)) && (
                    <div className="space-y-1.5">
                      <span className="text-[11px] text-muted-foreground block">Paste Custom URL:</span>
                      <input
                        value={customImageUrl}
                        onChange={(e) => setCustomImageUrl(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        className="flex h-10 w-full rounded-xl border border-input bg-background px-3.5 py-2 text-sm outline-none focus:border-primary/50"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter className="mt-6 pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:brightness-110 transition shadow-card"
              >
                {editingPost ? "Save Changes" : "Create Post"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

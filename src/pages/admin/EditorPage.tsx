import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Strikethrough,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Quote,
    Code,
    ImagePlus,
    Link as LinkIcon,
    Minus,
    Undo2,
    Redo2,
    Eye,
    Save,
    Send,
    Highlighter,
    X,
} from "lucide-react";
import { cn, slugify, generateExcerpt } from "../../lib/utils";

import { toast } from "sonner";

export default function EditorPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const user = useQuery(api.users.getCurrentUser);

    const existingPost = useQuery(
        api.posts.getPostById,
        id ? { id: id as Id<"posts"> } : "skip"
    );
    const allTags = useQuery(api.tags.getAllTags);
    const createPost = useMutation(api.posts.createPost);
    const updatePost = useMutation(api.posts.updatePost);
    const createTag = useMutation(api.tags.createTag);
    const generateUploadUrl = useMutation(api.images.generateUploadUrl);
    const saveImage = useMutation(api.images.saveImage);

    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
    const [excerpt, setExcerpt] = useState("");
    const [status, setStatus] = useState<"draft" | "published" | "scheduled">("draft");
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");
    const [coverImage, setCoverImage] = useState("");
    const [publishDate, setPublishDate] = useState("");
    const [showPreview, setShowPreview] = useState(false);
    const [saving, setSaving] = useState(false);
    const autosaveRef = useRef<ReturnType<typeof setInterval>>(undefined);
    const [initialized, setInitialized] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3] },
            }),
            Image.configure({ inline: false }),
            Link.configure({ openOnClick: false }),
            Placeholder.configure({ placeholder: "Start writing your blog post..." }),
            Underline,
            Highlight,
        ],
        content: "",
        editorProps: {
            attributes: {
                class: "prose-blog min-h-[400px] outline-none px-6 py-4",
            },
        },
    });

    // Load existing post data
    useEffect(() => {
        if (existingPost && editor && !initialized) {
            setTitle(existingPost.title);
            setSlug(existingPost.slug);
            setSlugManuallyEdited(true);
            setExcerpt(existingPost.excerpt);
            setStatus(existingPost.status as "draft" | "published" | "scheduled");
            setTags(existingPost.tags);
            setCoverImage(existingPost.coverImage || "");
            if (existingPost.publishDate) {
                setPublishDate(new Date(existingPost.publishDate).toISOString().slice(0, 16));
            }
            editor.commands.setContent(existingPost.content);
            setInitialized(true);
        }
    }, [existingPost, editor, initialized]);

    // Auto-generate slug from title
    useEffect(() => {
        if (!slugManuallyEdited && title) {
            setSlug(slugify(title));
        }
    }, [title, slugManuallyEdited]);

    // Autosave every 10 seconds
    useEffect(() => {
        if (id && editor) {
            autosaveRef.current = setInterval(() => {
                handleSave(true);
            }, 10000);
        }
        return () => {
            if (autosaveRef.current) clearInterval(autosaveRef.current);
        };
    }, [id, editor, title, slug, tags, status]);

    const handleSave = useCallback(
        async (silent = false) => {
            if (!editor || !user?._id || saving) return;

            const content = editor.getHTML();
            const autoExcerpt = excerpt || generateExcerpt(content);

            setSaving(true);
            try {
                if (id) {
                    await updatePost({
                        id: id as Id<"posts">,
                        title,
                        slug,
                        content,
                        excerpt: autoExcerpt,
                        status,
                        tags,
                        coverImage: coverImage || undefined,
                        publishDate: publishDate ? new Date(publishDate).getTime() : undefined,
                    });
                    if (!silent) toast.success("Post updated");
                } else {
                    const postId = await createPost({
                        title: title || "Untitled",
                        slug: slug || slugify(title || "untitled"),
                        content,
                        excerpt: autoExcerpt,
                        authorId: user._id,
                        status,
                        tags,
                        coverImage: coverImage || undefined,
                        publishDate: publishDate ? new Date(publishDate).getTime() : undefined,
                    });
                    toast.success("Post created");
                    navigate(`/admin/editor/${postId}`, { replace: true });
                }
            } catch (err: any) {
                if (!silent) toast.error(err.message || "Failed to save");
            } finally {
                setSaving(false);
            }
        },
        [editor, user, id, title, slug, excerpt, status, tags, coverImage, publishDate, saving]
    );

    const handlePublish = async () => {
        setStatus("published");
        // Need to wait for state update then save
        setTimeout(() => handleSave(), 50);
    };

    const handleImageUpload = async () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;

            try {
                const uploadUrl = await generateUploadUrl();
                const response = await fetch(uploadUrl, {
                    method: "POST",
                    headers: { "Content-Type": file.type },
                    body: file,
                });
                const { storageId } = await response.json();
                const result = await saveImage({
                    storageId,
                    filename: file.name,
                });

                if (editor && result.url) {
                    editor.chain().focus().setImage({ src: result.url }).run();
                }
                toast.success("Image uploaded");
            } catch {
                toast.error("Failed to upload image");
            }
        };
        input.click();
    };

    const handleAddTag = (tagName: string) => {
        const trimmed = tagName.trim();
        if (!trimmed || tags.includes(trimmed)) return;
        setTags([...tags, trimmed]);
        setTagInput("");
        // Create tag in DB
        createTag({ name: trimmed, slug: slugify(trimmed) });
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter((t) => t !== tagToRemove));
    };

    const handleAddLink = () => {
        const url = prompt("Enter URL:");
        if (url && editor) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    };

    const filteredSuggestions = allTags?.filter(
        (t) =>
            t.name.toLowerCase().includes(tagInput.toLowerCase()) &&
            !tags.includes(t.name)
    );

    if (!editor) return null;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                {/* Main Editor Area */}
                <div className={cn("space-y-4", showPreview ? "xl:col-span-2" : "xl:col-span-3")}>
                    {/* Title */}
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Post Title"
                        className="w-full bg-transparent text-3xl font-display font-bold text-foreground placeholder:text-foreground-subtle outline-none border-b border-border pb-3 focus:border-primary transition-colors"
                    />

                    {/* Slug */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-foreground-subtle font-mono">/blog/</span>
                        <input
                            type="text"
                            value={slug}
                            onChange={(e) => {
                                setSlug(slugify(e.target.value));
                                setSlugManuallyEdited(true);
                            }}
                            className="flex-1 bg-transparent text-xs font-mono text-foreground-muted outline-none border-b border-border-subtle pb-1 focus:border-primary transition-colors"
                        />
                    </div>

                    {/* Toolbar */}
                    <div className="flex flex-wrap items-center gap-1 p-2 bg-card border border-border sticky top-0 z-10">
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleBold().run()}
                            active={editor.isActive("bold")}
                            title="Bold"
                        >
                            <Bold className="w-4 h-4" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                            active={editor.isActive("italic")}
                            title="Italic"
                        >
                            <Italic className="w-4 h-4" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleUnderline().run()}
                            active={editor.isActive("underline")}
                            title="Underline"
                        >
                            <UnderlineIcon className="w-4 h-4" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleStrike().run()}
                            active={editor.isActive("strike")}
                            title="Strikethrough"
                        >
                            <Strikethrough className="w-4 h-4" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleHighlight().run()}
                            active={editor.isActive("highlight")}
                            title="Highlight"
                        >
                            <Highlighter className="w-4 h-4" />
                        </ToolbarButton>

                        <div className="w-px h-6 bg-border mx-1" />

                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                            active={editor.isActive("heading", { level: 1 })}
                            title="Heading 1"
                        >
                            <Heading1 className="w-4 h-4" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                            active={editor.isActive("heading", { level: 2 })}
                            title="Heading 2"
                        >
                            <Heading2 className="w-4 h-4" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                            active={editor.isActive("heading", { level: 3 })}
                            title="Heading 3"
                        >
                            <Heading3 className="w-4 h-4" />
                        </ToolbarButton>

                        <div className="w-px h-6 bg-border mx-1" />

                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleBulletList().run()}
                            active={editor.isActive("bulletList")}
                            title="Bullet List"
                        >
                            <List className="w-4 h-4" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleOrderedList().run()}
                            active={editor.isActive("orderedList")}
                            title="Ordered List"
                        >
                            <ListOrdered className="w-4 h-4" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleBlockquote().run()}
                            active={editor.isActive("blockquote")}
                            title="Blockquote"
                        >
                            <Quote className="w-4 h-4" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                            active={editor.isActive("codeBlock")}
                            title="Code Block"
                        >
                            <Code className="w-4 h-4" />
                        </ToolbarButton>

                        <div className="w-px h-6 bg-border mx-1" />

                        <ToolbarButton onClick={handleImageUpload} title="Insert Image">
                            <ImagePlus className="w-4 h-4" />
                        </ToolbarButton>
                        <ToolbarButton onClick={handleAddLink} title="Insert Link">
                            <LinkIcon className="w-4 h-4" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().setHorizontalRule().run()}
                            title="Horizontal Rule"
                        >
                            <Minus className="w-4 h-4" />
                        </ToolbarButton>

                        <div className="w-px h-6 bg-border mx-1" />

                        <ToolbarButton
                            onClick={() => editor.chain().focus().undo().run()}
                            title="Undo"
                        >
                            <Undo2 className="w-4 h-4" />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().redo().run()}
                            title="Redo"
                        >
                            <Redo2 className="w-4 h-4" />
                        </ToolbarButton>

                        <div className="ml-auto">
                            <ToolbarButton
                                onClick={() => setShowPreview(!showPreview)}
                                active={showPreview}
                                title="Preview"
                            >
                                <Eye className="w-4 h-4" />
                            </ToolbarButton>
                        </div>
                    </div>

                    {/* Editor Content */}
                    <div className="tiptap-editor bg-card border border-border min-h-[500px]">
                        <EditorContent editor={editor} />
                    </div>
                </div>

                {/* Preview Panel */}
                {showPreview && (
                    <div className="xl:col-span-1 bg-card border border-border p-6 overflow-y-auto max-h-[80vh] sticky top-20">
                        <h3 className="font-display text-xs uppercase tracking-widest text-foreground-muted mb-4 pb-2 border-b border-border">
                            Preview
                        </h3>
                        <h2 className="font-display text-xl font-bold text-foreground mb-4">
                            {title || "Untitled"}
                        </h2>
                        <div
                            className="prose-blog text-sm"
                            dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
                        />
                    </div>
                )}

                {/* Settings Panel */}
                <div className="space-y-6">
                    {/* Status & Actions */}
                    <div className="bg-card border border-border p-4 space-y-4">
                        <h3 className="font-display text-xs uppercase tracking-widest text-foreground-muted pb-2 border-b border-border">
                            Publish
                        </h3>

                        {/* Status */}
                        <div>
                            <label className="block text-xs text-foreground-muted mb-1.5 font-display">
                                Status
                            </label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value as any)}
                                className="w-full bg-background border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                            >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                                <option value="scheduled">Scheduled</option>
                            </select>
                        </div>

                        {/* Publish Date */}
                        {status === "scheduled" && (
                            <div>
                                <label className="block text-xs text-foreground-muted mb-1.5 font-display">
                                    Publish Date
                                </label>
                                <input
                                    type="datetime-local"
                                    value={publishDate}
                                    onChange={(e) => setPublishDate(e.target.value)}
                                    className="w-full bg-background border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                                />
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-2">
                            <button
                                onClick={() => handleSave()}
                                disabled={saving}
                                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 border border-border text-sm font-display text-foreground hover:border-primary hover:text-primary transition-all disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                {saving ? "Saving..." : "Save"}
                            </button>
                            <button
                                onClick={handlePublish}
                                disabled={saving}
                                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-accent text-accent-foreground text-sm font-display hover:shadow-glow-green transition-all disabled:opacity-50"
                            >
                                <Send className="w-4 h-4" />
                                Publish
                            </button>
                        </div>
                    </div>

                    {/* Excerpt */}
                    <div className="bg-card border border-border p-4">
                        <h3 className="font-display text-xs uppercase tracking-widest text-foreground-muted pb-2 border-b border-border mb-3">
                            Excerpt
                        </h3>
                        <textarea
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                            placeholder="Auto-generated if left empty..."
                            rows={3}
                            className="w-full bg-background border border-border px-3 py-2 text-sm text-foreground placeholder:text-foreground-subtle focus:outline-none focus:border-primary transition-colors resize-none"
                        />
                    </div>

                    {/* Cover Image */}
                    <div className="bg-card border border-border p-4">
                        <h3 className="font-display text-xs uppercase tracking-widest text-foreground-muted pb-2 border-b border-border mb-3">
                            Cover Image
                        </h3>
                        {coverImage ? (
                            <div className="relative">
                                <img src={coverImage} alt="Cover" className="w-full border border-border" />
                                <button
                                    onClick={() => setCoverImage("")}
                                    className="absolute top-2 right-2 w-6 h-6 bg-background/80 flex items-center justify-center text-foreground hover:text-destructive transition-colors"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={async () => {
                                    const input = document.createElement("input");
                                    input.type = "file";
                                    input.accept = "image/*";
                                    input.onchange = async (e) => {
                                        const file = (e.target as HTMLInputElement).files?.[0];
                                        if (!file) return;
                                        try {
                                            const uploadUrl = await generateUploadUrl();
                                            const response = await fetch(uploadUrl, {
                                                method: "POST",
                                                headers: { "Content-Type": file.type },
                                                body: file,
                                            });
                                            const { storageId } = await response.json();
                                            const result = await saveImage({ storageId, filename: file.name });
                                            setCoverImage(result.url);
                                            toast.success("Cover image uploaded");
                                        } catch {
                                            toast.error("Failed to upload cover image");
                                        }
                                    };
                                    input.click();
                                }}
                                className="w-full py-6 border border-dashed border-border text-foreground-subtle text-sm hover:border-primary hover:text-primary transition-all"
                            >
                                Click to upload cover image
                            </button>
                        )}
                    </div>

                    {/* Tags */}
                    <div className="bg-card border border-border p-4">
                        <h3 className="font-display text-xs uppercase tracking-widest text-foreground-muted pb-2 border-b border-border mb-3">
                            Tags
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="inline-flex items-center gap-1 text-xs px-2 py-1 border border-primary/30 text-primary font-mono"
                                >
                                    #{tag}
                                    <button
                                        onClick={() => handleRemoveTag(tag)}
                                        className="hover:text-destructive transition-colors"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                        <div className="relative">
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === ",") {
                                        e.preventDefault();
                                        handleAddTag(tagInput);
                                    }
                                }}
                                placeholder="Add tag..."
                                className="w-full bg-background border border-border px-3 py-2 text-sm text-foreground placeholder:text-foreground-subtle focus:outline-none focus:border-primary transition-colors"
                            />
                            {/* Tag suggestions */}
                            {tagInput && filteredSuggestions && filteredSuggestions.length > 0 && (
                                <div className="absolute top-full left-0 right-0 bg-card border border-border border-t-0 z-10 max-h-32 overflow-y-auto">
                                    {filteredSuggestions.map((tag) => (
                                        <button
                                            key={tag._id}
                                            onClick={() => handleAddTag(tag.name)}
                                            className="w-full text-left px-3 py-2 text-sm text-foreground-muted hover:bg-background-secondary hover:text-primary transition-colors"
                                        >
                                            #{tag.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Toolbar button component
function ToolbarButton({
    onClick,
    active,
    title,
    children,
}: {
    onClick: () => void;
    active?: boolean;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <button
            onClick={onClick}
            title={title}
            className={cn(
                "p-1.5 transition-all",
                active
                    ? "bg-primary/20 text-primary"
                    : "text-foreground-muted hover:text-foreground hover:bg-background-secondary"
            )}
        >
            {children}
        </button>
    );
}

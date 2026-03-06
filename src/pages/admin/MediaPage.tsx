import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Trash2, Upload, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import type { Id } from "../../../convex/_generated/dataModel";
import { useState, useCallback } from "react";
import { formatDateShort } from "../../lib/utils";

export default function MediaPage() {
    const images = useQuery(api.images.getImages, { limit: 50 });
    const generateUploadUrl = useMutation(api.images.generateUploadUrl);
    const saveImage = useMutation(api.images.saveImage);
    const deleteImage = useMutation(api.images.deleteImage);
    const [uploading, setUploading] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const handleUpload = useCallback(async () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.multiple = true;
        input.onchange = async (e) => {
            const files = (e.target as HTMLInputElement).files;
            if (!files) return;

            setUploading(true);
            try {
                for (const file of Array.from(files)) {
                    const uploadUrl = await generateUploadUrl();
                    const response = await fetch(uploadUrl, {
                        method: "POST",
                        headers: { "Content-Type": file.type },
                        body: file,
                    });
                    const { storageId } = await response.json();
                    await saveImage({ storageId, filename: file.name });
                }
                toast.success(`${files.length} image${files.length > 1 ? "s" : ""} uploaded`);
            } catch {
                toast.error("Failed to upload images");
            } finally {
                setUploading(false);
            }
        };
        input.click();
    }, [generateUploadUrl, saveImage]);

    const handleDelete = async (id: Id<"images">) => {
        if (!confirm("Delete this image?")) return;
        try {
            await deleteImage({ id });
            toast.success("Image deleted");
        } catch {
            toast.error("Failed to delete image");
        }
    };

    const handleCopyUrl = (url: string, id: string) => {
        navigator.clipboard.writeText(url);
        setCopiedId(id);
        toast.success("URL copied to clipboard");
        setTimeout(() => setCopiedId(null), 2000);
    };

    // Handle drag & drop
    const handleDrop = useCallback(
        async (e: React.DragEvent) => {
            e.preventDefault();
            const files = e.dataTransfer.files;
            if (!files.length) return;

            setUploading(true);
            try {
                for (const file of Array.from(files)) {
                    if (!file.type.startsWith("image/")) continue;
                    const uploadUrl = await generateUploadUrl();
                    const response = await fetch(uploadUrl, {
                        method: "POST",
                        headers: { "Content-Type": file.type },
                        body: file,
                    });
                    const { storageId } = await response.json();
                    await saveImage({ storageId, filename: file.name });
                }
                toast.success("Images uploaded");
            } catch {
                toast.error("Failed to upload");
            } finally {
                setUploading(false);
            }
        },
        [generateUploadUrl, saveImage]
    );

    return (
        <div className="space-y-6">
            {/* Upload Area */}
            <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="border-2 border-dashed border-border bg-card p-12 text-center hover:border-primary transition-colors cursor-pointer"
                onClick={handleUpload}
            >
                <Upload className="w-8 h-8 text-foreground-subtle mx-auto mb-3" />
                <p className="text-sm text-foreground-muted font-display">
                    {uploading ? "Uploading..." : "Drag & drop images or click to upload"}
                </p>
                <p className="text-xs text-foreground-subtle mt-1">
                    Supports JPG, PNG, GIF, WebP
                </p>
            </div>

            {/* Image Grid */}
            {images && images.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {images.map((image) => (
                        <div key={image._id} className="group relative bg-card border border-border overflow-hidden">
                            <img
                                src={image.url}
                                alt={image.filename}
                                className="w-full aspect-square object-cover"
                            />
                            <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                <p className="text-[10px] text-foreground-muted font-mono truncate max-w-full px-2">
                                    {image.filename}
                                </p>
                                <p className="text-[10px] text-foreground-subtle">
                                    {formatDateShort(image.createdAt)}
                                </p>
                                <div className="flex gap-2 mt-2">
                                    <button
                                        onClick={() => handleCopyUrl(image.url, image._id)}
                                        className="p-2 bg-background border border-border text-foreground hover:border-primary hover:text-primary transition-colors"
                                        title="Copy URL"
                                    >
                                        {copiedId === image._id ? (
                                            <Check className="w-3.5 h-3.5" />
                                        ) : (
                                            <Copy className="w-3.5 h-3.5" />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(image._id)}
                                        className="p-2 bg-background border border-border text-foreground hover:border-destructive hover:text-destructive transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 text-foreground-subtle text-sm">
                    No images uploaded yet
                </div>
            )}
        </div>
    );
}

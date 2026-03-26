import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Helmet } from "react-helmet-async";
import TagBadge from "../../components/blog/TagBadge";

export default function TagsPage() {
    const tags = useQuery(api.tags.getAllTags);

    return (
        <>
            <Helmet>
                <title>Tags — Rochit Singh</title>
                <meta name="description" content="Browse all blog post tags." />
            </Helmet>

            <div className="pt-24 sm:pt-28">
                <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-12">
                    <div className="mb-12">
                        <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-2">
                            All <span className="gradient-text-cyber">Tags</span>
                        </h1>
                        <p className="text-foreground-muted">
                            Explore posts by topic
                        </p>
                    </div>

                    {tags && tags.length > 0 ? (
                        <div className="flex flex-wrap gap-4">
                            {tags.map((tag) => (
                                <TagBadge
                                    key={tag._id}
                                    name={tag.name}
                                    slug={tag.slug}
                                    clickable
                                    size="lg"
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 border border-border bg-card">
                            <p className="text-foreground-muted font-display text-lg">
                                No tags yet
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

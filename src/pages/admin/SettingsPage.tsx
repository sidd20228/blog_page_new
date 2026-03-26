import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { toast } from "sonner";
import { Save, User, Settings, Loader2, Shield, Plus, X, Mail } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";
import type { Id } from "../../../convex/_generated/dataModel";

export default function SettingsPage() {
    const settings = useQuery(api.settings.getSettings);
    const user = useQuery(api.users.getCurrentUser);
    const allowedEmails = useQuery(api.allowedEmails.getAllowedEmails);
    const updateSettings = useMutation(api.settings.updateSettings);
    const updateProfile = useMutation(api.settings.updateUserProfile);
    const addAllowedEmail = useMutation(api.allowedEmails.addAllowedEmail);
    const removeAllowedEmail = useMutation(api.allowedEmails.removeAllowedEmail);
    const { signOut } = useAuthActions();

    const [blogTitle, setBlogTitle] = useState("");
    const [blogDescription, setBlogDescription] = useState("");
    const [postsPerPage, setPostsPerPage] = useState("10");
    const [displayName, setDisplayName] = useState("");
    const [savingSettings, setSavingSettings] = useState(false);
    const [savingProfile, setSavingProfile] = useState(false);
    const [newEmail, setNewEmail] = useState("");
    const [addingEmail, setAddingEmail] = useState(false);

    useEffect(() => {
        if (settings) {
            setBlogTitle(settings.blogTitle || "BlogCMS");
            setBlogDescription(settings.blogDescription || "A modern serverless blog platform");
            setPostsPerPage(String(settings.postsPerPage || 10));
        }
    }, [settings]);

    useEffect(() => {
        if (user) {
            setDisplayName(user.name || "");
        }
    }, [user]);

    const handleSaveSettings = async () => {
        setSavingSettings(true);
        try {
            await updateSettings({
                blogTitle,
                blogDescription,
                postsPerPage: parseInt(postsPerPage),
            });
            toast.success("Settings saved");
        } catch (err) {
            toast.error("Failed to save settings");
        } finally {
            setSavingSettings(false);
        }
    };

    const handleSaveProfile = async () => {
        setSavingProfile(true);
        try {
            await updateProfile({ name: displayName });
            toast.success("Profile updated");
        } catch (err) {
            toast.error("Failed to update profile");
        } finally {
            setSavingProfile(false);
        }
    };

    const handleAddEmail = async () => {
        if (!newEmail.trim()) return;
        setAddingEmail(true);
        try {
            await addAllowedEmail({ email: newEmail.trim() });
            setNewEmail("");
            toast.success("Email added to whitelist");
        } catch (err: any) {
            toast.error(err.message || "Failed to add email");
        } finally {
            setAddingEmail(false);
        }
    };

    const handleRemoveEmail = async (id: Id<"allowedEmails">) => {
        try {
            await removeAllowedEmail({ id });
            toast.success("Email removed from whitelist");
        } catch (err) {
            toast.error("Failed to remove email");
        }
    };

    return (
        <div className="max-w-2xl space-y-8">
            {/* Profile Settings */}
            <div className="bg-card border border-border p-6 space-y-6">
                <h2 className="font-display text-sm uppercase tracking-widest text-foreground-muted pb-3 border-b border-primary flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Profile
                </h2>

                <div className="flex items-center gap-4 pb-4 border-b border-border">
                    {user?.image ? (
                        <img
                            src={user.image}
                            alt={user.name || "User"}
                            className="w-14 h-14 border-2 border-primary/30 object-cover"
                        />
                    ) : (
                        <div className="w-14 h-14 border-2 border-primary/30 flex items-center justify-center">
                            <span className="text-xl text-primary font-mono">
                                {(user?.name || user?.email || "?")[0]?.toUpperCase()}
                            </span>
                        </div>
                    )}
                    <div>
                        <p className="text-sm font-display text-foreground">
                            {user?.email || "Loading..."}
                        </p>
                        <p className="text-xs text-foreground-subtle mt-0.5">
                            Role: {user?.role || "admin"}
                        </p>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-display text-foreground-muted mb-1.5">
                        Display Name
                    </label>
                    <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Your display name"
                        className="w-full bg-background border border-border px-3 py-2 text-sm text-foreground placeholder:text-foreground-subtle focus:outline-none focus:border-primary transition-colors"
                    />
                </div>

                <button
                    onClick={handleSaveProfile}
                    disabled={savingProfile}
                    className="inline-flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground font-display text-sm hover:shadow-glow-cyan transition-all disabled:opacity-50"
                >
                    {savingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Profile
                </button>
            </div>

            {/* Blog Settings */}
            <div className="bg-card border border-border p-6 space-y-6">
                <h2 className="font-display text-sm uppercase tracking-widest text-foreground-muted pb-3 border-b border-primary flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Blog Settings
                </h2>

                <div>
                    <label className="block text-xs font-display text-foreground-muted mb-1.5">Blog Title</label>
                    <input type="text" value={blogTitle} onChange={(e) => setBlogTitle(e.target.value)}
                        className="w-full bg-background border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary transition-colors" />
                </div>

                <div>
                    <label className="block text-xs font-display text-foreground-muted mb-1.5">Blog Description</label>
                    <textarea value={blogDescription} onChange={(e) => setBlogDescription(e.target.value)} rows={3}
                        className="w-full bg-background border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary transition-colors resize-none" />
                </div>

                <div>
                    <label className="block text-xs font-display text-foreground-muted mb-1.5">Posts Per Page</label>
                    <select value={postsPerPage} onChange={(e) => setPostsPerPage(e.target.value)}
                        className="w-full bg-background border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary transition-colors">
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                        <option value="20">20</option>
                    </select>
                </div>

                <button onClick={handleSaveSettings} disabled={savingSettings}
                    className="inline-flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground font-display text-sm hover:shadow-glow-cyan transition-all disabled:opacity-50">
                    {savingSettings ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Settings
                </button>
            </div>

            {/* OAuth Email Whitelist */}
            <div className="bg-card border border-border p-6 space-y-6">
                <h2 className="font-display text-sm uppercase tracking-widest text-foreground-muted pb-3 border-b border-accent flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    OAuth Email Whitelist
                </h2>

                <p className="text-xs text-foreground-subtle leading-relaxed">
                    Control which email addresses can sign in to the admin dashboard.
                    If no emails are added, all OAuth logins are allowed.
                </p>

                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-subtle" />
                        <input
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            placeholder="user@example.com"
                            onKeyDown={(e) => e.key === "Enter" && handleAddEmail()}
                            className="w-full bg-background border border-border pl-10 pr-3 py-2 text-sm text-foreground placeholder:text-foreground-subtle focus:outline-none focus:border-accent transition-colors"
                        />
                    </div>
                    <button
                        onClick={handleAddEmail}
                        disabled={addingEmail || !newEmail.trim()}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-accent text-accent-foreground font-display text-sm hover:shadow-glow-green transition-all disabled:opacity-50"
                    >
                        {addingEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        Add
                    </button>
                </div>

                {allowedEmails && allowedEmails.length > 0 ? (
                    <div className="space-y-2">
                        {allowedEmails.map((entry) => (
                            <div
                                key={entry._id}
                                className="flex items-center justify-between px-3 py-2 bg-background border border-border group hover:border-accent/30 transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <Mail className="w-3.5 h-3.5 text-accent" />
                                    <span className="text-sm text-foreground font-mono">{entry.email}</span>
                                </div>
                                <button
                                    onClick={() => handleRemoveEmail(entry._id)}
                                    className="text-foreground-subtle hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                                    title="Remove"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-6 border border-dashed border-border">
                        <Shield className="w-6 h-6 text-foreground-subtle mx-auto mb-2" />
                        <p className="text-xs text-foreground-subtle">
                            No restrictions — all OAuth emails are allowed
                        </p>
                    </div>
                )}
            </div>

            {/* Account */}
            <div className="bg-card border border-border p-6 space-y-4">
                <h2 className="font-display text-sm uppercase tracking-widest text-foreground-muted pb-3 border-b border-destructive">
                    Account
                </h2>
                <button onClick={() => void signOut()}
                    className="px-4 py-2 border border-destructive text-destructive text-sm font-display hover:bg-destructive/10 transition-colors">
                    Sign Out
                </button>
            </div>
        </div>
    );
}

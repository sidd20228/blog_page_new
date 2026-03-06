import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useConvexAuth } from "convex/react";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";
import { Loader2 } from "lucide-react";

export default function AdminLayout() {
    const { isAuthenticated, isLoading } = useConvexAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
                    <p className="text-sm text-foreground-muted font-display">Authenticating...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return (
        <div className="min-h-screen flex bg-background">
            <AdminSidebar />
            <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
                <AdminHeader />
                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

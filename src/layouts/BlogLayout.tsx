import { Outlet } from "react-router-dom";
import Navigation from "../components/blog/Navigation";
import Footer from "../components/blog/Footer";

export default function BlogLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-background grid-pattern">
            <Navigation />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

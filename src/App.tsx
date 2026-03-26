import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";

// Blog pages
import BlogLayout from "./layouts/BlogLayout";
import BlogListPage from "./pages/blog/BlogListPage";
import PostPage from "./pages/blog/PostPage";
import TagsPage from "./pages/blog/TagsPage";
import TagPostsPage from "./pages/blog/TagPostsPage";
import SearchPage from "./pages/blog/SearchPage";

// Admin pages
import AdminLayout from "./layouts/AdminLayout";
import DashboardPage from "./pages/admin/DashboardPage";
import PostsPage from "./pages/admin/PostsPage";
import EditorPage from "./pages/admin/EditorPage";
import MediaPage from "./pages/admin/MediaPage";
import SettingsPage from "./pages/admin/SettingsPage";

// Auth
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "hsl(0 0% 7%)",
            color: "hsl(0 0% 100%)",
            border: "1px solid hsl(0 0% 15%)",
            fontFamily: "Inter, sans-serif",
          },
        }}
      />
      <Routes>
        {/* Blog Routes */}
        <Route element={<BlogLayout />}>
          <Route path="/" element={<Navigate to="/blog" replace />} />
          <Route path="/blog" element={<BlogListPage />} />
          <Route path="/blog/:slug" element={<PostPage />} />
          <Route path="/tags" element={<TagsPage />} />
          <Route path="/tags/:slug" element={<TagPostsPage />} />
          <Route path="/search" element={<SearchPage />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="posts" element={<PostsPage />} />
          <Route path="editor" element={<EditorPage />} />
          <Route path="editor/:id" element={<EditorPage />} />
          <Route path="media" element={<MediaPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;

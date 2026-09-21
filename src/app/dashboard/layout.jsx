// app/dashboard/layout.jsx
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground lg:flex-row">
      {/* Sidebar: Mobile top bar (< lg) / Left persistent sidebar (>= lg) */}
      <DashboardSidebar />

      {/* Main Page Workspace */}
      <main className="flex-1 w-full overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}

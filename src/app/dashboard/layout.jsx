// app/dashboard/layout.jsx
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground lg:flex-row">
      <DashboardSidebar />

     
      <div className="flex flex-1 flex-col overflow-hidden">
       
        <DashboardNavbar />

       
        <main className="flex-1 w-full overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
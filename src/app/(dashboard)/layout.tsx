import { Sidebar } from '@/components/dashboard/Sidebar';
import { AuthGate } from '@/components/auth/AuthGate';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate>
      <div className="min-h-screen bg-white text-[#17161c]">
        <Sidebar />
        <main className="app-main">{children}</main>
      </div>
    </AuthGate>
  );
}

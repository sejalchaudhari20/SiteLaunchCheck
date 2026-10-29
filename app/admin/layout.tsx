import Link from 'next/link';
import { LayoutDashboard, FileSearch, Users, Activity, MessageSquare } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-border flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <span className="font-heading font-bold text-lg text-primary">SiteLaunchCheck</span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 text-dark rounded-lg hover:bg-gray-100 font-medium">
            <LayoutDashboard className="w-5 h-5 text-muted" /> Overview
          </Link>
          <Link href="/admin/audits" className="flex items-center gap-3 px-3 py-2 text-dark rounded-lg hover:bg-gray-100 font-medium">
            <FileSearch className="w-5 h-5 text-muted" /> Audits
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 px-3 py-2 text-dark rounded-lg hover:bg-gray-100 font-medium opacity-50 cursor-not-allowed">
            <Users className="w-5 h-5 text-muted" /> Users/Sessions
          </Link>
          <Link href="/admin/events" className="flex items-center gap-3 px-3 py-2 text-dark rounded-lg hover:bg-gray-100 font-medium opacity-50 cursor-not-allowed">
            <Activity className="w-5 h-5 text-muted" /> Events
          </Link>
          <Link href="/admin/feedback" className="flex items-center gap-3 px-3 py-2 text-dark rounded-lg hover:bg-gray-100 font-medium">
            <MessageSquare className="w-5 h-5 text-muted" /> Feedback
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}

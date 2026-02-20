import { AdminSidebar } from '@/components/admin/sidebar';
import { requireAdmin } from '@/actions/auth';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    await requireAdmin();

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <AdminSidebar />
            <div className="flex-1 ml-64 min-h-screen">
                <main className="p-8 lg:p-12 max-w-[1600px] mx-auto">{children}</main>
            </div>
        </div>
    );
}

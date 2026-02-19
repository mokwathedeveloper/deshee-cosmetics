import { AdminSidebar } from '@/components/admin/sidebar';
import { requireAdmin } from '@/actions/auth';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    await requireAdmin();

    return (
        <div className="min-h-screen bg-secondary">
            <AdminSidebar />
            <div className="ml-56">
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}

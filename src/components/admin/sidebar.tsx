'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
    LayoutDashboard, 
    Package, 
    ShoppingCart, 
    Grid3X3, 
    Store,
    Settings,
    LogOut
} from 'lucide-react';
import { Logo } from '@/components/store/logo';
import { Button } from '@/components/ui/button';
import { signOut } from '@/actions/auth';

const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { label: 'Categories', href: '/admin/categories', icon: Grid3X3 },
];

export function AdminSidebar() {
    const pathname = usePathname();

    function isActive(href: string) {
        if (href === '/admin') return pathname === '/admin';
        return pathname.startsWith(href);
    }

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-slate-950 flex flex-col border-r border-white/5 shadow-2xl">
            {/* Branding */}
            <div className="px-8 py-10">
                <Link href="/admin" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-[-5deg] transition-transform">
                        <Settings className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                        <p className="text-white font-black text-sm tracking-widest uppercase leading-none">Admin</p>
                        <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Control Panel</p>
                    </div>
                </Link>
            </div>

            {/* Nav Section */}
            <div className="flex-1 px-4 space-y-8">
                <div className="space-y-1">
                    <p className="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-4">Core Management</p>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all duration-300 group ${active
                                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                                        : 'text-white/50 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <Icon className={`h-4 w-4 transition-transform duration-500 group-hover:scale-110 ${active ? 'text-white' : 'text-primary/60 group-hover:text-primary'}`} />
                                {item.label}
                            </Link>
                        );
                    })}
                </div>

                <div className="space-y-1">
                    <p className="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-4">Storefront</p>
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white hover:bg-white/5 transition-all duration-300 group"
                    >
                        <Store className="h-4 w-4 text-primary/60 group-hover:text-primary transition-colors" />
                        View Store
                    </Link>
                </div>
            </div>

            {/* User Action */}
            <div className="p-4 border-t border-white/5">
                <form action={signOut}>
                    <Button 
                        variant="ghost" 
                        type="submit" 
                        className="w-full justify-start gap-3 px-4 py-6 rounded-2xl text-xs font-bold uppercase tracking-widest text-white/40 hover:text-destructive hover:bg-destructive/5 transition-all"
                    >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </Button>
                </form>
            </div>
        </aside>
    );
}

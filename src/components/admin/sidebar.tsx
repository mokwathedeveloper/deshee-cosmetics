'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, Grid3X3, Store } from 'lucide-react';

const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
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
        <aside className="fixed left-0 top-0 z-40 h-screen w-56 bg-gray-800 flex flex-col">
            {/* Logo */}
            <div className="flex items-center gap-2 px-5 py-5 border-b border-gray-700">
                <Store className="h-5 w-5 text-white" />
                <span className="text-white font-bold text-sm">Admin Portal</span>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${active
                                    ? 'bg-primary text-white'
                                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                                }`}
                        >
                            <Icon className="h-4 w-4" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Back to Store */}
            <div className="px-3 pb-5">
                <Link
                    href="/"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                >
                    <Store className="h-4 w-4" />
                    Back to Store
                </Link>
            </div>
        </aside>
    );
}

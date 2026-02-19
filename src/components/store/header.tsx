'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Search, User, ShoppingBag, Menu, X, Phone } from 'lucide-react';
import { storeNavItems, siteConfig } from '@/config/site';
import { useCart } from '@/hooks/use-cart';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Logo } from './logo';

export function Header() {
    const { itemCount } = useCart();
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            {/* Marquee Announcement */}
            <div className="bg-primary overflow-hidden whitespace-nowrap">
                <div className="animate-marquee inline-block py-1.5">
                    <span className="text-[11px] text-primary-foreground/90 tracking-wide mx-8">
                        ✨ FREE DELIVERY in Nairobi on orders over KES 5,000
                    </span>
                    <span className="text-[11px] text-primary-foreground/70 mx-8">|</span>
                    <span className="text-[11px] text-primary-foreground/90 tracking-wide mx-8">
                        🎁 New arrivals added every week
                    </span>
                    <span className="text-[11px] text-primary-foreground/70 mx-8">|</span>
                    <span className="text-[11px] text-primary-foreground/90 tracking-wide mx-8">
                        💯 100% Authentic Products — Original Brands Only
                    </span>
                    <span className="text-[11px] text-primary-foreground/70 mx-8">|</span>
                    <span className="text-[11px] text-primary-foreground/90 tracking-wide mx-8">
                        ✨ FREE DELIVERY in Nairobi on orders over KES 5,000
                    </span>
                    <span className="text-[11px] text-primary-foreground/70 mx-8">|</span>
                    <span className="text-[11px] text-primary-foreground/90 tracking-wide mx-8">
                        🎁 New arrivals added every week
                    </span>
                </div>
            </div>

            {/* Secondary Bar */}
            <div className="bg-background border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        <span>Need help? Call us</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                        <Link href="/account" className="text-muted-foreground hover:text-primary transition-colors">
                            My Account
                        </Link>
                        <Link href="/admin/login" className="text-muted-foreground hover:text-primary transition-colors">
                            Admin
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-lg' : ''}`}>
                <div className="bg-background">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16 lg:h-20">
                            {/* Mobile Menu */}
                            <button
                                onClick={() => setMobileOpen(!mobileOpen)}
                                className="lg:hidden text-foreground hover:text-primary transition-colors"
                                aria-label="Menu"
                            >
                                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </button>

                            {/* Logo */}
                            <Link href="/" className="flex items-center">
                                <Logo />
                            </Link>

                            {/* Desktop Nav — Pill Shape */}
                            <nav className="hidden lg:flex items-center bg-primary rounded-full px-2 py-1">
                                {storeNavItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`px-5 py-2 text-[12px] font-semibold tracking-[0.12em] uppercase rounded-full transition-all ${pathname === item.href
                                            ? 'bg-primary-foreground text-primary'
                                            : 'text-primary-foreground hover:bg-primary-foreground/15'
                                            }`}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </nav>

                            {/* Right Actions */}
                            <div className="flex items-center gap-2">
                                <button
                                    aria-label="Search"
                                    className="w-10 h-10 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors"
                                >
                                    <Search className="h-4 w-4 text-secondary-foreground" />
                                </button>
                                <Link
                                    href="/account"
                                    aria-label="Account"
                                    className="hidden sm:flex w-10 h-10 rounded-full bg-secondary hover:bg-secondary/80 items-center justify-center transition-colors"
                                >
                                    <User className="h-4 w-4 text-secondary-foreground" />
                                </Link>
                                <Link
                                    href="/cart"
                                    aria-label="Cart"
                                    className="relative w-10 h-10 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors"
                                >
                                    <ShoppingBag className="h-4 w-4 text-secondary-foreground" />
                                    {itemCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-[9px] font-bold rounded-full h-[18px] min-w-[18px] flex items-center justify-center px-1">
                                            {itemCount}
                                        </span>
                                    )}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {mobileOpen && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
                    <div className="absolute top-0 left-0 w-72 h-full bg-card shadow-2xl animate-slide-in-right">
                        {/* Mobile Logo */}
                        <div className="p-5 border-b border-border">
                            <Logo />
                        </div>
                        <nav className="p-4 flex flex-col gap-1">
                            {storeNavItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={`px-4 py-3 rounded-lg text-sm font-semibold uppercase tracking-wide transition-colors ${pathname === item.href
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                                        }`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                            <hr className="my-3 border-border" />
                            <Link
                                href="/account"
                                onClick={() => setMobileOpen(false)}
                                className="px-4 py-3 rounded-lg text-sm text-muted-foreground hover:bg-accent flex items-center gap-2"
                            >
                                <User className="h-4 w-4" /> My Account
                            </Link>
                        </nav>
                    </div>
                </div>
            )}
        </>
    );
}

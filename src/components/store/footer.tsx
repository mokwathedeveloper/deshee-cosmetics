import Link from 'next/link';
import { Instagram, Facebook, Twitter, Mail } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { Logo } from './logo';

export function Footer() {
    return (
        <footer className="bg-card text-muted-foreground">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
                <div className="grid grid-cols-2 md:grid-cols-12 gap-8 md:gap-4">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-4 lg:col-span-4">
                        <Link href="/" className="inline-block mb-4">
                            <Logo inverted />
                        </Link>
                        <p className="text-sm leading-relaxed max-w-xs mb-5">
                            Your trusted destination for premium, authentic beauty products. Quality you can feel.
                        </p>
                        <div className="flex items-center gap-2.5">
                            {[
                                { icon: Instagram, label: 'Instagram' },
                                { icon: Facebook, label: 'Facebook' },
                                { icon: Twitter, label: 'Twitter' },
                                { icon: Mail, label: 'Email' },
                            ].map((social) => (
                                <a
                                    key={social.label}
                                    href="#"
                                    aria-label={social.label}
                                    className="w-8 h-8 rounded-full bg-accent border border-border flex items-center justify-center hover:bg-primary hover:border-primary text-foreground transition-all"
                                >
                                    <social.icon className="h-3.5 w-3.5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Shop */}
                    <div className="col-span-1 md:col-span-2">
                        <h4 className="text-[11px] font-semibold tracking-wider uppercase text-foreground mb-4">
                            Shop
                        </h4>
                        <ul className="space-y-2.5">
                            {['Skincare', 'Makeup', 'Fragrance', 'Hair Care', 'Nail Care'].map((item) => (
                                <li key={item}>
                                    <Link
                                        href={`/shop/${item.toLowerCase().replace(' ', '-')}`}
                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Customer Care */}
                    <div className="col-span-1 md:col-span-3">
                        <h4 className="text-[11px] font-semibold tracking-wider uppercase text-foreground mb-4">
                            Customer Care
                        </h4>
                        <ul className="space-y-2.5">
                            {[
                                { label: 'Contact Us', href: '#' },
                                { label: 'Shipping & Returns', href: '#' },
                                { label: 'FAQ', href: '#' },
                                { label: 'Track Order', href: '#' },
                                { label: 'Size Guide', href: '#' },
                            ].map((item) => (
                                <li key={item.label}>
                                    <Link href={item.href} className="text-muted-foreground hover:text-foreground transition-colors">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="col-span-2 md:col-span-3">
                        <h4 className="text-[11px] font-semibold tracking-wider uppercase text-foreground mb-4">
                            Newsletter
                        </h4>
                        <p className="text-sm mb-3">
                            Get 10% off your first order.
                        </p>
                        <form className="flex gap-0 rounded-full overflow-hidden border border-border">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="flex-1 min-w-0 px-4 py-2.5 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                            />
                            <button
                                type="submit"
                                className="flex-shrink-0 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
                            >
                                Join
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-border mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-[11px]">
                        © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4 text-[11px]">
                        <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
                        <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
                        <Link href="#" className="hover:text-foreground transition-colors">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

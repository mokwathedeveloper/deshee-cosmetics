import Link from 'next/link';
import { Instagram, Facebook, Twitter, Mail } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { Logo } from './logo';

export function Footer() {
    return (
        <footer className="bg-card text-muted-foreground border-t border-border/40">
            <div className="container py-16 md:py-24">
                <div className="grid grid-cols-2 md:grid-cols-12 gap-12 md:gap-8">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-4 lg:col-span-5">
                        <Link href="/" className="inline-block mb-8">
                            <Logo />
                        </Link>
                        <p className="text-base leading-relaxed max-w-sm mb-8 text-muted-foreground/80">
                            The ultimate destination for premium, authentic beauty products in Kenya. We bring the world&apos;s best brands to your doorstep.
                        </p>
                        <div className="flex items-center gap-3">
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
                                    className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                                >
                                    <social.icon className="h-4 w-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Shop */}
                    <div className="col-span-1 md:col-span-2">
                        <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase text-foreground mb-6">
                            Collection
                        </h4>
                        <ul className="space-y-4">
                            {['Skincare', 'Makeup', 'Fragrance', 'Hair Care'].map((item) => (
                                <li key={item}>
                                    <Link
                                        href={`/shop/${item.toLowerCase().replace(' ', '-')}`}
                                        className="text-sm hover:text-primary transition-colors font-medium"
                                    >
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Customer Care */}
                    <div className="col-span-1 md:col-span-3">
                        <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase text-foreground mb-6">
                            Client Services
                        </h4>
                        <ul className="space-y-4 text-sm font-medium">
                            {[
                                { label: 'Contact Us', href: '/contact' },
                                { label: 'Shipping & Returns', href: '/shipping' },
                                { label: 'FAQ', href: '/faq' },
                                { label: 'Track Your Order', href: '/account/orders' },
                            ].map((item) => (
                                <li key={item.label}>
                                    <Link href={item.href} className="hover:text-primary transition-colors">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter - Optional/Alternative Layout */}
                    <div className="col-span-2 md:col-span-3 lg:col-span-2 hidden">
                        {/* If we want a newsletter here too, but we have a big one on homepage */}
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-border/40 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">
                            © {new Date().getFullYear()} {siteConfig.name}
                        </p>
                        <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest">
                            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
                            <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4 opacity-50 grayscale transition-all hover:grayscale-0">
                        {/* Trusted Payment Icons Placeholder */}
                        <div className="h-5 w-8 bg-muted rounded-sm" />
                        <div className="h-5 w-8 bg-muted rounded-sm" />
                        <div className="h-5 w-8 bg-muted rounded-sm" />
                    </div>
                </div>
            </div>
        </footer>
    );
}

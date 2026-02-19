import Link from 'next/link';
import { Instagram, Facebook, Twitter, Mail } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { Logo } from './logo';

export function Footer() {
    return (
        <footer className="bg-black text-gray-400">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
                <div className="grid grid-cols-2 md:grid-cols-12 gap-8 md:gap-4">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-4 lg:col-span-4">
                        <Link href="/" className="inline-block mb-4">
                            <Logo inverted />
                        </Link>
                        <p className="text-sm text-gray-500 leading-relaxed max-w-xs mb-5">
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
                                    className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:bg-[#036B3F] hover:border-[#036B3F] hover:text-white transition-all"
                                >
                                    <social.icon className="h-3.5 w-3.5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Shop */}
                    <div className="col-span-1 md:col-span-2">
                        <h4 className="text-[11px] font-semibold tracking-wider uppercase text-white mb-4">
                            Shop
                        </h4>
                        <ul className="space-y-2.5">
                            {['Skincare', 'Makeup', 'Fragrance', 'Hair Care', 'Nail Care'].map((item) => (
                                <li key={item}>
                                    <Link
                                        href={`/shop/${item.toLowerCase().replace(' ', '-')}`}
                                        className="text-sm text-gray-500 hover:text-white transition-colors"
                                    >
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Customer Care */}
                    <div className="col-span-1 md:col-span-3">
                        <h4 className="text-[11px] font-semibold tracking-wider uppercase text-white mb-4">
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
                                    <Link href={item.href} className="text-sm text-gray-500 hover:text-white transition-colors">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="col-span-2 md:col-span-3">
                        <h4 className="text-[11px] font-semibold tracking-wider uppercase text-white mb-4">
                            Newsletter
                        </h4>
                        <p className="text-sm text-gray-500 mb-3">
                            Get 10% off your first order.
                        </p>
                        <form className="flex gap-0 rounded-full overflow-hidden border border-white/10">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="flex-1 min-w-0 px-4 py-2.5 bg-transparent text-sm text-white placeholder:text-gray-600 focus:outline-none"
                            />
                            <button
                                type="submit"
                                className="flex-shrink-0 px-5 py-2.5 bg-[#036B3F] text-white text-sm font-semibold hover:bg-[#025a33] transition-colors"
                            >
                                Join
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/5 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-[11px] text-gray-600">
                        © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4 text-[11px] text-gray-600">
                        <Link href="#" className="hover:text-gray-400 transition-colors">Privacy</Link>
                        <Link href="#" className="hover:text-gray-400 transition-colors">Terms</Link>
                        <Link href="#" className="hover:text-gray-400 transition-colors">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

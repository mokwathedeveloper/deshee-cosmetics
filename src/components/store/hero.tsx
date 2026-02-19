import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function Hero() {
    return (
        <section className="relative bg-gradient-to-br from-green-50 via-white to-amber-50/30 overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-[10%] w-64 h-64 bg-secondary/15 rounded-full blur-3xl" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-28">
                <div className="max-w-xl">
                    <span className="inline-block bg-primary/10 text-primary text-[11px] font-semibold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full mb-5">
                        New Season 2026
                    </span>
                    <h1 className="text-4xl md:text-[50px] font-bold text-gray-900 leading-[1.1] mb-4 tracking-tight">
                        Your Beauty,{' '}
                        <span className="text-primary">Our Passion</span>
                    </h1>
                    <p className="text-base text-gray-500 leading-relaxed mb-8 max-w-md">
                        Discover premium cosmetics and skincare from the world&apos;s best beauty brands. Authentic products, delivered to your door.
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                        <Link
                            href="/shop"
                            className="inline-flex items-center gap-2 bg-primary text-white px-7 py-3.5 rounded-full text-sm font-semibold hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-green-900/20"
                        >
                            Shop Collection
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link
                            href="/shop/skincare"
                            className="inline-flex items-center gap-2 border-2 border-gray-900 text-gray-900 px-7 py-3 rounded-full text-sm font-semibold hover:bg-gray-900 hover:text-white transition-all"
                        >
                            Skincare
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

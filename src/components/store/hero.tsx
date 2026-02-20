import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Hero() {
    return (
        <section className="relative min-h-[85vh] flex items-center bg-background overflow-hidden border-b border-border/40">
            {/* Background Aesthetic */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 right-0 w-[50%] h-full bg-primary/[0.02] rounded-l-[100px] hidden lg:block" />
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-[100px]" />
            </div>

            <div className="container relative z-10 py-12 lg:py-20">
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                    
                    {/* Left Content */}
                    <div className="lg:col-span-7 space-y-8 animate-in fade-in slide-in-from-left duration-1000">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/10 px-4 py-1.5 rounded-full">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                </span>
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                                    Authentic Beauty Only
                                </span>
                            </div>
                            
                            <h1 className="text-4xl md:text-6xl lg:text-[72px] font-black text-foreground leading-[1.05] tracking-tight">
                                Radiant Skin <br />
                                <span className="text-primary italic font-serif font-normal">Starts Here.</span>
                            </h1>
                            
                            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
                                Premium cosmetics and skincare from global brands, curated for the modern Kenyan woman. Delivered fast, guaranteed original.
                            </p>
                        </div>

                        {/* Trust Line */}
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                            {[
                                'Authentic Products',
                                'Fast Delivery in Kenya',
                                'Easy 7-Day Returns'
                            ].map((text) => (
                                <div key={text} className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-primary" />
                                    <span className="text-xs font-bold text-foreground/70 uppercase tracking-wider">{text}</span>
                                </div>
                            ))}
                        </div>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                            <Button asChild size="lg" className="w-full sm:w-auto rounded-full h-14 px-10 text-base font-bold shadow-2xl shadow-primary/20 hover:-translate-y-1 transition-all"><Link href="/shop" className="gap-2">
                                    Shop Bestsellers <ShoppingBag className="h-4.5 w-4.5" />
                                </Link></Button>
                            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto rounded-full h-14 px-10 text-base font-bold border-2 hover:bg-muted/50 transition-all"><Link href="/shop">Browse Categories</Link></Button>
                        </div>
                    </div>

                    {/* Right Visual */}
                    <div className="lg:col-span-5 relative animate-in fade-in slide-in-from-right duration-1000 delay-200">
                        <div className="relative aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl border-4 border-white">
                            <Image 
                                src="/hero.jpg" 
                                alt="Cosmetics essentials — DeeShee Beauty Empire" 
                                fill 
                                className="object-cover"
                                sizes="(min-width: 1024px) 50vw, 100vw"
                            />
                            
                            {/* Floating Card Detail */}
                            <div className="absolute bottom-6 left-6 right-6 bg-white/80 backdrop-blur-xl p-5 rounded-3xl border border-white/40 shadow-xl hidden sm:block">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <CheckCircle2 className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-foreground tracking-tight">Genuine Quality</p>
                                        <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Verified authentic beauty</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Decorative elements behind image */}
                        <div className="absolute -top-6 -right-6 w-32 h-32 bg-accent/20 rounded-full blur-2xl -z-10 animate-pulse" />
                        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-primary/10 rounded-full blur-3xl -z-10" />
                    </div>
                </div>
            </div>
        </section>
    );
}

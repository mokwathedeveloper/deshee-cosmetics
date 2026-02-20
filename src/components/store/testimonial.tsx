import { Star } from 'lucide-react';

export function Testimonial() {
    return (
        <section className="py-24 md:py-32 bg-background border-y border-border/40">
            <div className="container text-center">
                <div className="flex flex-col items-center max-w-4xl mx-auto">
                    <div className="flex items-center justify-center gap-1 mb-10">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-6 w-6 fill-amber-400 text-amber-400" />
                        ))}
                    </div>
                    <blockquote className="text-2xl md:text-4xl font-black text-foreground italic leading-[1.3] tracking-tight mb-10">
                        &ldquo;I&apos;ve been shopping here for 6 months now. The products are always authentic and delivery is super fast. Their skincare collection is truly transformative!&rdquo;
                    </blockquote>
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-muted mb-4 flex items-center justify-center font-bold text-primary">SM</div>
                        <p className="text-xs font-bold tracking-[0.3em] uppercase text-muted-foreground/60">
                            Sarah M. — Verified Beauty Enthusiast
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

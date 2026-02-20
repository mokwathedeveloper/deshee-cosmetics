import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function Newsletter() {
    return (
        <section className="bg-primary py-16 md:py-24 relative overflow-hidden">
            {/* Subtle background pattern/texture could go here */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_top_right,var(--color-primary-foreground),transparent)]" />
            
            <div className="container px-4 relative z-10 text-center">
                <h2 className="text-2xl md:text-4xl font-bold text-primary-foreground mb-4 tracking-tight">
                    Join Our Beauty Community
                </h2>
                <p className="text-primary-foreground/80 text-sm md:text-base max-w-md mx-auto mb-10 leading-relaxed">
                    Be the first to know about new products, exclusive offers, and beauty tips from our experts.
                </p>
                <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                    <div className="flex-1">
                        <Input
                            type="email"
                            placeholder="Enter your email address"
                            className="w-full px-6 py-6 rounded-full bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:ring-accent/50 focus:border-accent transition-all h-auto"
                        />
                    </div>
                    <Button
                        type="submit"
                        className="px-10 py-6 bg-accent text-accent-foreground text-sm font-bold rounded-full hover:bg-accent/90 transition-all hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] h-auto"
                    >
                        Subscribe Now
                    </Button>
                </form>
                <p className="text-[11px] font-medium uppercase tracking-widest text-primary-foreground/40 mt-6">No spam · Unsubscribe anytime</p>
            </div>
        </section>
    );
}

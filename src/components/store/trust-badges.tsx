import { Truck, Shield, Sparkles, Leaf } from 'lucide-react';

export function TrustBadges() {
    const badges = [
        { icon: Truck, title: 'Fast Delivery', desc: 'Nationwide shipping' },
        { icon: Shield, title: '100% Original', desc: 'Genuine products' },
        { icon: Sparkles, title: 'Clean Beauty', desc: 'Quality ingredients' },
        { icon: Leaf, title: 'Cruelty-Free', desc: 'Ethically sourced' },
    ];

    return (
        <section className="bg-background border-y border-border/40">
            <div className="container">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-0 md:divide-x divide-border/40">
                    {badges.map((badge, i) => (
                        <div key={i} className="flex items-center gap-4 py-8 px-4 md:px-8 justify-center md:justify-start group hover:bg-muted/30 transition-colors duration-500">
                            <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 group-hover:rotate-[10deg]">
                                <badge.icon className="h-6 w-6 text-primary group-hover:text-inherit transition-colors" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-foreground tracking-tight">{badge.title}</p>
                                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 font-bold">{badge.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

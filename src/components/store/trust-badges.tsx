import { Truck, Shield, Sparkles, Leaf } from 'lucide-react';

export function TrustBadges() {
    const badges = [
        { icon: Truck, title: 'Fast Delivery', desc: 'Nationwide shipping' },
        { icon: Shield, title: '100% Original', desc: 'Genuine products' },
        { icon: Sparkles, title: 'Clean Beauty', desc: 'Quality ingredients' },
        { icon: Leaf, title: 'Cruelty-Free', desc: 'Ethically sourced' },
    ];

    return (
        <section className="bg-white border-y border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-gray-100">
                    {badges.map((badge, i) => (
                        <div key={i} className="flex items-center gap-3 py-5 px-4 md:px-6">
                            <badge.icon className="h-5 w-5 text-[#036B3F] flex-shrink-0" />
                            <div>
                                <p className="text-xs font-semibold text-gray-800">{badge.title}</p>
                                <p className="text-[11px] text-gray-400">{badge.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

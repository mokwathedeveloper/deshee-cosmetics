import { Star } from 'lucide-react';

export function Testimonial() {
    return (
        <section className="py-14 bg-white border-y border-gray-100">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="flex items-center justify-center gap-0.5 mb-4">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                    ))}
                </div>
                <blockquote className="text-lg md:text-xl text-gray-700 italic leading-relaxed">
                    &ldquo;I&apos;ve been shopping here for 6 months now. The products are always authentic and delivery is super fast. Their skincare collection is amazing!&rdquo;
                </blockquote>
                <p className="mt-4 text-xs font-semibold tracking-wider uppercase text-gray-400">
                    — Sarah M., Verified Buyer
                </p>
            </div>
        </section>
    );
}

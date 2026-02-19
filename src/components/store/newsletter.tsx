import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function Newsletter() {
    return (
        <section className="bg-[#036B3F] py-16 md:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                    Join Our Beauty Community
                </h2>
                <p className="text-green-200/80 text-sm max-w-md mx-auto mb-8">
                    Be the first to know about new products, exclusive offers, and beauty tips.
                </p>
                <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                    <Input
                        type="email"
                        placeholder="Enter your email address"
                        className="flex-1 px-5 py-3.5 rounded-full bg-white/15 border border-white/20 text-white text-sm placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
                    />
                    <Button
                        type="submit"
                        className="px-8 py-3.5 bg-[#FFD700] text-gray-900 text-sm font-bold rounded-full hover:bg-[#FFC700] transition-all hover:shadow-lg"
                    >
                        Subscribe
                    </Button>
                </form>
                <p className="text-[11px] text-green-200/40 mt-4">No spam · Unsubscribe anytime</p>
            </div>
        </section>
    );
}

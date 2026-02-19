import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Truck, Shield, Sparkles, Star, ChevronRight, Leaf } from 'lucide-react';
import { getFeaturedProducts } from '@/actions/products';
import { getFeaturedCategories } from '@/actions/categories';
import { ProductCard } from '@/components/store/product-card';

export default async function HomePage() {
    const [featuredProducts, featuredCategories] = await Promise.all([
        getFeaturedProducts(4),
        getFeaturedCategories(),
    ]);

    return (
        <>
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-green-50 via-white to-amber-50/30 overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#036B3F]/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-[10%] w-64 h-64 bg-amber-200/15 rounded-full blur-3xl" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-28">
                    <div className="max-w-xl">
                        <span className="inline-block bg-[#036B3F]/10 text-[#036B3F] text-[11px] font-semibold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full mb-5">
                            New Season 2026
                        </span>
                        <h1 className="text-4xl md:text-[50px] font-bold text-gray-900 leading-[1.1] mb-4 tracking-tight">
                            Your Beauty,{' '}
                            <span className="text-[#036B3F]">Our Passion</span>
                        </h1>
                        <p className="text-base text-gray-500 leading-relaxed mb-8 max-w-md">
                            Discover premium cosmetics and skincare from the world&apos;s best beauty brands. Authentic products, delivered to your door.
                        </p>
                        <div className="flex flex-wrap items-center gap-3">
                            <Link
                                href="/shop"
                                className="inline-flex items-center gap-2 bg-[#036B3F] text-white px-7 py-3.5 rounded-full text-sm font-semibold hover:bg-[#025a33] transition-all hover:shadow-lg hover:shadow-green-900/20"
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

            {/* Trust Badges */}
            <section className="bg-white border-y border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-gray-100">
                        {[
                            { icon: Truck, title: 'Fast Delivery', desc: 'Nationwide shipping' },
                            { icon: Shield, title: '100% Original', desc: 'Genuine products' },
                            { icon: Sparkles, title: 'Clean Beauty', desc: 'Quality ingredients' },
                            { icon: Leaf, title: 'Cruelty-Free', desc: 'Ethically sourced' },
                        ].map((badge, i) => (
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

            {/* Shop by Category */}
            <section className="py-16 md:py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-end justify-between mb-8">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                                Shop by Category
                            </h2>
                            <p className="text-sm text-gray-400 mt-1">Find exactly what you&apos;re looking for</p>
                        </div>
                        <Link
                            href="/shop"
                            className="hidden sm:flex items-center gap-1 text-sm text-[#036B3F] hover:text-[#025a33] font-semibold transition-colors"
                        >
                            View all <ChevronRight className="h-4 w-4" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                        {featuredCategories.map((category, index) => (
                            <Link
                                key={category.id}
                                href={`/shop/${category.slug}`}
                                className={`category-card group relative overflow-hidden rounded-2xl ${index === 0 ? 'md:col-span-1 lg:col-span-2 aspect-[4/3]' : 'aspect-[3/4]'
                                    }`}
                            >
                                <Image
                                    src={category.image_url || '/images/placeholder.jpg'}
                                    alt={category.name}
                                    fill
                                    className="object-cover category-img"
                                    sizes={index === 0 ? '(max-width: 768px) 50vw, 40vw' : '(max-width: 768px) 50vw, 20vw'}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent category-overlay" />
                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <h3 className="font-bold text-white text-sm md:text-base">{category.name}</h3>
                                    <p className="text-[11px] text-white/70 mt-0.5 line-clamp-1">{category.description}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Bestsellers */}
            <section className="py-16 md:py-20 bg-gray-50/60">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                            Bestsellers
                        </h2>
                        <p className="text-sm text-gray-400 mt-1">Most loved by our customers</p>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                        {featuredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                    <div className="text-center mt-10">
                        <Link
                            href="/shop"
                            className="inline-flex items-center gap-2 bg-[#036B3F] text-white px-8 py-3.5 rounded-full text-sm font-semibold hover:bg-[#025a33] transition-all"
                        >
                            View All Products
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Testimonial */}
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

            {/* Newsletter */}
            <section className="bg-[#036B3F] py-16 md:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                        Join Our Beauty Community
                    </h2>
                    <p className="text-green-200/80 text-sm max-w-md mx-auto mb-8">
                        Be the first to know about new products, exclusive offers, and beauty tips.
                    </p>
                    <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            className="flex-1 px-5 py-3.5 rounded-full bg-white/15 border border-white/20 text-white text-sm placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
                        />
                        <button
                            type="submit"
                            className="px-8 py-3.5 bg-[#FFD700] text-gray-900 text-sm font-bold rounded-full hover:bg-[#FFC700] transition-all hover:shadow-lg"
                        >
                            Subscribe
                        </button>
                    </form>
                    <p className="text-[11px] text-green-200/40 mt-4">No spam · Unsubscribe anytime</p>
                </div>
            </section>
        </>
    );
}

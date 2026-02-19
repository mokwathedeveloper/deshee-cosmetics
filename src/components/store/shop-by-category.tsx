import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import type { Category } from '@/types/database';

type ShopByCategoryProps = {
    categories: Category[];
};

export function ShopByCategory({ categories }: ShopByCategoryProps) {
    return (
        <section className="py-16 md:py-20 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                            Shop by Category
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">Find exactly what you&apos;re looking for</p>
                    </div>
                    <Link
                        href="/shop"
                        className="hidden sm:flex items-center gap-1 text-sm text-primary hover:text-primary/80 font-semibold transition-colors"
                    >
                        View all <ChevronRight className="h-4 w-4" />
                    </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {categories.map((category, index) => (
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
    );
}

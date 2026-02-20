import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import type { Category } from '@/types/database';
import { cn } from '@/lib/utils';

type ShopByCategoryProps = {
    categories: Category[];
};

export function ShopByCategory({ categories }: ShopByCategoryProps) {
    return (
        <section className="py-20 md:py-28 bg-background">
            <div className="container">
                <div className="flex items-end justify-between mb-12">
                    <div className="space-y-2">
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Curated Selection</p>
                        <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">
                            Shop by Category
                        </h2>
                    </div>
                    <Link
                        href="/shop"
                        className="hidden sm:flex items-center gap-2 text-sm text-foreground hover:text-primary font-bold uppercase tracking-widest transition-all group"
                    >
                        Explore All <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {categories.map((category, index) => (
                        <Link
                            key={category.id}
                            href={`/shop/${category.slug}`}
                            className={cn(
                                "group relative overflow-hidden rounded-[32px] aspect-[4/5] bg-muted/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10",
                                index === 0 && "lg:col-span-2 lg:aspect-auto"
                            )}
                        >
                            <Image
                                src={category.image_url || '/images/placeholder.jpg'}
                                alt={category.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                sizes={index === 0 ? '(max-width: 768px) 50vw, 40vw' : '(max-width: 768px) 50vw, 20vw'}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                                <h3 className="font-bold text-white text-lg md:text-2xl tracking-tight mb-1">{category.name}</h3>
                                <p className="text-xs font-medium text-white/70 uppercase tracking-widest line-clamp-1 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                                    {category.description || 'View Products'}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

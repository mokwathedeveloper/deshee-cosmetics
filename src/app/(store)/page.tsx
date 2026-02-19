import { getFeaturedProducts } from '@/actions/products';
import { getFeaturedCategories } from '@/actions/categories';
import { Hero } from '@/components/store/hero';
import { TrustBadges } from '@/components/store/trust-badges';
import { ShopByCategory } from '@/components/store/shop-by-category';
import { Bestsellers } from '@/components/store/bestsellers';
import { Testimonial } from '@/components/store/testimonial';
import { Newsletter } from '@/components/store/newsletter';

export default async function HomePage() {
    const [featuredProducts, featuredCategories] = await Promise.all([
        getFeaturedProducts(4),
        getFeaturedCategories(),
    ]);

    return (
        <>
            <Hero />
            <TrustBadges />
            <ShopByCategory categories={featuredCategories} />
            <Bestsellers products={featuredProducts} />
            <Testimonial />
            <Newsletter />
        </>
    );
}

import { Metadata } from 'next';
import { getProductBySlug } from '@/actions/products';
import { notFound } from 'next/navigation';
import { ProductDetailClient } from './product-detail-client';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const product = await getProductBySlug(slug);
    if (!product) return { title: 'Product Not Found' };

    return {
        title: product.name,
        description: product.description?.slice(0, 160) || `Shop ${product.name} at Beauty Shop.`,
        openGraph: {
            title: product.name,
            description: product.description?.slice(0, 160) || `Shop ${product.name} at Beauty Shop.`,
            type: 'website',
            images: product.product_images?.[0]?.url ? [product.product_images[0].url] : [],
        },
    };
}

export default async function ProductPage({ params }: Props) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) notFound();

    return <ProductDetailClient product={product} />;
}

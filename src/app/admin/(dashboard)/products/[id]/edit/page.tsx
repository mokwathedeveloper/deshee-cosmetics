import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { ProductForm } from '@/components/admin/product-form';
import type { Product } from '@/types/database';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Edit Product',
};

interface Props {
    params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: product } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

    if (!product) notFound();

    return <ProductForm product={product as Product} />;
}

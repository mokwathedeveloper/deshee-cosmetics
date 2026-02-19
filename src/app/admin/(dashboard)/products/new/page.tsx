import { ProductForm } from '@/components/forms/product-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Add New Product',
};

export default function NewProductPage() {
    return <ProductForm />;
}

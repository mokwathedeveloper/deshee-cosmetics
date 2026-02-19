import { CheckoutForm } from '@/components/forms/checkout-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Checkout',
};

export default function CheckoutPage() {
    return (
        <div className="container py-8">
            <CheckoutForm />
        </div>
    );
}

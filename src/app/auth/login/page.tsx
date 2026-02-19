'use client';

import { Suspense } from 'react';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signIn } from '@/actions/auth';
import { toast } from 'sonner';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const returnUrl = searchParams.get('returnUrl') || '/';
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        const result = await signIn(formData);
        setLoading(false);

        if (result.error) {
            toast.error(result.error);
            return;
        }

        toast.success('Welcome back!');
        router.push(returnUrl);
        router.refresh();
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link href="/" className="text-2xl font-bold text-pink-500">Beauty Shop</Link>
                    <h1 className="text-xl font-semibold text-gray-900 mt-4">Sign In</h1>
                    <p className="text-sm text-muted-foreground mt-1">Welcome back! Enter your credentials.</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border shadow-sm space-y-4">
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            className="mt-1"
                        />
                    </div>
                    <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                            className="mt-1"
                        />
                    </div>
                    <Button type="submit" disabled={loading} className="w-full bg-pink-500 hover:bg-pink-600">
                        {loading ? 'Signing in...' : 'Sign In'}
                    </Button>
                </form>

                <p className="text-center text-sm text-muted-foreground mt-4">
                    Don&apos;t have an account?{' '}
                    <Link href="/auth/register" className="text-pink-500 hover:text-pink-600 font-medium">
                        Create Account
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense>
            <LoginForm />
        </Suspense>
    );
}

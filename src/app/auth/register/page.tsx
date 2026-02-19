'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signUp } from '@/actions/auth';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        password: '',
        confirm_password: '',
    });

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (formData.password !== formData.confirm_password) {
            toast.error('Passwords do not match');
            return;
        }

        setLoading(true);
        const result = await signUp(formData);
        setLoading(false);

        if (result.error) {
            toast.error(result.error);
            return;
        }

        toast.success('Account created! Please check your email to verify.');
        router.push('/auth/login');
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link href="/" className="text-2xl font-bold text-primary">Beauty Shop</Link>
                    <h1 className="text-xl font-semibold text-foreground mt-4">Create Account</h1>
                    <p className="text-sm text-muted-foreground mt-1">Join us for exclusive beauty products.</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-card p-6 rounded-lg border shadow-sm space-y-4">
                    <div>
                        <Label htmlFor="full_name">Full Name</Label>
                        <Input id="full_name" name="full_name" value={formData.full_name} onChange={handleChange} required className="mt-1" />
                    </div>
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required className="mt-1" />
                    </div>
                    <div>
                        <Label htmlFor="phone">Phone (optional)</Label>
                        <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} className="mt-1" />
                    </div>
                    <div>
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required minLength={6} className="mt-1" />
                    </div>
                    <div>
                        <Label htmlFor="confirm_password">Confirm Password</Label>
                        <Input id="confirm_password" name="confirm_password" type="password" value={formData.confirm_password} onChange={handleChange} required minLength={6} className="mt-1" />
                    </div>
                    <Button type="submit" disabled={loading} className="w-full" variant="secondary">
                        {loading && <Spinner className="mr-2 h-4 w-4" />} 
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                </form>

                <p className="text-center text-sm text-muted-foreground mt-4">
                    Already have an account?{' '}
                    <Link href="/auth/login" className="text-primary hover:underline font-medium">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}

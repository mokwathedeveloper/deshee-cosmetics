'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signInAdmin } from '@/actions/auth';
import { toast } from 'sonner';
import { Store } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';

export default function AdminLoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        const result = await signInAdmin(formData);
        setLoading(false);

        if (result.error) {
            toast.error(result.error);
            return;
        }

        toast.success('Welcome to the admin portal!');
        router.push('/admin');
        router.refresh();
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-primary px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <Store className="h-6 w-6 text-secondary" />
                        <span className="text-xl font-bold text-primary-foreground">Admin Portal</span>
                    </div>
                    <p className="text-sm text-primary-foreground/80">Sign in with your admin credentials.</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-background/80 backdrop-blur-sm p-6 rounded-lg border border-border/50 space-y-4">
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
                    <Button type="submit" disabled={loading} className="w-full" variant="secondary">
                        {loading && <Spinner className="mr-2 h-4 w-4" />} 
                        {loading ? 'Signing in...' : 'Sign In'}
                    </Button>
                </form>

                <p className="text-center text-sm text-primary-foreground/60 mt-4">
                    <Link href="/" className="hover:text-primary-foreground transition-colors">← Back to Store</Link>
                </p>
            </div>
        </div>
    );
}

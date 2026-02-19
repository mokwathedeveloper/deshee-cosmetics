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
        <div className="min-h-screen flex items-center justify-center bg-[#1a1335] px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <Store className="h-6 w-6 text-pink-400" />
                        <span className="text-xl font-bold text-white">Admin Portal</span>
                    </div>
                    <p className="text-sm text-gray-400">Sign in with your admin credentials.</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/10 space-y-4">
                    <div>
                        <Label htmlFor="email" className="text-gray-300">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                        />
                    </div>
                    <div>
                        <Label htmlFor="password" className="text-gray-300">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                            className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-gray-500"
                        />
                    </div>
                    <Button type="submit" disabled={loading} className="w-full bg-pink-500 hover:bg-pink-600">
                        {loading ? 'Signing in...' : 'Sign In'}
                    </Button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-4">
                    <Link href="/" className="text-pink-400 hover:text-pink-300">← Back to Store</Link>
                </p>
            </div>
        </div>
    );
}

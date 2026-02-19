'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signUpAdmin } from '@/actions/auth';
import { toast } from 'sonner';
import { ShieldCheck } from 'lucide-react';

export default function AdminRegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        password: '',
        secret_key: '',
    });

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        const result = await signUpAdmin(formData);
        setLoading(false);

        if (result.error) {
            toast.error(result.error);
            return;
        }

        toast.success('Admin account created! You can now sign in.');
        router.push('/admin/login');
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900 px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-pink-500/20 mb-4">
                        <ShieldCheck className="h-7 w-7 text-pink-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Admin Registration</h1>
                    <p className="text-sm text-gray-400 mt-1">Create the admin account with your secret key</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-gray-800/50 backdrop-blur p-6 rounded-lg border border-gray-700 space-y-4">
                    <div>
                        <Label htmlFor="full_name" className="text-gray-300">Full Name</Label>
                        <Input
                            id="full_name"
                            value={formData.full_name}
                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                            required
                            className="mt-1 bg-gray-700/50 border-gray-600 text-white"
                        />
                    </div>
                    <div>
                        <Label htmlFor="email" className="text-gray-300">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            className="mt-1 bg-gray-700/50 border-gray-600 text-white"
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
                            minLength={6}
                            className="mt-1 bg-gray-700/50 border-gray-600 text-white"
                        />
                    </div>
                    <div>
                        <Label htmlFor="secret_key" className="text-gray-300">Secret Key 🔑</Label>
                        <Input
                            id="secret_key"
                            type="password"
                            value={formData.secret_key}
                            onChange={(e) => setFormData({ ...formData, secret_key: e.target.value })}
                            required
                            placeholder="Enter admin secret key"
                            className="mt-1 bg-gray-700/50 border-gray-600 text-white"
                        />
                    </div>
                    <Button type="submit" disabled={loading} className="w-full bg-pink-500 hover:bg-pink-600">
                        {loading ? 'Creating...' : 'Create Admin Account'}
                    </Button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-4">
                    Already have an admin account?{' '}
                    <Link href="/admin/login" className="text-pink-400 hover:text-pink-300 font-medium">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}

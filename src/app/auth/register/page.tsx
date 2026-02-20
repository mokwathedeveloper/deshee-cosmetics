'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signUp } from '@/actions/auth';
import { registerSchema, type RegisterInput } from '@/lib/validations';
import { toast } from 'sonner';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Logo } from '@/components/store/logo';
import { ArrowRight, CheckCircle2, User, Mail, Phone, Lock } from 'lucide-react';

export default function RegisterPage() {
    const router = useRouter();

    const form = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            full_name: '',
            email: '',
            phone: '',
            password: '',
            confirm_password: '',
        },
    });

    async function onSubmit(data: RegisterInput) {
        const result = await signUp(data);

        if (result.error) {
            toast.error(result.error);
            return;
        }

        toast.success('Account created! Please check your email to verify.');
        router.push('/auth/login');
    }

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-background">
            {/* Left: Branding & Benefits */}
            <div className="hidden lg:flex flex-col bg-primary text-primary-foreground p-16 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,var(--color-primary-foreground),transparent)] pointer-events-none" />
                <div className="relative z-10 h-full flex flex-col justify-between">
                    <Link href="/" className="inline-block brightness-0 invert opacity-90 hover:opacity-100 transition-opacity">
                        <Logo />
                    </Link>
                    
                    <div className="space-y-8">
                        <h2 className="text-5xl font-black leading-tight tracking-tight max-w-md">
                            Join the <br />
                            <span className="text-accent italic font-serif font-normal">Beauty Elite.</span>
                        </h2>
                        <div className="space-y-6">
                            {[
                                'First access to premium brands',
                                'Exclusive member-only discounts',
                                'Early bird skincare consultations',
                                'Fast-track delivery options'
                            ].map((benefit) => (
                                <div key={benefit} className="flex items-center gap-4 group">
                                    <div className="w-6 h-6 rounded-full bg-primary-foreground/10 flex items-center justify-center group-hover:bg-accent transition-colors">
                                        <CheckCircle2 className="h-4 w-4 text-primary-foreground group-hover:text-accent-foreground" />
                                    </div>
                                    <p className="text-lg font-medium text-primary-foreground/90">{benefit}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <p className="text-sm font-medium opacity-60 uppercase tracking-widest">
                        © {new Date().getFullYear()} Deeshee Cosmetics
                    </p>
                </div>
                
                {/* Decorative element */}
                <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-accent/20 rounded-full blur-[100px]" />
            </div>

            {/* Right: Register Form */}
            <div className="flex flex-col items-center justify-center p-8 md:p-12 lg:p-24 relative overflow-y-auto">
                <div className="w-full max-w-sm space-y-8 py-12 animate-in fade-in slide-in-from-bottom duration-1000">
                    <div className="space-y-3">
                        <div className="lg:hidden flex justify-center mb-8">
                            <Logo />
                        </div>
                        <h1 className="text-3xl font-black tracking-tight text-foreground">
                            Create Account
                        </h1>
                        <p className="text-muted-foreground font-medium">
                            Become a member of Deeshee Cosmetics today.
                        </p>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                            <FormField
                                control={form.control}
                                name="full_name"
                                render={({ field }) => (
                                    <FormItem className="space-y-1.5">
                                        <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Full Name</FormLabel>
                                        <FormControl>
                                            <div className="relative group">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                                <Input {...field} placeholder="Jane Doe" className="pl-12 h-13 rounded-xl bg-muted/30 border-border/50 focus:ring-primary/20" />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-[10px]" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem className="space-y-1.5">
                                        <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Email Address</FormLabel>
                                        <FormControl>
                                            <div className="relative group">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                                <Input type="email" {...field} placeholder="jane@example.com" className="pl-12 h-13 rounded-xl bg-muted/30 border-border/50 focus:ring-primary/20" />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-[10px]" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem className="space-y-1.5">
                                        <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Phone Number (Optional)</FormLabel>
                                        <FormControl>
                                            <div className="relative group">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                                <Input {...field} value={field.value ?? ''} placeholder="+254 --- --- ---" className="pl-12 h-13 rounded-xl bg-muted/30 border-border/50 focus:ring-primary/20" />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-[10px]" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem className="space-y-1.5">
                                        <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Password</FormLabel>
                                        <FormControl>
                                            <div className="relative group">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                                <Input type="password" {...field} placeholder="••••••••" className="pl-12 h-13 rounded-xl bg-muted/30 border-border/50 focus:ring-primary/20" />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-[10px]" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirm_password"
                                render={({ field }) => (
                                    <FormItem className="space-y-1.5">
                                        <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Confirm Password</FormLabel>
                                        <FormControl>
                                            <div className="relative group">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                                <Input type="password" {...field} placeholder="••••••••" className="pl-12 h-13 rounded-xl bg-muted/30 border-border/50 focus:ring-primary/20" />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-[10px]" />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" loading={form.formState.isSubmitting} className="w-full h-14 rounded-2xl text-base font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:-translate-y-1 active:translate-y-0 transition-all mt-4">
                                {form.formState.isSubmitting ? 'Creating...' : 'Create Account'}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </form>
                    </Form>

                    <div className="text-center">
                        <p className="text-sm font-medium text-muted-foreground">
                            Already have an account?{' '}
                            <Link href="/auth/login" className="text-primary font-bold hover:underline">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

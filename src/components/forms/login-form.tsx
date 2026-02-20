'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signIn } from '@/actions/auth';
import { loginSchema, type LoginInput } from '@/lib/validations';
import { toast } from 'sonner';
import { Eye, EyeOff, ArrowRight, Lock, Mail, CheckCircle2 } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Logo } from '@/components/store/logo';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/';
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: LoginInput) {
    const result = await signIn(data);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success('Welcome back!');
    router.push(returnUrl);
    router.refresh();
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
                    Unlock Your <br />
                    <span className="text-accent italic font-serif font-normal">Inner Glow.</span>
                </h2>
                <div className="space-y-6">
                    {[
                        'Access exclusive beauty drops',
                        'Track your orders in real-time',
                        'Personalized skincare recommendations',
                        'Member-only events & rewards'
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

      {/* Right: Login Form */}
      <div className="flex flex-col items-center justify-center p-8 md:p-12 lg:p-24 relative">
        <div className="w-full max-w-sm space-y-10 animate-in fade-in slide-in-from-bottom duration-1000">
          <div className="space-y-4">
            <div className="lg:hidden flex justify-center mb-8">
                <Logo />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-foreground">
                Welcome Back
            </h1>
            <p className="text-muted-foreground font-medium">
                Log in to your account to continue your beauty journey.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Email Address</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                          {...field}
                          type="email"
                          placeholder="jane@example.com"
                          className="pl-12 h-14 rounded-2xl bg-muted/30 border-border/50 focus:ring-primary/20 transition-all text-base font-medium"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <div className="flex items-center justify-between ml-1">
                      <FormLabel className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Password</FormLabel>
                      <Link href="#" className="text-[11px] font-bold uppercase tracking-widest text-primary hover:underline">
                        Forgot?
                      </Link>
                    </div>
                    <FormControl>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                          {...field}
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          className="pl-12 pr-12 h-14 rounded-2xl bg-muted/30 border-border/50 focus:ring-primary/20 transition-all text-base font-medium"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                loading={form.formState.isSubmitting}
                className="w-full h-14 rounded-2xl text-base font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:-translate-y-1 active:translate-y-0 transition-all"
              >
                {form.formState.isSubmitting ? 'Verifying...' : 'Log In'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </Form>

          <div className="text-center">
            <p className="text-sm font-medium text-muted-foreground">
              New to Deeshee?{' '}
              <Link
                href="/auth/register"
                className="text-primary font-bold hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>

          <div className="pt-8 flex items-center justify-center gap-4 opacity-20 grayscale hover:opacity-40 transition-opacity">
            <Link href="/admin/login" className="text-[10px] font-black uppercase tracking-[0.3em] hover:text-primary">
                System Access
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

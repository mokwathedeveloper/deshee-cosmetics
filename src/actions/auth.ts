'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function signUp(formData: {
    email: string;
    password: string;
    full_name: string;
    phone?: string;
}) {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
            data: {
                full_name: formData.full_name,
            },
        },
    });

    if (error) {
        return { error: error.message };
    }

    // Update profile with phone if provided
    if (data.user && formData.phone) {
        await supabase
            .from('profiles')
            .update({ phone: formData.phone, full_name: formData.full_name })
            .eq('id', data.user.id);
    }

    return { success: true };
}

export async function signUpAdmin(formData: {
    email: string;
    password: string;
    full_name: string;
    secret_key: string;
}) {
    // Validate secret key
    if (formData.secret_key !== process.env.ADMIN_SECRET_KEY) {
        return { error: 'Invalid secret key.' };
    }

    const supabase = await createClient();

    // Check if an admin already exists
    const { data: existingAdmin } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'admin')
        .limit(1)
        .single();

    if (existingAdmin) {
        return { error: 'An admin account already exists.' };
    }

    // Create the user
    const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
            data: { full_name: formData.full_name },
        },
    });

    if (error) return { error: error.message };

    // Set role to admin
    if (data.user) {
        await supabase
            .from('profiles')
            .update({ role: 'admin', full_name: formData.full_name })
            .eq('id', data.user.id);
    }

    return { success: true };
}

export async function signIn(formData: { email: string; password: string }) {
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
    });

    if (error) {
        return { error: error.message };
    }

    return { success: true };
}

export async function signInAdmin(formData: { email: string; password: string }) {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
    });

    if (error) {
        return { error: error.message };
    }

    // Check admin role
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

    if (!profile || profile.role !== 'admin') {
        await supabase.auth.signOut();
        return { error: 'Access denied. Admin privileges required.' };
    }

    return { success: true };
}

export async function signOut() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect('/');
}

export async function getSession() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    return { user, profile };
}

export async function requireAdmin() {
    const session = await getSession();
    if (!session || session.profile?.role !== 'admin') {
        redirect('/admin/login');
    }
    return session;
}

export async function updateProfile(formData: { full_name: string; phone?: string }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Not authenticated' };

    const { error } = await supabase
        .from('profiles')
        .update({
            full_name: formData.full_name,
            phone: formData.phone,
        })
        .eq('id', user.id);

    if (error) return { error: error.message };
    return { success: true };
}

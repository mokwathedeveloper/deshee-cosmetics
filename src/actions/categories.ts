'use server';

import { createClient } from '@/lib/supabase/server';
import type { Category } from '@/types/database';

export async function getCategories(): Promise<Category[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true });

    if (error) {
        console.error('Error fetching categories:', error);
        return [];
    }

    return data as Category[];
}

export async function getFeaturedCategories(): Promise<Category[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_featured', true)
        .order('sort_order', { ascending: true });

    if (error) {
        console.error('Error fetching featured categories:', error);
        return [];
    }

    return data as Category[];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error) {
        console.error('Error fetching category:', error);
        return null;
    }

    return data as Category;
}

export async function createCategory(categoryData: Partial<Category>) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('categories')
        .insert(categoryData)
        .select()
        .single();

    if (error) return { error: error.message };
    return { category: data };
}

export async function updateCategory(id: string, categoryData: Partial<Category>) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('categories')
        .update(categoryData)
        .eq('id', id)
        .select()
        .single();

    if (error) return { error: error.message };
    return { category: data };
}

export async function deleteCategory(id: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

    if (error) return { error: error.message };
    return { success: true };
}

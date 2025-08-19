import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Trash2, Plus, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Define types for categories
interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  created_at: string;
}

// Zod schema for form validation
const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  parent_id: z.string().nullable().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

export default function ManageCategories() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [mainCategories, setMainCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Initialize form
  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      parent_id: 'none', // Use 'none' as the default value
    },
  });

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;

      if (data) {
        setCategories(data);
        setMainCategories(data.filter(cat => cat.parent_id === null));
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to load categories: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const onSubmit = async (data: CategoryFormData) => {
    setIsSubmitting(true);
    try {
      const slug = generateSlug(data.name);

      const { data: existingCategory, error: checkError } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', slug)
        .single();

      if (checkError && checkError.code !== 'PGRST116') throw checkError;

      if (existingCategory) {
        toast({ title: "Error", description: "A category with a similar name already exists.", variant: "destructive" });
        return;
      }

      const { error } = await supabase
        .from('categories')
        .insert({
          name: data.name,
          slug,
          parent_id: data.parent_id === 'none' ? null : data.parent_id, // Convert 'none' back to null for DB
        });

      if (error) throw error;

      toast({ title: "Success", description: "Category created successfully." });
      form.reset();
      fetchCategories(); // Refetch categories to update the list
    } catch (error: any) {
      toast({ title: "Error", description: `Failed to create category: ${error.message}`, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    setDeletingId(id);
    try {
      const hasSubcategories = categories.some(cat => cat.parent_id === id);
      if (hasSubcategories) {
        toast({ title: "Cannot Delete", description: "Please delete all subcategories first.", variant: "destructive" });
        return;
      }

      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;

      toast({ title: "Success", description: "Category deleted successfully." });
      fetchCategories(); // Refetch to update the list
    } catch (error: any) {
      toast({ title: "Error", description: `Failed to delete category: ${error.message}`, variant: "destructive" });
    } finally {
      setDeletingId(null);
    }
  };

  const getCategoryChildren = (parentId: string): Category[] => {
    return categories.filter(cat => cat.parent_id === parentId);
  };
  
  // Guard against non-admin access
  if (isAdmin === false) {
    navigate('/');
    return null;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Manage Categories</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Create New Category</CardTitle>
            <CardDescription>Add a new main or sub-category to your store.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-24">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl><Input {...field} placeholder="e.g., Gaming Laptops" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="parent_id" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parent Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || 'none'}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="None (This will be a main category)" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {/* KEY FIX: Use a non-empty string for the "None" option value */}
                        <SelectItem value="none">None (Main Category)</SelectItem>
                        {mainCategories.map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                  {isSubmitting ? 'Creating...' : 'Create Category'}
                </Button>
              </form>
            </Form>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Existing Categories</CardTitle>
            <CardDescription>Manage your store's category hierarchy.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : categories.length === 0 ? (
              <Alert><AlertTitle>No categories found</AlertTitle><AlertDescription>Create your first category using the form.</AlertDescription></Alert>
            ) : (
              <div className="space-y-4">
                {mainCategories.map(mainCat => (
                  <div key={mainCat.id} className="border rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <h3 className="text-md font-semibold">{mainCat.name}</h3>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDeleteCategory(mainCat.id)} disabled={deletingId === mainCat.id}>
                        {deletingId === mainCat.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                      </Button>
                    </div>
                    <div className="pl-4 mt-2 space-y-1">
                      {getCategoryChildren(mainCat.id).map(subCat => (
                        <div key={subCat.id} className="flex justify-between items-center text-sm">
                          <span>- {subCat.name}</span>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleDeleteCategory(subCat.id)} disabled={deletingId === subCat.id}>
                            {deletingId === subCat.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                          </Button>
                        </div>
                      ))}
                      {getCategoryChildren(mainCat.id).length === 0 && (
                        <p className="text-sm text-muted-foreground py-1">- No subcategories</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
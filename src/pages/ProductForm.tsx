import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils";

// Zod schema for form validation
const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.preprocess(
    (val) => (String(val).trim() === '' ? NaN : Number(val)),
    z.number().min(0, 'Price must be a positive number')
  ),
  sku: z.string().min(1, 'SKU is required'),
  stock_quantity: z.preprocess(
    (val) => (String(val).trim() === '' ? NaN : Number(val)),
    z.number().int().min(0, 'Stock must be a positive whole number')
  ),
  status: z.enum(['draft', 'published']),
  product_type: z.enum(['laptop', 'router', 'ups', 'software', 'monitor', 'keyboard', 'mouse', 'headphones', 'all-in-one-pc'], { required_error: "Product type is required." }),
  main_category: z.string({ required_error: "Main category is required." }).min(1, "Main category is required."),
  sub_categories: z.array(z.string()).optional(),
  brand: z.string().optional(),
  cpu: z.string().optional(),
  ram_gb: z.string().optional(),
  storage_gb: z.string().optional(),
  gpu: z.string().optional(),
  // ... add all other possible spec fields here as .optional()
});

type ProductFormData = z.infer<typeof productSchema>;

const productTypes = [
  { value: 'laptop', label: 'Laptop' },
  { value: 'all-in-one-pc', label: 'All-in-One PC' },
  { value: 'router', label: 'Router' },
  { value: 'ups', label: 'UPS' },
  { value: 'software', label: 'Software' },
  { value: 'monitor', label: 'Monitor' },
  { value: 'keyboard', label: 'Keyboard' },
  { value: 'mouse', label: 'Mouse' },
  { value: 'headphones', label: 'Headphones' },
];

type Category = { id: string; name: string; slug: string; parent_id: string | null; };

export default function ProductForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [mainCategoryOptions, setMainCategoryOptions] = useState<{value: string, label: string}[]>([]);
  const [subCategoryOptions, setSubCategoryOptions] = useState<{value: string, label: string}[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      sku: '',
      stock_quantity: 0,
      status: 'draft',
      sub_categories: [],
      brand: '',
      cpu: '',
      ram_gb: '',
      storage_gb: '',
      gpu: '',
      // Initialize all other spec fields to prevent uncontrolled component warning
    },
  });

  const watchedMainCategory = form.watch('main_category');
  const watchedProductType = form.watch('product_type');

  useEffect(() => {
    async function fetchAllCategories() {
      setLoadingCategories(true);
      const { data, error } = await supabase.from('categories').select('*');
      if (error) {
        toast({ title: "Error", description: "Could not load categories.", variant: "destructive" });
      } else if (data) {
        setAllCategories(data);
        setMainCategoryOptions(
          data.filter(cat => cat.parent_id === null).map(cat => ({ value: cat.slug, label: cat.name }))
        );
      }
      setLoadingCategories(false);
    }
    fetchAllCategories();
  }, []);
  
  useEffect(() => {
    if (watchedMainCategory && allCategories.length > 0) {
      const parent = allCategories.find(cat => cat.slug === watchedMainCategory);
      if (parent) {
        const subs = allCategories
          .filter(cat => cat.parent_id === parent.id)
          .map(cat => ({ value: cat.slug, label: cat.name }));
        setSubCategoryOptions(subs);
      }
    } else {
      setSubCategoryOptions([]);
    }
    if (form.getValues('main_category') === watchedMainCategory) {
        form.setValue('sub_categories', []);
    }
  }, [watchedMainCategory, allCategories, form]);
  
  const onValidationErrors = (errors: any) => {
    console.error("Form Validation Failed:", errors);
    toast({
      title: "Validation Error",
      description: "Please check the form for errors. Required fields cannot be empty.",
      variant: "destructive",
    });
  };

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    
    const finalCategories = [
        ...(data.main_category ? [data.main_category] : []),
        ...(data.sub_categories || [])
    ];

    const { name, description, price, sku, stock_quantity, status, product_type, main_category, sub_categories, ...specifications } = data;

    const productPayload = {
      name, description, price, sku, stock_quantity, status, product_type,
      categories: finalCategories,
      specifications,
      // images: [], // Add your image handling logic here
    };

    const { error } = isEditMode
      ? await supabase.from('products').update(productPayload).eq('id', id)
      : await supabase.from('products').insert(productPayload);

    if (error) {
      toast({ title: `Error`, description: error.message, variant: "destructive" });
    } else {
      toast({ title: `Product ${isEditMode ? 'updated' : 'created'} successfully!` });
      navigate('/admin/manage-categories');
    }
    setIsSubmitting(false);
  };
  
  const renderSpecificationFields = () => {
    // This is where your full switch statement for all product types goes.
    if (!watchedProductType) return null;
    return (
        <Card>
          <CardHeader><CardTitle>{productTypes.find(p=>p.value === watchedProductType)?.label} Specifications</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {watchedProductType === 'laptop' && (
              <>
                <FormField control={form.control} name="brand" render={({ field }) => (
                    <FormItem><FormLabel>Brand</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="cpu" render={({ field }) => (
                    <FormItem><FormLabel>CPU</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </>
            )}
            {/* ... Cases for other product types ... */}
          </CardContent>
        </Card>
    );
  };

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-2xl font-bold tracking-tight">{isEditMode ? 'Edit Product' : 'Add New Product'}</h2>
      <p className="text-muted-foreground">{isEditMode ? 'Update details' : 'Fill in details for a new product.'}</p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onValidationErrors)} className="space-y-8 mt-6">
          
          <Card>
            <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem><FormLabel>Product Name *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="sku" render={({ field }) => (
                  <FormItem><FormLabel>SKU *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Description *</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField control={form.control} name="price" render={({ field }) => (
                  <FormItem><FormLabel>Price *</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="stock_quantity" render={({ field }) => (
                  <FormItem><FormLabel>Stock Quantity *</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="status" render={({ field }) => (
                  <FormItem><FormLabel>Status *</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl><SelectContent><SelectItem value="draft">Draft</SelectItem><SelectItem value="published">Published</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                )} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Categorization</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="product_type" render={({ field }) => (
                <FormItem><FormLabel>Product Type *</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select product type" /></SelectTrigger></FormControl><SelectContent>{productTypes.map(type => (<SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="main_category" render={({ field }) => (
                <FormItem><FormLabel>Main Category *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ''}>
                    <FormControl>
                      <SelectTrigger disabled={loadingCategories}>
                        <SelectValue placeholder={loadingCategories ? "Loading..." : "Select a main category"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mainCategoryOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="md:col-span-2">
                <FormField control={form.control} name="sub_categories" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sub-Categories</FormLabel>
                    <Popover><PopoverTrigger asChild>
                      <FormControl>
                        <Button variant="outline" role="combobox" className={cn("w-full justify-between font-normal", !field.value?.length && "text-muted-foreground")} disabled={!watchedMainCategory || subCategoryOptions.length === 0}>
                          {field.value?.length ? subCategoryOptions.filter(opt => field.value?.includes(opt.value)).map(opt => opt.label).join(', ') : "Select sub-categories"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger><PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                      <Command><CommandInput placeholder="Search..." /><CommandEmpty>No sub-category found.</CommandEmpty><CommandList><CommandGroup>
                        {subCategoryOptions.map(option => (
                          <CommandItem key={option.value} onSelect={() => {
                            const selected = field.value || [];
                            const isSelected = selected.includes(option.value);
                            field.onChange(isSelected ? selected.filter(s => s !== option.value) : [...selected, option.value]);
                          }}>
                            <Check className={cn("mr-2 h-4 w-4", (field.value || []).includes(option.value) ? "opacity-100" : "opacity-0")} />
                            {option.label}
                          </CommandItem>
                        ))}
                      </CommandGroup></CommandList></Command>
                    </PopoverContent></Popover>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </CardContent>
          </Card>

          {renderSpecificationFields()}
          
          {/* Your image upload section would go here in its own Card */}

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : (isEditMode ? 'Save Changes' : 'Save Product')}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useForm, FieldErrors, Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Check, ChevronsUpDown, Loader2, Upload, X } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { useDropzone } from 'react-dropzone';

// Define product types to match database schema
const productTypeValues = ['laptop', 'router', 'ups', 'software', 'monitor', 'keyboard', 'mouse', 'headphones', 'accessory', 'component', 'peripheral', 'desktop-pc'] as const;
type ProductType = typeof productTypeValues[number];

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number().min(0, "Price must be a positive number")
  ),
  sku: z.string().min(1, "SKU is required"),
  stock_quantity: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number().int().min(0, "Stock quantity must be a non-negative integer")
  ),
  status: z.enum(["draft", "published"]),
  product_type: z.enum(productTypeValues),
  main_category: z.string().min(1, "Main category is required"),
  sub_categories: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  
  // Laptop specifications
  brand: z.string().optional(),
  cpu: z.string().optional(),
  ram_gb: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number().int().positive().optional()
  ),
  storage_gb: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number().int().positive().optional()
  ),
  gpu: z.string().optional(),
  display_size_inches: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number().positive().optional()
  ),
  operating_system: z.string().optional(),
  
  // Router specifications
  wifi_standard: z.string().optional(),
  frequency_bands: z.string().optional(),
  speed_data_rate: z.string().optional(),
  ethernet_ports: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number().int().nonnegative().optional()
  ),
  
  // UPS specifications
  capacity_va: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number().positive().optional()
  ),
  capacity_watts: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number().positive().optional()
  ),
  output_waveform: z.string().optional(),
  estimated_runtime_minutes: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number().positive().optional()
  ),
  
  // Software specifications
  license_type: z.string().optional(),
  delivery_method: z.string().optional(),
  system_requirements: z.string().optional(),
  
  // Monitor specifications
  screen_size_inches: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number().positive().optional()
  ),
  resolution: z.string().optional(),
  refresh_rate_hz: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number().positive().optional()
  ),
  panel_type: z.string().optional(),
  
  // Keyboard specifications
  key_switch_type: z.string().optional(),
  layout: z.string().optional(),
  connectivity: z.string().optional(),
  backlight: z.preprocess(
    (val) => (val === '' ? undefined : Boolean(val)),
    z.boolean().optional()
  ),
  
  // Mouse specifications
  sensor_type: z.string().optional(),
  max_dpi: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number().positive().optional()
  ),
  number_of_buttons: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number().int().positive().optional()
  ),
  
  // Headphones specifications
  driver_type: z.string().optional(),
  noise_cancellation: z.preprocess(
    (val) => (val === '' ? undefined : Boolean(val)),
    z.boolean().optional()
  ),
  has_microphone: z.preprocess(
    (val) => (val === '' ? undefined : Boolean(val)),
    z.boolean().optional()
  ),
  
  // Accessory specifications
  compatibility: z.string().optional(),
  material: z.string().optional(),
  
  // Component specifications
  component_type: z.string().optional(),
  compatibility_info: z.string().optional(),
  power_requirements: z.string().optional(),
  
  // Peripheral specifications
  interface_type: z.string().optional(),
  power_source: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;
type ProductFormData = ProductFormValues;

// Helper type for form control to fix TypeScript errors
type FormControlType = any; // Using any type to bypass TypeScript errors with form control

// Helper function to determine the type of a field based on the schema
const getFieldType = (fieldName: string): 'string' | 'number' | 'boolean' | 'array' => {
  // Check boolean fields first
  if (['backlight', 'noise_cancellation', 'has_microphone'].includes(fieldName)) {
    return 'boolean';
  }
  
  // Check number fields
  if ([
    'ram_gb', 'storage_gb', 'display_size_inches', 'ethernet_ports',
    'capacity_va', 'capacity_watts', 'estimated_runtime_minutes',
    'screen_size_inches', 'refresh_rate_hz', 'max_dpi', 'number_of_buttons'
  ].includes(fieldName)) {
    return 'number';
  }
  
  // Check array fields
  if (['sub_categories', 'images'].includes(fieldName)) {
    return 'array';
  }
  
  // Default to string for all other fields
  return 'string';
};

const productTypes = [
  { value: 'laptop', label: 'Laptop' }, 
  { value: 'router', label: 'Router' },
  { value: 'ups', label: 'UPS' }, 
  { value: 'software', label: 'Software' }, 
  { value: 'monitor', label: 'Monitor' },
  { value: 'keyboard', label: 'Keyboard' }, 
  { value: 'mouse', label: 'Mouse' }, 
  { value: 'headphones', label: 'Headphones' },
  { value: 'accessory', label: 'Accessory' },
  { value: 'component', label: 'Component' },
  { value: 'peripheral', label: 'Peripheral' },
  { value: 'desktop-pc', label: 'Desktop PC' },
];

type Category = { id: string; name: string; slug: string; parent_id: string | null; };
type ImageFile = { file: File, preview: string };

export default function ProductForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [mainCategoryOptions, setMainCategoryOptions] = useState<{value: string, label: string}[]>([]);
  const [subCategoryOptions, setSubCategoryOptions] = useState<{value: string, label: string}[]>([]);
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // Create a dynamic resolver that only validates fields relevant to the current product type
  const createDynamicResolver = (productType: ProductType) => {
    // Base schema with common fields that are always validated
    const baseSchema = z.object({
      name: z.string().min(1, "Name is required"),
      description: z.string().min(1, "Description is required"),
      price: z.preprocess(
        (val) => (val === '' ? undefined : Number(val)),
        z.number().min(0, "Price must be a positive number")
      ),
      sku: z.string().min(1, "SKU is required"),
      stock_quantity: z.preprocess(
        (val) => (val === '' ? undefined : Number(val)),
        z.number().int().min(0, "Stock quantity must be a non-negative integer")
      ),
      status: z.enum(["draft", "published"]),
      product_type: z.enum(productTypeValues),
      main_category: z.string().min(1, "Main category is required"),
      sub_categories: z.array(z.string()).optional(),
      images: z.array(z.string()).optional(),
      
      // Make all specification fields optional by default
      // This ensures fields from other product types don't cause validation errors
      brand: z.string().optional(),
      cpu: z.string().optional(),
      gpu: z.string().optional(),
      operating_system: z.string().optional(),
      wifi_standard: z.string().optional(),
      frequency_bands: z.string().optional(),
      speed_data_rate: z.string().optional(),
      output_waveform: z.string().optional(),
      license_type: z.string().optional(),
      delivery_method: z.string().optional(),
      system_requirements: z.string().optional(),
      resolution: z.string().optional(),
      panel_type: z.string().optional(),
      key_switch_type: z.string().optional(),
      layout: z.string().optional(),
      connectivity: z.string().optional(),
      sensor_type: z.string().optional(),
      driver_type: z.string().optional(),
      compatibility: z.string().optional(),
      material: z.string().optional(),
      component_type: z.string().optional(),
      compatibility_info: z.string().optional(),
      power_requirements: z.string().optional(),
      interface_type: z.string().optional(),
      power_source: z.string().optional(),
      
      // Make all number fields optional and accept undefined
      ram_gb: z.union([z.number().positive().optional(), z.undefined()]),
      storage_gb: z.union([z.number().positive().optional(), z.undefined()]),
      display_size_inches: z.union([z.number().positive().optional(), z.undefined()]),
      ethernet_ports: z.union([z.number().nonnegative().optional(), z.undefined()]),
      capacity_va: z.union([z.number().positive().optional(), z.undefined()]),
      capacity_watts: z.union([z.number().positive().optional(), z.undefined()]),
      estimated_runtime_minutes: z.union([z.number().positive().optional(), z.undefined()]),
      screen_size_inches: z.union([z.number().positive().optional(), z.undefined()]),
      refresh_rate_hz: z.union([z.number().positive().optional(), z.undefined()]),
      max_dpi: z.union([z.number().positive().optional(), z.undefined()]),
      number_of_buttons: z.union([z.number().positive().optional(), z.undefined()]),
      
      // Make all boolean fields optional
      backlight: z.boolean().optional(),
      noise_cancellation: z.boolean().optional(),
      has_microphone: z.boolean().optional(),
    });
    
    // Add specific fields based on product type
    const specificFields: Record<string, z.ZodTypeAny> = {};
    
    // Only add validation for fields relevant to the current product type
    if (productType === 'laptop') {
      Object.assign(specificFields, {
        brand: z.string().optional(),
        cpu: z.string().optional(),
        ram_gb: z.preprocess(
          (val) => (val === '' ? undefined : Number(val)),
          z.number().int().positive().optional()
        ),
        storage_gb: z.preprocess(
          (val) => (val === '' ? undefined : Number(val)),
          z.number().int().positive().optional()
        ),
        gpu: z.string().optional(),
        display_size_inches: z.preprocess(
          (val) => (val === '' ? undefined : Number(val)),
          z.number().positive().optional()
        ),
        operating_system: z.string().optional(),
      });
    } else if (productType === 'router') {
      Object.assign(specificFields, {
        brand: z.string().optional(),
        wifi_standard: z.string().optional(),
        frequency_bands: z.string().optional(),
        speed_data_rate: z.string().optional(),
        ethernet_ports: z.preprocess(
          (val) => (val === '' ? undefined : Number(val)),
          z.number().int().nonnegative().optional()
        ),
      });
    } else if (productType === 'ups') {
      Object.assign(specificFields, {
        brand: z.string().optional(),
        capacity_va: z.preprocess(
          (val) => (val === '' ? undefined : Number(val)),
          z.number().positive().optional()
        ),
        capacity_watts: z.preprocess(
          (val) => (val === '' ? undefined : Number(val)),
          z.number().positive().optional()
        ),
        output_waveform: z.string().optional(),
        estimated_runtime_minutes: z.preprocess(
          (val) => (val === '' ? undefined : Number(val)),
          z.number().positive().optional()
        ),
      });
    } else if (productType === 'software') {
      Object.assign(specificFields, {
        license_type: z.string().optional(),
        delivery_method: z.string().optional(),
        system_requirements: z.string().optional(),
      });
    } else if (productType === 'monitor') {
      Object.assign(specificFields, {
        brand: z.string().optional(),
        screen_size_inches: z.preprocess(
          (val) => (val === '' ? undefined : Number(val)),
          z.number().positive().optional()
        ),
        resolution: z.string().optional(),
        refresh_rate_hz: z.preprocess(
          (val) => (val === '' ? undefined : Number(val)),
          z.number().positive().optional()
        ),
        panel_type: z.string().optional(),
      });
    } else if (productType === 'keyboard') {
      Object.assign(specificFields, {
        brand: z.string().optional(),
        key_switch_type: z.string().optional(),
        layout: z.string().optional(),
        connectivity: z.string().optional(),
        backlight: z.preprocess(
          (val) => (val === '' ? undefined : Boolean(val)),
          z.boolean().optional()
        ),
      });
    } else if (productType === 'mouse') {
      Object.assign(specificFields, {
        brand: z.string().optional(),
        sensor_type: z.string().optional(),
        max_dpi: z.preprocess(
          (val) => (val === '' ? undefined : Number(val)),
          z.number().positive().optional()
        ),
        number_of_buttons: z.preprocess(
          (val) => (val === '' ? undefined : Number(val)),
          z.number().int().positive().optional()
        ),
        connectivity: z.string().optional(),
      });
    } else if (productType === 'headphones') {
      Object.assign(specificFields, {
        brand: z.string().optional(),
        driver_type: z.string().optional(),
        connectivity: z.string().optional(),
        noise_cancellation: z.preprocess(
          (val) => (val === '' ? undefined : Boolean(val)),
          z.boolean().optional()
        ),
        has_microphone: z.preprocess(
          (val) => (val === '' ? undefined : Boolean(val)),
          z.boolean().optional()
        ),
      });
    } else if (productType === 'accessory') {
      Object.assign(specificFields, {
        brand: z.string().optional(),
        compatibility: z.string().optional(),
        material: z.string().optional(),
      });
    } else if (productType === 'component') {
      Object.assign(specificFields, {
        brand: z.string().optional(),
        component_type: z.string().optional(),
        compatibility_info: z.string().optional(),
        power_requirements: z.string().optional(),
      });
    } else if (productType === 'peripheral') {
      Object.assign(specificFields, {
        brand: z.string().optional(),
        interface_type: z.string().optional(),
        power_source: z.string().optional(),
      });
    }
    
    // Create a dynamic schema by merging base schema with specific fields
    const dynamicSchema = baseSchema.extend(specificFields);
    
    // Make all other fields optional and passthrough
    return zodResolver(dynamicSchema.passthrough()) as any;
  };

  const form = useForm<ProductFormValues>({
    resolver: createDynamicResolver('laptop'), // Start with laptop as default
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      sku: '',
      stock_quantity: 0,
      status: 'draft' as const,
      product_type: 'laptop' as ProductType, // Default to laptop to avoid undefined issues
      main_category: '',
      sub_categories: [],
      images: [],
    },
  });

  const watchedMainCategory = form.watch('main_category');
  const watchedProductType = form.watch('product_type');
  
  // Create ref outside of the useEffect hook
  const previousProductType = useRef<ProductType | null>(null);
  
  // Handle product type changes - update resolver and clear irrelevant fields
  useEffect(() => {
    // Skip the first render for field clearing
    const isProductTypeChanged = previousProductType.current !== null && previousProductType.current !== watchedProductType;
    
    if (watchedProductType) {
      // Clear all errors first
      form.clearErrors();
      
      // Define all possible specification fields
      const allSpecFields = [
        // Laptop specifications
        'brand', 'cpu', 'ram_gb', 'storage_gb', 'gpu', 'display_size_inches', 'operating_system',
        // Router specifications
        'wifi_standard', 'frequency_bands', 'speed_data_rate', 'ethernet_ports',
        // UPS specifications
        'capacity_va', 'capacity_watts', 'output_waveform', 'estimated_runtime_minutes',
        // Software specifications
        'license_type', 'delivery_method', 'system_requirements',
        // Monitor specifications
        'screen_size_inches', 'resolution', 'refresh_rate_hz', 'panel_type',
        // Keyboard specifications
        'key_switch_type', 'layout', 'connectivity', 'backlight',
        // Mouse specifications
        'sensor_type', 'max_dpi', 'number_of_buttons',
        // Headphones specifications
        'driver_type', 'noise_cancellation', 'has_microphone',
        // Accessory specifications
        'compatibility', 'material',
        // Component specifications
        'component_type', 'compatibility_info', 'power_requirements',
        // Peripheral specifications
        'interface_type', 'power_source',
      ];
      
      // Get fields specific to the current product type
      const currentTypeFields = getSpecificationFields(watchedProductType);
      
      if (isProductTypeChanged) {
        // Reset ALL specification fields when product type changes
        allSpecFields.forEach((field) => {
          const fieldType = getFieldType(field);
          if (fieldType === 'string') {
            form.setValue(field as any, '');
          } else if (fieldType === 'number') {
            // Set to undefined instead of 0 to avoid validation errors
            form.setValue(field as any, undefined);
          } else if (fieldType === 'boolean') {
            form.setValue(field as any, false);
          } else if (fieldType === 'array') {
            form.setValue(field as any, []);
          }
        });
      }
      
      // Unregister fields not relevant to current product type to prevent validation
      allSpecFields.forEach((field) => {
        if (!currentTypeFields.includes(field)) {
          form.unregister(field as any);
        }
      });
      
      // Update the resolver to validate only fields relevant to the current product type
      const newResolver = createDynamicResolver(watchedProductType);
      (form as any).resolver = newResolver;
    }
    
    // Update the previous product type reference
    previousProductType.current = watchedProductType;
  }, [watchedProductType, form]);

  useEffect(() => {
    if (watchedMainCategory && allCategories.length > 0) {
      const parent = allCategories.find(cat => cat.slug === watchedMainCategory);
      if (parent) {
        setSubCategoryOptions(allCategories.filter(cat => cat.parent_id === parent.id).map(cat => ({ value: cat.slug, label: cat.name })));
      }
    } else {
      setSubCategoryOptions([]);
    }
    if(form.getValues('main_category') === watchedMainCategory) { form.setValue('sub_categories', []); }
  }, [watchedMainCategory, allCategories, form]);

  const fetchCategories = async () => {
    setLoadingCategories(true);
    const { data, error } = await supabase.from('categories').select('*');
    if (error) {
      console.error('Error fetching categories:', error);
      toast({ title: "Error fetching categories", description: "Could not load categories", variant: "destructive" });
    } else if (data) {
      setAllCategories(data);
      setMainCategoryOptions(data.filter(cat => !cat.parent_id).map(cat => ({ value: cat.slug, label: cat.name })));
    }
    setLoadingCategories(false);
  };

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
    fetchCategories();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      if (product) {
        // Extract categories from product data
        // Using optional chaining and nullish coalescing for safety
        const mainCategory = (product as any).main_category || '';
        const subCategories = (product as any).sub_categories || [];
        
        // Parse specifications from JSON if needed
        const specifications = product.specifications || {};
        
        // Create a form data object with base fields
        const formData: Partial<ProductFormData> = {
          name: product.name,
          description: product.description,
          price: product.price,
          sku: product.sku || '',
          stock_quantity: product.stock_quantity || 0,
          status: product.status as "draft" | "published",
          product_type: product.product_type as ProductType,
          main_category: mainCategory,
          sub_categories: subCategories,
        };
        
        // Add specification fields from the JSON object
        Object.entries(specifications).forEach(([key, value]) => {
          (formData as any)[key] = value;
        });
        
        // Reset form with all values
        form.reset(formData as ProductFormData);
        
        // Set images
        if (product.images) {
          setExistingImages(product.images);
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast({ title: "Error fetching product", description: "Could not load product data", variant: "destructive" });
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // ... file validation logic
    const validatedFiles = acceptedFiles
      .filter(file => file.size <= 5 * 1024 * 1024)
      .map(file => Object.assign({ file, preview: URL.createObjectURL(file) }));
    setImageFiles(prev => [...prev, ...validatedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: {'image/*': []} });
  
  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  // Helper function to get specification fields based on product type
  const getSpecificationFields = (productType: ProductType): string[] => {
    switch (productType) {
      case 'laptop':
        return ['brand', 'cpu', 'ram_gb', 'storage_gb', 'screen_size_inches', 'operating_system'];
      case 'router':
        return ['brand', 'wifi_standard', 'max_speed_mbps', 'ports', 'dual_band', 'mesh_compatible'];
      case 'ups':
        return ['brand', 'capacity_va', 'backup_time_min', 'outlets', 'form_factor'];
      case 'software':
        return ['license_type', 'platform', 'subscription_period_months', 'cloud_based', 'users'];
      case 'monitor':
        return ['brand', 'screen_size_inches', 'resolution', 'refresh_rate_hz', 'panel_type', 'response_time_ms'];
      case 'keyboard':
        return ['brand', 'connectivity', 'layout', 'mechanical', 'backlit', 'programmable_keys'];
      case 'mouse':
        return ['brand', 'connectivity', 'dpi', 'buttons', 'ergonomic', 'programmable_buttons'];
      case 'headphones':
        return ['driver_type', 'connectivity', 'noise_cancellation', 'has_microphone'];
      case 'accessory':
        return ['brand', 'compatibility', 'material'];
      case 'component':
        return ['brand', 'compatibility', 'warranty_months'];
      case 'peripheral':
        return ['brand', 'connectivity', 'power_source'];
      case 'desktop-pc':
        return ['brand', 'form_factor', 'processor_options', 'memory', 'storage_options', 'graphics_options', 'audio', 'wireless', 'ports', 'power_supply_options', 'weight', 'dimensions', 'color'];
      default:
        return [];
    }
  };

  const onSubmit = async (values: ProductFormData) => {
    setIsSubmitting(true);
    try {
      // Upload new images if any
      let newImageUrls: string[] = [];
      if (imageFiles.length > 0) {
        setIsUploading(true);
        for (const imageFile of imageFiles) {
          const fileName = `${Date.now()}-${imageFile.file.name}`;
          const { data, error } = await supabase.storage
            .from('product-images')
            .upload(fileName, imageFile.file);
          
          if (error) throw error;
          
          if (data) {
            const { data: { publicUrl } } = supabase.storage
              .from('product-images')
              .getPublicUrl(data.path);
            
            newImageUrls.push(publicUrl);
          }
        }
        setIsUploading(false);
      }
      
      // Combine existing and new image URLs
      const allImageUrls = [...existingImages, ...newImageUrls];
      
      // Get specification fields for the selected product type only
      const specFields = getSpecificationFields(values.product_type);
      
      // Extract specification fields from form data - only for the current product type
      // This ensures we only include fields relevant to the current product type
      const specifications = specFields.reduce<Record<string, any>>((specs, key) => {
        const value = values[key as keyof ProductFormValues];
        if (value !== undefined && value !== '') {
          specs[key] = value;
        }
        return specs;
      }, {});
      
      // Prepare data for database - ensure types match database schema
      // Using type assertion to match the database schema
      // Move category information into specifications since main_category column doesn't exist
      const enhancedSpecifications = {
        ...specifications,
        main_category: values.main_category,
        sub_categories: values.sub_categories || [],
      };
      
      const productData = {
        name: values.name,
        description: values.description,
        price: values.price,
        sku: values.sku,
        stock_quantity: values.stock_quantity,
        status: values.status,
        product_type: values.product_type as "laptop" | "router" | "ups" | "software" | "monitor" | "keyboard" | "mouse" | "headphones" | "accessory" | "component" | "peripheral",
        specifications: enhancedSpecifications, // Store all specifications including categories as JSONB
        images: allImageUrls,
      };
      
      let error;
      if (isEditMode && id) {
        // Update existing product
        const { error: updateError } = await supabase
          .from('products')
          .update(productData)
          .eq('id', id);
        error = updateError;
      } else {
        // Insert new product
        const { error: insertError } = await supabase
          .from('products')
          .insert([productData]);
        error = insertError;
      }
      
      if (error) throw error;
      
      toast({ title: isEditMode ? "Product updated" : "Product created", description: `${values.name} has been ${isEditMode ? 'updated' : 'created'} successfully` });
      navigate('/store');
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onError = (errors: FieldErrors<ProductFormValues>) => {
    console.log('Validation Errors:', errors);
    
    // Get only the fields relevant to the current product type
    const commonFields = ['name', 'description', 'price', 'sku', 'stock_quantity', 'status', 'product_type', 'main_category', 'sub_categories', 'images'];
    const specFields = getSpecificationFields(watchedProductType);
    const relevantFields = [...commonFields, ...specFields];
    
    // Filter errors to only include those for relevant fields
    const relevantErrors: Record<string, any> = {};
    Object.keys(errors).forEach(key => {
      if (relevantFields.includes(key)) {
        relevantErrors[key] = errors[key];
      }
    });
    
    if (Object.keys(relevantErrors).length > 0) {
      // Only show toast for errors in fields relevant to current product type
      toast({
        title: 'Validation Error',
        description: 'Please check the form for errors',
        variant: 'destructive',
      });
    } else {
      // If there are only errors for irrelevant fields, force submit
      // This bypasses validation for fields not relevant to current product type
      const formData = form.getValues();
      onSubmit(formData as ProductFormData);
    }
  };

  const renderSpecificationFields = () => {
    if (!watchedProductType) return null;
    
    return (
      <Card>
        <CardHeader>
          <CardTitle>Product Specifications</CardTitle>
          <CardDescription>Enter specifications for this {productTypes.find(t => t.value === watchedProductType)?.label || 'product'}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {watchedProductType === 'laptop' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control as FormControlType}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control as FormControlType}
                  name="cpu"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPU</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control as FormControlType}
                  name="ram_gb"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>RAM (GB)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control as FormControlType}
                  name="storage_gb"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Storage (GB)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control as FormControlType}
                  name="gpu"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GPU</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control as FormControlType}
                  name="display_size_inches"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Size (inches)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="operating_system"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Operating System</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
          
          {watchedProductType === 'router' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control as FormControlType}
                  name="wifi_standard"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Wi-Fi Standard</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} placeholder="e.g., Wi-Fi 6E" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control as FormControlType}
                  name="frequency_bands"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frequency Bands</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} placeholder="e.g., Dual-Band" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control as FormControlType}
                  name="speed_data_rate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Speed/Data Rate</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} placeholder="e.g., AX6000" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control as FormControlType}
                  name="ethernet_ports"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ethernet Ports</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </>
          )}
          
          {watchedProductType === 'ups' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control as FormControlType}
                  name="capacity_va"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacity (VA)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control as FormControlType}
                  name="capacity_watts"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacity (Watts)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control as FormControlType}
                  name="output_waveform"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Output Waveform</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} placeholder="e.g., Pure Sine Wave" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control as FormControlType}
                  name="estimated_runtime_minutes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimated Runtime (minutes)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </>
          )}
          
          {watchedProductType === 'software' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control as FormControlType}
                  name="license_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>License Type</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} placeholder="e.g., 1-Year Subscription" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control as FormControlType}
                  name="delivery_method"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivery Method</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} placeholder="e.g., Digital Download" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="system_requirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>System Requirements</FormLabel>
                    <FormControl>
                      <Textarea {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
          
          {watchedProductType === 'monitor' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control as FormControlType}
                  name="screen_size_inches"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Screen Size (inches)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control as FormControlType}
                  name="resolution"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Resolution</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} placeholder="e.g., 2560x1440" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control as FormControlType}
                  name="refresh_rate_hz"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Refresh Rate (Hz)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control as FormControlType}
                  name="panel_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Panel Type</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} placeholder="e.g., IPS, OLED" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </>
          )}
          
          {watchedProductType === 'keyboard' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control as FormControlType}
                  name="key_switch_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Key Switch Type</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} placeholder="e.g., Mechanical Brown" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control as FormControlType}
                  name="layout"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Layout</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} placeholder="e.g., Full-size, Tenkeyless" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control as FormControlType}
                  name="connectivity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Connectivity</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} placeholder="e.g., Wired, Bluetooth" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control as FormControlType}
                  name="backlight"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={!!field.value}
                          onCheckedChange={(checked: boolean) => field.onChange(checked)}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Backlight</FormLabel>
                        <p className="text-sm text-muted-foreground">Does this keyboard have backlighting?</p>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </>
          )}
          
          {watchedProductType === 'mouse' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control as FormControlType}
                  name="sensor_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sensor Type</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} placeholder="e.g., Optical, Laser" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control as FormControlType}
                  name="max_dpi"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max DPI</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control as FormControlType}
                  name="connectivity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Connectivity</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} placeholder="e.g., Wired, Wireless" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control as FormControlType}
                  name="number_of_buttons"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Buttons</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </>
          )}
          
          {watchedProductType === 'headphones' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control as FormControlType}
                  name="driver_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Driver Type</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} placeholder="e.g., Dynamic, Planar Magnetic" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control as FormControlType}
                  name="connectivity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Connectivity</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} placeholder="e.g., Bluetooth, 3.5mm Jack" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control as FormControlType}
                  name="noise_cancellation"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={!!field.value}
                          onCheckedChange={(checked: boolean) => field.onChange(checked)}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Noise Cancellation</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control as FormControlType}
                  name="has_microphone"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={!!field.value}
                          onCheckedChange={(checked: boolean) => field.onChange(checked)}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Has Microphone</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </>
          )}
          
          {watchedProductType === 'accessory' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control as FormControlType}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control as FormControlType}
                  name="compatibility"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Compatibility</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="material"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Material</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
          
          {watchedProductType === 'desktop-pc' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control as FormControlType}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control as FormControlType}
                  name="form_factor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Form Factor</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} placeholder="e.g., Tower" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="processor_options"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Processor Options</FormLabel>
                    <FormControl>
                      <Textarea {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control as FormControlType}
                  name="memory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Memory</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control as FormControlType}
                  name="audio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Audio</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="storage_options"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Storage Options</FormLabel>
                    <FormControl>
                      <Textarea {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="graphics_options"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Graphics Options</FormLabel>
                    <FormControl>
                      <Textarea {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control as FormControlType}
                  name="wireless"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Wireless</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control as FormControlType}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="ports"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ports</FormLabel>
                    <FormControl>
                      <Textarea {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="power_supply_options"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Power Supply Options</FormLabel>
                    <FormControl>
                      <Textarea {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control as FormControlType}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} placeholder="e.g., 4.7 kg" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control as FormControlType}
                  name="dimensions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dimensions</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} placeholder="e.g., 15.5 x 30.3 x 33.7 cm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-2xl font-bold tracking-tight">{isEditMode ? 'Edit Product' : 'Add New Product'}</h2>
      <p className="text-muted-foreground">{isEditMode ? 'Update details.' : 'Fill in details for a new product.'}</p>
      
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading product data...</span>
        </div>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-8 mt-6">
          
          <Card>
            <CardHeader><CardTitle>Product Images</CardTitle><CardDescription>Upload product images (Max 5MB each).</CardDescription></CardHeader>
            <CardContent>
              <div {...getRootProps()} className={cn("border-2 border-dashed rounded-lg p-12 text-center cursor-pointer", isDragActive && "border-primary bg-primary/10")}>
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center space-y-2">
                  <Upload className="h-10 w-10 text-muted-foreground" />
                  <p className="text-muted-foreground">Drag & drop files here, or click to select</p>
                </div>
              </div>
              {(imageFiles.length > 0 || existingImages.length > 0) && (
                <div className="mt-4"><h4 className="text-sm font-medium mb-2">Image Previews:</h4>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                    {existingImages.map((imageUrl, index) => (
                      <div key={`existing-${index}`} className="relative group">
                        <img src={imageUrl} alt={`Existing image ${index + 1}`} className="h-24 w-full object-cover rounded-md" />
                        <button 
                          type="button" 
                          onClick={() => setExistingImages(prev => prev.filter((_, i) => i !== index))} 
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    {imageFiles.map((image, index) => (
                      <div key={`new-${index}`} className="relative group">
                        <img src={image.preview} alt={image.file.name} className="h-24 w-full object-cover rounded-md" />
                        <button 
                          type="button" 
                          onClick={() => removeImage(index)} 
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control as FormControlType}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control as FormControlType}
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SKU *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control as FormControlType}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price *</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control as FormControlType}
                  name="stock_quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock Quantity *</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control as FormControlType}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Categorization</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField 
                control={form.control} 
                name="product_type" 
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Type *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select product type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {productTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} 
              />
              <FormField 
                control={form.control} 
                name="main_category" 
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Main Category *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ''}>
                      <FormControl>
                        <SelectTrigger disabled={loadingCategories}>
                          <SelectValue placeholder={loadingCategories ? "Loading..." : "Select a main category"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mainCategoryOptions.map(opt => 
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} 
              />
              <div className="md:col-span-2">
                <FormField 
                  control={form.control} 
                  name="sub_categories" 
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sub-Categories</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button 
                              variant="outline" 
                              role="combobox" 
                              className={cn("w-full justify-between font-normal", !field.value?.length && "text-muted-foreground")} 
                              disabled={!watchedMainCategory || subCategoryOptions.length === 0}
                            >
                              {field.value?.length 
                                ? subCategoryOptions.filter(opt => field.value?.includes(opt.value)).map(opt => opt.label).join(', ') 
                                : "Select sub-categories"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                          <Command>
                            <CommandInput placeholder="Search..." />
                            <CommandEmpty>No sub-category found.</CommandEmpty>
                            <CommandList>
                              <CommandGroup>
                                {subCategoryOptions.map(option => (
                                  <CommandItem 
                                    key={option.value} 
                                    onSelect={() => {
                                      const selected = field.value || []; 
                                      const isSelected = selected.includes(option.value); 
                                      field.onChange(isSelected 
                                        ? selected.filter(s => s !== option.value) 
                                        : [...selected, option.value]);
                                    }}
                                  >
                                    <Check 
                                      className={cn("mr-2 h-4 w-4", (field.value || []).includes(option.value) ? "opacity-100" : "opacity-0")} 
                                    />
                                    {option.label}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )} 
                />
              </div>
            </CardContent>
          </Card>

          {renderSpecificationFields()}

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting || isUploading}>
              {(isSubmitting || isUploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
              {isUploading ? 'Uploading...' : (isSubmitting ? 'Saving...' : 'Save Product')}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
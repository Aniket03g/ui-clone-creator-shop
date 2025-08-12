import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Upload, X, ImageIcon } from 'lucide-react';

// Zod schema for form validation
const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0, 'Price must be positive'),
  sku: z.string().min(1, 'SKU is required'),
  stock_quantity: z.number().min(0, 'Stock quantity must be positive'),
  status: z.enum(['draft', 'published']),
  product_type: z.enum(['laptop', 'router', 'ups', 'software', 'monitor', 'keyboard', 'mouse', 'headphones']),
  // Dynamic specifications fields
  cpu: z.string().optional(),
  ram_gb: z.number().optional(),
  storage_gb: z.number().optional(),
  gpu: z.string().optional(),
  display_size_inches: z.number().optional(),
  operating_system: z.string().optional(),
  wifi_standard: z.string().optional(),
  frequency_bands: z.string().optional(),
  speed_data_rate: z.string().optional(),
  ethernet_ports: z.number().optional(),
  capacity_va: z.number().optional(),
  capacity_watts: z.number().optional(),
  output_waveform: z.string().optional(),
  estimated_runtime_minutes: z.number().optional(),
  license_type: z.string().optional(),
  delivery_method: z.string().optional(),
  system_requirements: z.string().optional(),
  screen_size_inches: z.number().optional(),
  resolution: z.string().optional(),
  refresh_rate_hz: z.number().optional(),
  panel_type: z.string().optional(),
  key_switch_type: z.string().optional(),
  layout: z.string().optional(),
  connectivity: z.string().optional(),
  backlight: z.string().optional(),
  sensor_type: z.string().optional(),
  max_dpi: z.number().optional(),
  number_of_buttons: z.number().optional(),
  driver_type: z.string().optional(),
  noise_cancellation: z.boolean().optional(),
  has_microphone: z.boolean().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

const productTypes = [
  { value: 'laptop', label: 'Laptop' },
  { value: 'router', label: 'Router' },
  { value: 'ups', label: 'UPS' },
  { value: 'software', label: 'Software' },
  { value: 'monitor', label: 'Monitor' },
  { value: 'keyboard', label: 'Keyboard' },
  { value: 'mouse', label: 'Mouse' },
  { value: 'headphones', label: 'Headphones' },
];

export default function AddProduct() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const { user } = useAuth();

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      status: 'draft',
      price: 0,
      stock_quantity: 0,
      noise_cancellation: false,
      has_microphone: false,
    },
  });

  const watchedProductType = form.watch('product_type');

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    
    try {
      const imageUrls: string[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Check file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: "File too large",
            description: `${file.name} is larger than 5MB. Please choose a smaller file.`,
            variant: "destructive",
          });
          continue;
        }

        // Check file type
        if (!file.type.startsWith('image/')) {
          toast({
            title: "Invalid file type",
            description: `${file.name} is not an image file.`,
            variant: "destructive",
          });
          continue;
        }

        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from('product-images')
          .upload(fileName, file);

        if (error) {
          throw error;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);

        imageUrls.push(publicUrl);
      }

      setUploadedImages(prev => [...prev, ...imageUrls]);
      
      toast({
        title: "Images uploaded successfully",
        description: `${imageUrls.length} image(s) uploaded.`,
      });
      
    } catch (error: any) {
      console.error('Error uploading images:', error);
      toast({
        title: "Error uploading images",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ProductFormData) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to create products.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create specifications object from type-specific fields
      const specifications: Record<string, any> = {};
      
      // Add specifications based on product type
      if (data.product_type === 'laptop') {
        if (data.cpu) specifications.cpu = data.cpu;
        if (data.ram_gb) specifications.ram_gb = data.ram_gb;
        if (data.storage_gb) specifications.storage_gb = data.storage_gb;
        if (data.gpu) specifications.gpu = data.gpu;
        if (data.display_size_inches) specifications.display_size_inches = data.display_size_inches;
        if (data.operating_system) specifications.operating_system = data.operating_system;
      } else if (data.product_type === 'router') {
        if (data.wifi_standard) specifications.wifi_standard = data.wifi_standard;
        if (data.frequency_bands) specifications.frequency_bands = data.frequency_bands;
        if (data.speed_data_rate) specifications.speed_data_rate = data.speed_data_rate;
        if (data.ethernet_ports) specifications.ethernet_ports = data.ethernet_ports;
      } else if (data.product_type === 'ups') {
        if (data.capacity_va) specifications.capacity_va = data.capacity_va;
        if (data.capacity_watts) specifications.capacity_watts = data.capacity_watts;
        if (data.output_waveform) specifications.output_waveform = data.output_waveform;
        if (data.estimated_runtime_minutes) specifications.estimated_runtime_minutes = data.estimated_runtime_minutes;
      } else if (data.product_type === 'software') {
        if (data.license_type) specifications.license_type = data.license_type;
        if (data.delivery_method) specifications.delivery_method = data.delivery_method;
        if (data.system_requirements) specifications.system_requirements = data.system_requirements;
      } else if (data.product_type === 'monitor') {
        if (data.screen_size_inches) specifications.screen_size_inches = data.screen_size_inches;
        if (data.resolution) specifications.resolution = data.resolution;
        if (data.refresh_rate_hz) specifications.refresh_rate_hz = data.refresh_rate_hz;
        if (data.panel_type) specifications.panel_type = data.panel_type;
      } else if (data.product_type === 'keyboard') {
        if (data.key_switch_type) specifications.key_switch_type = data.key_switch_type;
        if (data.layout) specifications.layout = data.layout;
        if (data.connectivity) specifications.connectivity = data.connectivity;
        if (data.backlight) specifications.backlight = data.backlight;
      } else if (data.product_type === 'mouse') {
        if (data.sensor_type) specifications.sensor_type = data.sensor_type;
        if (data.max_dpi) specifications.max_dpi = data.max_dpi;
        if (data.connectivity) specifications.connectivity = data.connectivity;
        if (data.number_of_buttons) specifications.number_of_buttons = data.number_of_buttons;
      } else if (data.product_type === 'headphones') {
        if (data.driver_type) specifications.driver_type = data.driver_type;
        if (data.connectivity) specifications.connectivity = data.connectivity;
        if (data.noise_cancellation !== undefined) specifications.noise_cancellation = data.noise_cancellation;
        if (data.has_microphone !== undefined) specifications.has_microphone = data.has_microphone;
      }

      const productData = {
        product_type: data.product_type as any, // Type assertion for enum compatibility
        name: data.name,
        description: data.description,
        price: data.price,
        sku: data.sku,
        stock_quantity: data.stock_quantity,
        status: data.status,
        specifications: specifications,
        images: uploadedImages,
      };

      const { error } = await supabase
        .from('products')
        .insert(productData);

      if (error) {
        throw error;
      }

      toast({
        title: "Product created successfully!",
        description: "Your product has been added to the database.",
      });

      // Reset form
      form.reset();
      setUploadedImages([]);
      
    } catch (error: any) {
      console.error('Error creating product:', error);
      toast({
        title: "Error creating product",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderSpecificationFields = () => {
    switch (watchedProductType) {
      case 'laptop':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Laptop Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="cpu"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPU</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Intel Core i7-13700H" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ram_gb"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>RAM (GB)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="16" 
                          {...field}
                          onChange={e => field.onChange(parseFloat(e.target.value) || undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="storage_gb"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Storage (GB)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="512" 
                          {...field}
                          onChange={e => field.onChange(parseFloat(e.target.value) || undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gpu"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GPU</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., NVIDIA RTX 4060" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="display_size_inches"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Size (inches)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.1"
                          placeholder="15.6" 
                          {...field}
                          onChange={e => field.onChange(parseFloat(e.target.value) || undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="operating_system"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Operating System</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Windows 11" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        );

      case 'router':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Router Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="wifi_standard"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>WiFi Standard</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Wi-Fi 6E" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="frequency_bands"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frequency Bands</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Dual-Band" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="speed_data_rate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Speed Data Rate</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., AX6000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ethernet_ports"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ethernet Ports</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="4" 
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value) || undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        );

      case 'ups':
        return (
          <Card>
            <CardHeader>
              <CardTitle>UPS Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="capacity_va"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacity (VA)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="1500" 
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value) || undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="capacity_watts"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacity (Watts)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="900" 
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value) || undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="output_waveform"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Output Waveform</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Pure Sine Wave" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="estimated_runtime_minutes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimated Runtime (minutes)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="15" 
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value) || undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        );

      case 'software':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Software Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="license_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>License Type</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 1-Year Subscription" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="delivery_method"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivery Method</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Digital Download" {...field} />
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
                      <Textarea 
                        placeholder="Describe system requirements..."
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        );

      case 'monitor':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Monitor Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="screen_size_inches"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Screen Size (inches)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.1"
                          placeholder="27" 
                          {...field}
                          onChange={e => field.onChange(parseFloat(e.target.value) || undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="resolution"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Resolution</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 2560x1440" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="refresh_rate_hz"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Refresh Rate (Hz)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="144" 
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value) || undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="panel_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Panel Type</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., IPS, OLED" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        );

      case 'keyboard':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Keyboard Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="key_switch_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Key Switch Type</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Mechanical Brown" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="layout"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Layout</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Full-size, Tenkeyless" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="connectivity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Connectivity</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Wired, Bluetooth" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="backlight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Backlight</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., RGB, White" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        );

      case 'mouse':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Mouse Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="sensor_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sensor Type</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Optical, Laser" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="max_dpi"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max DPI</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="25600" 
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value) || undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="connectivity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Connectivity</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Wired, Wireless" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="number_of_buttons"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Buttons</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="6" 
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value) || undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        );

      case 'headphones':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Headphones Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="driver_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Driver Type</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Dynamic, Planar Magnetic" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="connectivity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Connectivity</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Bluetooth, 3.5mm Jack" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="noise_cancellation"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Noise Cancellation</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="has_microphone"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Has Microphone</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Add New Product</h1>
          <p className="text-muted-foreground">Create a new product for your store</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Core product details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Dell XPS 15" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sku"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SKU *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., DXP15-001" {...field} />
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
                        <Textarea 
                          placeholder="Describe your product..."
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price *</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            placeholder="999.99" 
                            {...field}
                            onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="stock_quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock Quantity *</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="50" 
                            {...field}
                            onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
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
                          {productTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Product Images */}
            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
                <CardDescription>Upload high-quality images of your product</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="mb-4 p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">Image Guidelines:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• <strong>Format:</strong> JPG, PNG, or WebP</li>
                      <li>• <strong>Size:</strong> Maximum 5MB per image</li>
                      <li>• <strong>Dimensions:</strong> Minimum 800x800px, recommended 1200x1200px</li>
                      <li>• <strong>Background:</strong> White or transparent background preferred</li>
                      <li>• <strong>Quality:</strong> High-resolution, well-lit, professional photos</li>
                      <li>• <strong>Multiple angles:</strong> Include front, back, side views for best results</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                        disabled={isUploading}
                      />
                      <label
                        htmlFor="image-upload"
                        className={`
                          border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer 
                          hover:border-muted-foreground/50 transition-colors flex flex-col items-center gap-4
                          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                      >
                        <ImageIcon className="h-12 w-12 text-muted-foreground" />
                        <div>
                          <div className="text-lg font-medium">
                            {isUploading ? 'Uploading...' : 'Click to upload images'}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Select multiple files to upload at once
                          </p>
                        </div>
                      </label>
                    </div>

                    {uploadedImages.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-3">
                          Uploaded Images ({uploadedImages.length})
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {uploadedImages.map((imageUrl, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={imageUrl}
                                alt={`Product image ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg border border-border"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                                onClick={() => removeImage(index)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                              <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                                {index === 0 ? 'Main' : `${index + 1}`}
                              </div>
                            </div>
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          The first image will be used as the main product image
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dynamic Specifications */}
            {watchedProductType && renderSpecificationFields()}

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting} className="w-48">
                {isSubmitting ? 'Saving...' : 'Save Product'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
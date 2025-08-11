import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Upload, X, ChevronDown, Plus, ImageIcon } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const productSchema = z.object({
  productType: z.string().min(1, 'Product type is required'),
  productName: z.string().min(1, 'Product name is required'),
  urlSlug: z.string().min(1, 'URL slug is required'),
  longDescription: z.string().min(1, 'Description is required'),
  hasVariants: z.boolean(),
  basePrice: z.number().min(0, 'Price must be positive'),
  salePrice: z.number().optional(),
  sku: z.string().min(1, 'SKU is required'),
  stockQuantity: z.number().min(0, 'Stock quantity must be positive'),
  allowBackorders: z.string(),
  status: z.string(),
  brand: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  // Category-specific fields
  processor: z.string().optional(),
  ram: z.string().optional(),
  storage: z.string().optional(),
  gpu: z.string().optional(),
  display: z.string().optional(),
  operatingSystem: z.string().optional(),
  wifiStandard: z.string().optional(),
  frequencyBands: z.string().optional(),
  speedDataRate: z.string().optional(),
  ethernetPorts: z.number().optional(),
  capacityVA: z.number().optional(),
  capacityWatts: z.number().optional(),
  outputWaveform: z.string().optional(),
  estimatedRuntime: z.string().optional(),
  licenseType: z.string().optional(),
  deliveryMethod: z.string().optional(),
  systemRequirements: z.string().optional(),
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

const brands = [
  'Dell', 'HP', 'Lenovo', 'Apple', 'ASUS', 'Acer', 'MSI', 'Razer',
  'Logitech', 'Corsair', 'SteelSeries', 'HyperX', 'Sony', 'Bose',
  'TP-Link', 'Netgear', 'Linksys', 'APC', 'CyberPower',
];

const categories = [
  { id: 'laptops-and-computers', label: 'Laptops & Computers', children: [
    { id: 'gaming-laptops', label: 'Gaming Laptops' },
    { id: 'business-laptops', label: 'Business Laptops' },
    { id: 'desktop-pcs', label: 'Desktop PCs' },
    { id: 'all-in-one-pcs', label: 'All-in-One PCs' },
    { id: '2-in-1-laptops', label: '2-in-1 Laptops' },
    { id: 'workstations', label: 'Workstations' },
    { id: 'mini-pcs', label: 'Mini PCs' },
    { id: 'refurbished-systems', label: 'Refurbished Systems' }
  ]},
  { id: 'computer-components', label: 'Computer Components', children: [
    { id: 'processors-cpus', label: 'Processors (CPUs)' },
    { id: 'graphics-cards-gpus', label: 'Graphics Cards (GPUs)' },
    { id: 'memory-ram', label: 'Memory (RAM)' },
    { id: 'storage-ssd-hdd', label: 'Storage (SSD/HDD)' },
    { id: 'motherboards', label: 'Motherboards' },
    { id: 'power-supplies', label: 'Power Supplies' },
    { id: 'cooling-systems', label: 'Cooling Systems' },
    { id: 'computer-cases', label: 'Computer Cases' }
  ]},
  { id: 'networking-and-internet', label: 'Networking & Internet', children: [
    { id: 'wi-fi-routers', label: 'Wi-Fi Routers' },
    { id: 'modems', label: 'Modems' },
    { id: 'network-switches', label: 'Network Switches' },
    { id: 'access-points', label: 'Access Points' },
    { id: 'network-cables', label: 'Network Cables' },
    { id: 'firewalls', label: 'Firewalls' },
    { id: 'vpn-hardware', label: 'VPN Hardware' },
    { id: 'mesh-systems', label: 'Mesh Systems' }
  ]},
  { id: 'power-and-ups', label: 'Power & UPS', children: [
    { id: 'ups-systems', label: 'UPS Systems' },
    { id: 'power-strips', label: 'Power Strips' },
    { id: 'surge-protectors', label: 'Surge Protectors' },
    { id: 'battery-backups', label: 'Battery Backups' },
    { id: 'voltage-stabilizers', label: 'Voltage Stabilizers' },
    { id: 'power-inverters', label: 'Power Inverters' },
    { id: 'solar-power-systems', label: 'Solar Power Systems' },
    { id: 'power-cables', label: 'Power Cables' }
  ]},
  { id: 'software-and-licenses', label: 'Software & Licenses', children: [
    { id: 'microsoft-office-365', label: 'Microsoft Office 365' },
    { id: 'windows-operating-system', label: 'Windows Operating System' },
    { id: 'antivirus-software', label: 'Antivirus Software' },
    { id: 'business-software', label: 'Business Software' },
    { id: 'design-software', label: 'Design Software' },
    { id: 'development-tools', label: 'Development Tools' },
    { id: 'productivity-apps', label: 'Productivity Apps' },
    { id: 'security-software', label: 'Security Software' }
  ]},
  { id: 'accessories-and-peripherals', label: 'Accessories & Peripherals', children: [
    { id: 'keyboards-and-mice', label: 'Keyboards & Mice' },
    { id: 'monitors-and-displays', label: 'Monitors & Displays' },
    { id: 'webcams', label: 'Webcams' },
    { id: 'speakers-and-headsets', label: 'Speakers & Headsets' },
    { id: 'external-storage', label: 'External Storage' },
    { id: 'cables-and-adapters', label: 'Cables & Adapters' },
    { id: 'docking-stations', label: 'Docking Stations' },
    { id: 'printer-and-scanners', label: 'Printer & Scanners' }
  ]}
];

export default function AddProduct() {
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [seoExpanded, setSeoExpanded] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user } = useAuth();

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      hasVariants: false,
      allowBackorders: 'do-not-allow',
      status: 'draft',
      basePrice: 0,
      stockQuantity: 0,
    },
  });

  const watchedProductType = form.watch('productType');
  const watchedProductName = form.watch('productName');
  const watchedHasVariants = form.watch('hasVariants');

  // Auto-generate URL slug from product name
  React.useEffect(() => {
    if (watchedProductName) {
      const slug = watchedProductName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      form.setValue('urlSlug', slug);
    }
  }, [watchedProductName, form]);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      const newTags = [...tags, tagInput.trim()];
      setTags(newTags);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    setTags(newTags);
  };

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, categoryId]);
    } else {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setUploadedImages(prev => [...prev, e.target?.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
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
      const productData = {
        product_type: data.productType,
        product_name: data.productName,
        url_slug: data.urlSlug,
        long_description: data.longDescription,
        has_variants: data.hasVariants,
        base_price: data.basePrice,
        sale_price: data.salePrice || null,
        sku: data.sku,
        stock_quantity: data.stockQuantity,
        allow_backorders: data.allowBackorders,
        status: data.status,
        brand: data.brand || null,
        meta_title: data.metaTitle || null,
        meta_description: data.metaDescription || null,
        categories: selectedCategories,
        tags: tags,
        images: uploadedImages,
        created_by: user.id,
        // Category-specific fields
        processor: data.processor || null,
        ram: data.ram || null,
        storage: data.storage || null,
        gpu: data.gpu || null,
        display: data.display || null,
        operating_system: data.operatingSystem || null,
        wifi_standard: data.wifiStandard || null,
        frequency_bands: data.frequencyBands || null,
        speed_data_rate: data.speedDataRate || null,
        ethernet_ports: data.ethernetPorts || null,
        capacity_va: data.capacityVA || null,
        capacity_watts: data.capacityWatts || null,
        output_waveform: data.outputWaveform || null,
        estimated_runtime: data.estimatedRuntime || null,
        license_type: data.licenseType || null,
        delivery_method: data.deliveryMethod || null,
        system_requirements: data.systemRequirements || null,
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
      setTags([]);
      setSelectedCategories([]);
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

  const renderCategorySpecificFields = () => {
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
                  name="processor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Processor (CPU)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Intel Core i7-13700H" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>RAM</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 16GB DDR4" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="storage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Storage</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 512GB SSD" {...field} />
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
                      <FormLabel>Graphics Card (GPU)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., NVIDIA RTX 4060" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="display"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 15.6'' FHD IPS" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="operatingSystem"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Operating System</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select OS" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="windows-11">Windows 11</SelectItem>
                          <SelectItem value="macos">macOS</SelectItem>
                          <SelectItem value="linux">Linux</SelectItem>
                          <SelectItem value="dos">DOS</SelectItem>
                        </SelectContent>
                      </Select>
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
                  name="wifiStandard"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>WiFi Standard</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Wi-Fi 6 (802.11ax)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="frequencyBands"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frequency Bands</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency bands" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="dual-band">Dual Band (2.4GHz + 5GHz)</SelectItem>
                          <SelectItem value="tri-band">Tri Band (2.4GHz + 5GHz + 6GHz)</SelectItem>
                          <SelectItem value="single-band">Single Band (2.4GHz)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="speedDataRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Speed / Data Rate</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., AX3000 (2402 + 574 Mbps)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ethernetPorts"
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
                  name="capacityVA"
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
                  name="capacityWatts"
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
                  name="outputWaveform"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Output Waveform</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select waveform" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pure-sine-wave">Pure Sine Wave</SelectItem>
                          <SelectItem value="modified-sine-wave">Modified Sine Wave</SelectItem>
                          <SelectItem value="square-wave">Square Wave</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="estimatedRuntime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimated Runtime</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 15 minutes at full load" {...field} />
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
              <CardTitle>Software Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="licenseType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>License Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select license type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="perpetual">Perpetual</SelectItem>
                          <SelectItem value="subscription">Subscription</SelectItem>
                          <SelectItem value="one-time">One-time Purchase</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="deliveryMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivery Method</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Digital Download, Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="systemRequirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>System Requirements</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the system requirements..."
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

      default:
        return (
          <Card>
            <CardContent className="py-8">
              <p className="text-muted-foreground text-center">
                Select a product type to add specific attributes.
              </p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Add New Product</h1>
          <p className="text-muted-foreground">Create a new product for your store</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Card 1: Product Images */}
                <Card>
                  <CardHeader>
                    <CardTitle>Product Images</CardTitle>
                    <CardDescription>Upload images for your product</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Upload Images</Label>
                      <div className="mt-2">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors flex flex-col items-center"
                        >
                          <ImageIcon className="h-12 w-12 text-muted-foreground" />
                          <div className="mt-4">
                            <span className="text-sm font-medium">Click to upload images</span>
                            <p className="text-xs text-muted-foreground mt-1">
                              PNG, JPG, GIF up to 10MB each
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>

                    {uploadedImages.length > 0 && (
                      <div>
                        <Label className="text-sm font-medium">Uploaded Images ({uploadedImages.length})</Label>
                        <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-4">
                          {uploadedImages.map((image, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={image}
                                alt={`Product image ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg border"
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
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Card 2: Core Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Core Information</CardTitle>
                    <CardDescription>Basic product details and description</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="productType"
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

                    <FormField
                      control={form.control}
                      name="productName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Dell XPS 15 (9530)" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="urlSlug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL Slug</FormLabel>
                          <FormControl>
                            <div className="flex">
                              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                                https://yourstore.com/products/
                              </span>
                              <Input 
                                className="rounded-l-none" 
                                placeholder="product-url-slug"
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="longDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Long Description *</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe your product in detail..."
                              className="min-h-[120px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Card 3: Product Variants */}
                <Card>
                  <CardHeader>
                    <CardTitle>Product Variants</CardTitle>
                    <CardDescription>Configure product variations and options</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="hasVariants"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              This product has multiple options (variants)
                            </FormLabel>
                            <div className="text-sm text-muted-foreground">
                              Enable if your product comes in different sizes, colors, or configurations
                            </div>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {watchedHasVariants && (
                      <div className="space-y-4 pt-4">
                        <div className="text-sm text-muted-foreground">
                          Variant functionality will be implemented in the next phase
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Card 4: Pricing & Inventory */}
                <Card>
                  <CardHeader>
                    <CardTitle>Pricing & Inventory</CardTitle>
                    <CardDescription>Set pricing and stock information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="basePrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Base Price *</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                                  $
                                </span>
                                <Input 
                                  type="number" 
                                  className="pl-8" 
                                  placeholder="0.00"
                                  {...field}
                                  onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="salePrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sale Price</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                                  $
                                </span>
                                <Input 
                                  type="number" 
                                  className="pl-8" 
                                  placeholder="0.00"
                                  {...field}
                                  onChange={e => field.onChange(parseFloat(e.target.value) || undefined)}
                                />
                              </div>
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
                              <Input placeholder="PROD-001" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="stockQuantity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Stock Quantity *</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="0"
                                {...field}
                                onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="allowBackorders"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Allow Backorders?</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="do-not-allow">Do not allow</SelectItem>
                              <SelectItem value="allow-notify">Allow, but notify customer</SelectItem>
                              <SelectItem value="allow">Allow</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Card 5: Category-Specific Attributes */}
                {renderCategorySpecificFields()}
              </div>

              {/* Right Column - Sidebar */}
              <div className="space-y-6">
                {/* Card 1: Publish */}
                <Card>
                  <CardHeader>
                    <CardTitle>Publish Product</CardTitle>
                    <CardDescription>Make your product live and visible to customers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      type="button" 
                      className="w-full" 
                      disabled={isSubmitting}
                      onClick={() => {
                        form.setValue('status', 'published');
                        form.handleSubmit(onSubmit)();
                      }}
                    >
                      {isSubmitting ? 'Publishing...' : 'Publish Product'}
                    </Button>
                  </CardContent>
                </Card>

                {/* Card 2: Organization */}
                <Card>
                  <CardHeader>
                    <CardTitle>Organization</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="brand"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Brand/Manufacturer</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select brand" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {brands.map((brand) => (
                                <SelectItem key={brand} value={brand.toLowerCase()}>
                                  {brand}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div>
                      <Label className="text-sm font-medium">Categories</Label>
                      <div className="mt-2 space-y-2 max-h-48 overflow-y-auto border rounded-md p-3">
                        {categories.map((category) => (
                          <div key={category.id} className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={category.id}
                                checked={selectedCategories.includes(category.id)}
                                onCheckedChange={(checked) => 
                                  handleCategoryChange(category.id, checked as boolean)
                                }
                              />
                              <Label 
                                htmlFor={category.id} 
                                className="text-sm font-medium"
                              >
                                {category.label}
                              </Label>
                            </div>
                            {category.children && (
                              <div className="ml-6 space-y-1">
                                {category.children.map((child) => (
                                  <div key={child.id} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={child.id}
                                      checked={selectedCategories.includes(child.id)}
                                      onCheckedChange={(checked) => 
                                        handleCategoryChange(child.id, checked as boolean)
                                      }
                                    />
                                    <Label 
                                      htmlFor={child.id} 
                                      className="text-sm text-muted-foreground"
                                    >
                                      {child.label}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Tags</Label>
                      <div className="mt-2 space-y-2">
                        <div className="flex space-x-2">
                          <Input
                            placeholder="Add a tag..."
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddTag();
                              }
                            }}
                          />
                          <Button type="button" size="sm" onClick={handleAddTag}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        {tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-auto p-0 ml-1"
                                  onClick={() => handleRemoveTag(tag)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>


                {/* Card 4: SEO */}
                <Card>
                  <Collapsible open={seoExpanded} onOpenChange={setSeoExpanded}>
                    <CardHeader>
                      <CollapsibleTrigger asChild>
                        <div className="flex items-center justify-between cursor-pointer">
                          <CardTitle>SEO</CardTitle>
                          <ChevronDown className={`h-4 w-4 transition-transform ${seoExpanded ? 'rotate-180' : ''}`} />
                        </div>
                      </CollapsibleTrigger>
                    </CardHeader>
                    <CollapsibleContent>
                      <CardContent className="space-y-4">
                        <FormField
                          control={form.control}
                          name="metaTitle"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Meta Title</FormLabel>
                              <FormControl>
                                <Input placeholder="SEO title..." {...field} />
                              </FormControl>
                              <div className="text-xs text-muted-foreground">
                                {field.value?.length || 0}/60 characters
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="metaDescription"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Meta Description</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="SEO description..."
                                  className="min-h-[80px]"
                                  {...field} 
                                />
                              </FormControl>
                              <div className="text-xs text-muted-foreground">
                                {field.value?.length || 0}/160 characters
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
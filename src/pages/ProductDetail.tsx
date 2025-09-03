
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Edit, Circle } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

const specLabelMap: Record<string, string> = {
  cpu: 'CPU',
  gpu: 'GPU',
  ram_gb: 'RAM (GB)',
  storage_gb: 'Storage (GB)',
  display_size_inches: 'Display Size (inches)',
  operating_system: 'Operating System',
  wifi_standard: 'Wi‑Fi Standard',
  frequency_bands: 'Frequency Bands',
  speed_data_rate: 'Speed/Data Rate',
  ethernet_ports: 'Ethernet Ports',
  capacity_va: 'Capacity (VA)',
  capacity_watts: 'Capacity (Watts)',
  output_waveform: 'Output Waveform',
  estimated_runtime_minutes: 'Estimated Runtime (minutes)',
  license_type: 'License Type',
  delivery_method: 'Delivery Method',
  system_requirements: 'System Requirements',
  screen_size_inches: 'Screen Size (inches)',
  resolution: 'Resolution',
  refresh_rate_hz: 'Refresh Rate (Hz)',
  panel_type: 'Panel Type',
  key_switch_type: 'Key Switch Type',
  layout: 'Layout',
  connectivity: 'Connectivity',
  backlight: 'Backlight',
  sensor_type: 'Sensor Type',
  max_dpi: 'Max DPI',
  number_of_buttons: 'Number of Buttons',
  driver_type: 'Driver Type',
  noise_cancellation: 'Noise Cancellation',
  has_microphone: 'Has Microphone',
  brand: 'Brand',
  color: 'Color',
  weight_kg: 'Weight (kg)',
  dimensions: 'Dimensions',
  camera: 'Camera',
  audio: 'Audio',
  keyboard: 'Keyboard',
  ports: 'Ports',
  battery: 'Battery',
};

const formatSpecLabel = (key: string): string => {
  if (specLabelMap[key]) return specLabelMap[key];
  const pretty = key
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  return pretty
    .replace(/\bGb\b/g, 'GB')
    .replace(/\bMb\b/g, 'MB')
    .replace(/\bHz\b/g, 'Hz')
    .replace(/\bVa\b/g, 'VA')
    .replace(/\bDpi\b/g, 'DPI');
};

const formatSpecValue = (value: any): string => {
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return String(value);
};

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [carouselApi, setCarouselApi] = useState<any>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();

  // Track current slide when carousel API changes
  useEffect(() => {
    if (!carouselApi) return;

    const onSelect = () => {
      setCurrentSlide(carouselApi.selectedScrollSnap());
    };

    carouselApi.on('select', onSelect);
    carouselApi.on('reInit', onSelect);

    // Call once to set initial slide
    onSelect();

    return () => {
      carouselApi.off('select', onSelect);
      carouselApi.off('reInit', onSelect);
    };
  }, [carouselApi]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .eq('status', 'published')
          .maybeSingle();

        if (error) {
          console.error('Error fetching product:', error);
          return;
        }

        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="aspect-[4/3] bg-stone-200 rounded-2xl"></div>
              <div className="flex space-x-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-20 h-20 bg-stone-200 rounded-lg"></div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-8 bg-stone-200 rounded w-3/4"></div>
              <div className="h-4 bg-stone-200 rounded w-1/2"></div>
              <div className="h-8 bg-stone-200 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-stone-900 mb-4">Product Not Found</h1>
          <p className="text-stone-600 mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <Link to="/" className="text-red-600 hover:text-red-700 underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const relatedProducts = [
    {
      id: 21,
      name: 'TP-Link Archer AX73',
      description: 'Wi-Fi 6 router with dual band support',
      image: 'https://images.unsplash.com/photo-1558618047-fd3c8c5d17d0?w=300&h=200&fit=crop'
    },
    {
      id: 22,
      name: 'Laptop Cooling Pad',
      description: 'Keep your laptop cool during heavy use',
      image: 'https://images.unsplash.com/photo-1572459443203-55bf9c14e87d?w=300&h=200&fit=crop'
    },
    {
      id: 23,
      name: 'Ergonomic Wireless Mouse',
      description: 'Comfortable and precise mouse',
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=200&fit=crop'
    }
  ];

  const reviews = [
    {
      id: 1,
      author: 'Sophia Carter',
      time: '2 months ago',
      rating: 5,
      comment: `This ${product.name} is amazing! It's super fast and the performance is excellent. Perfect for both work and entertainment.`
    },
    {
      id: 2,
      author: 'Ethan Bennett',
      time: '3 months ago',
      rating: 4,
      comment: `Great ${product.product_type} for the price. The build quality is solid and it meets all my requirements perfectly.`
    }
  ];

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.images?.[0] || '/placeholder.svg',
      category: product.product_type
    });
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleWishlistToggle = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast({
        title: "Removed from Wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      });
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        image: product.images?.[0] || '/placeholder.svg',
        category: product.product_type
      });
      toast({
        title: "Added to Wishlist",
        description: `${product.name} has been added to your wishlist.`,
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2 text-sm text-stone-600">
            <Link to="/" className="text-red-600 hover:scale-105 transition-transform duration-200">Home</Link>
            <span>/</span>
            <Link to="/store" className="text-red-600 hover:scale-105 transition-transform duration-200">Store</Link>
            <span>/</span>
            <span>{product.name}</span>
          </div>
          
          {/* Admin Indicator */}
          {isAdmin && (
            <div className="flex items-center space-x-2">
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                🔒 Admin Mode
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images - Sticky Container */}
          <div className="lg:sticky lg:top-8 lg:self-start space-y-6">
            <Carousel className="w-full" setApi={setCarouselApi}>
              <CarouselContent>
                {product.images?.length > 0 ? (
                  product.images.map((image: string, index: number) => (
                    <CarouselItem key={index}>
                      <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100">
                        <img
                          src={image || '/placeholder.svg'}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))
                ) : (
                  <CarouselItem>
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100">
                      <img
                        src="/placeholder.svg"
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CarouselItem>
                )}
              </CarouselContent>
              
              {product.images?.length > 1 && (
                <>
                  <CarouselPrevious className="-left-4 lg:-left-6" />
                  <CarouselNext className="-right-4 lg:-right-6" />
                </>
              )}
            </Carousel>
            
            {/* Dot indicators */}
            {product.images?.length > 1 && (
              <div className="flex justify-center space-x-2 mt-4">
                {product.images.map((_: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (carouselApi) {
                        carouselApi.scrollTo(index);
                      }
                    }}
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${
                      currentSlide === index ? 'bg-red-600' : 'bg-stone-300'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Info - Scrollable Content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-stone-900 mb-2">{product.name}</h1>
              {product.description && (
                <p className="text-stone-600">{product.description}</p>
              )}
            </div>

            <div className="text-3xl font-bold text-stone-900">₹{Number(product.price).toLocaleString('en-IN')}</div>

            <div className="flex space-x-4">
              <Button 
                onClick={handleAddToCart}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3"
              >
                Add to Cart
              </Button>
              <Button 
                variant="outline" 
                className={`px-6 ${isInWishlist(product.id) ? 'text-red-500 border-red-500' : ''}`}
                onClick={handleWishlistToggle}
              >
                <Heart className={`w-4 h-4 mr-2 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                {isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </Button>
            </div>

            {/* Admin Edit Button */}
            {isAdmin && product && (
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-blue-600 font-medium">🔒 Admin Only</span>
                </div>
                <Link to={`/admin/edit-product/${product.id}`}>
                  <Button 
                    variant="outline" 
                    className="w-full border-blue-500 text-blue-600 hover:bg-blue-50 hover:border-blue-600 transition-colors"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Product
                  </Button>
                </Link>
              </div>
            )}

            {/* Return Policy Section */}
            <div className="pt-4">
              <h2 className="text-2xl font-bold text-stone-900 mb-4">Return Policy</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h3 className="font-semibold text-stone-900 mb-1">30-Day Return Window</h3>
                        <p className="text-stone-700 text-sm">You can return this item within 30 days of delivery if it's in original condition with all accessories.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h3 className="font-semibold text-stone-900 mb-1">Customer Pays Return Shipping</h3>
                        <p className="text-stone-700 text-sm">Return shipping costs are the customer's responsibility. We recommend using a trackable service.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h3 className="font-semibold text-stone-900 mb-1">Return Authorization Required</h3>
                        <p className="text-stone-700 text-sm">Contact us for a Return Authorization Number (RAN) before shipping any returns.</p>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-red-50 rounded-lg">
                      <p className="text-red-800 text-sm font-medium">
                        <strong>Note:</strong> Software products and digital licenses cannot be returned once activated. Custom orders are final sale.
                      </p>
                    </div>
                    <div className="mt-4">
                      <Link to="/returns-policy" className="text-red-600 hover:text-red-700 font-medium text-sm">
                        View Full Return Policy →
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Technical Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="pt-4">
                <h2 className="text-2xl font-bold text-stone-900 mb-6">Technical Specifications</h2>
                <Card>
                  <CardContent className="p-6">
                    {/* Two-column grid: labels left, values right, aligned neatly */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-x-6">
                      {(Object.entries(product.specifications as Record<string, any>)
                        .filter(([_, value]) => value !== null && value !== undefined && value !== '')
                        .map(([key, value]) => ({ key, value: formatSpecValue(value) })))
                        .map(({ key, value }) => (
                          <div key={key} className="sm:col-span-12 grid grid-cols-1 sm:grid-cols-12 py-3 border-b border-stone-100 last:border-b-0">
                            <div className="sm:col-span-4 pr-4 font-medium text-stone-900 break-words">
                              {formatSpecLabel(key)}
                            </div>
                            <div className="sm:col-span-8 text-stone-700 break-words">
                              {value}
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>

        {/* Customer Reviews */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-stone-900 mb-6">Customer Reviews</h2>
          <div className="space-y-6">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-stone-300 rounded-full flex items-center justify-center">
                      <span className="text-stone-600 font-medium">
                        {review.author.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <span className="font-medium text-stone-900">{review.author}</span>
                        <span className="text-stone-500 text-sm">{review.time}</span>
                      </div>
                      <div className="flex items-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-sm ${
                              i < review.rating ? 'text-yellow-400' : 'text-stone-300'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <p className="text-stone-700">{review.comment}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Related Products */}
        <div>
          <h2 className="text-2xl font-bold text-stone-900 mb-6">Related Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-0">
                  <Link to={`/product/${product.id}`}>
                    <div className="aspect-[4/3] overflow-hidden rounded-t-lg">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-stone-900 mb-2">{product.name}</h3>
                      <p className="text-stone-600 text-sm">{product.description}</p>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
  );
};

export default ProductDetail;

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Heart, Grid, List, ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  images: string[];
  product_type: string;
  specifications: any;
  sku?: string;
  stock_quantity: number;
  status: string;
}

const Products = () => {
  const location = useLocation();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState([5000, 300000]); // Min to Max
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('any');
  const [selectedRating, setSelectedRating] = useState('any');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Get current category from route
  const getCurrentCategory = () => {
    const path = location.pathname;
    if (path === '/laptops') return 'laptop';
    if (path === '/routers') return 'accessory';
    if (path === '/pcs') return 'component';
    if (path === '/ups') return 'accessory';
    if (path === '/components') return 'component';
    if (path === '/monitors') return 'peripheral';
    if (path === '/keyboards') return 'peripheral';
    if (path === '/accessories') return 'accessory';
    return 'all';
  };

  const currentCategory = getCurrentCategory();

  useEffect(() => {
    fetchProducts();
  }, [currentCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('products')
        .select('*')
        .eq('status', 'published');

      if (currentCategory !== 'all') {
        query = query.eq('product_type', currentCategory);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching products:', error);
        toast({
          title: "Error",
          description: "Failed to load products",
          variant: "destructive",
        });
      } else {
        setProducts(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: parseInt(product.id) || 0,
      name: product.name,
      price: product.price,
      image: product.images[0] || '/placeholder.svg',
      category: product.product_type
    });
    
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleWishlistToggle = (product: Product) => {
    const productId = parseInt(product.id) || 0;
    const wishlistItem = {
      id: productId,
      name: product.name,
      price: product.price,
      image: product.images[0] || '/placeholder.svg',
      category: product.product_type
    };

    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
      toast({
        title: "Removed from Wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      });
    } else {
      addToWishlist(wishlistItem);
      toast({
        title: "Added to Wishlist",
        description: `${product.name} has been added to your wishlist.`,
      });
    }
  };

  // Apply filters and sorting
  const getFilteredProducts = () => {
    let filteredProducts = [...products];
    
    // Filter by price range (priceRange[0] is min, priceRange[1] is max)
    filteredProducts = filteredProducts.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    // Filter by brand
    if (selectedBrand !== 'any') {
      filteredProducts = filteredProducts.filter(product => 
        product.specifications?.brand === selectedBrand
      );
    }
    
    // Sort products
    switch (sortBy) {
      case 'price-low-high':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-high-low':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
      default:
        // Keep original order for newest
        break;
    }
    
    return filteredProducts;
  };

  const filteredProducts = getFilteredProducts();

  // Get unique brands from current products
  const getAvailableBrands = () => {
    const brands = [...new Set(products.map(product => product.specifications?.brand).filter(Boolean))];
    return brands.sort();
  };

  // Get category title
  const getCategoryTitle = () => {
    const path = location.pathname;
    if (path === '/laptops') return 'Laptops';
    if (path === '/routers') return 'Wi-Fi Routers';
    if (path === '/pcs') return 'All-in-One PCs';
    if (path === '/ups') return 'UPS Systems';
    if (path === '/components') return 'Components';
    if (path === '/monitors') return 'Monitors';
    if (path === '/keyboards') return 'Keyboards';
    if (path === '/accessories') return 'Accessories';
    return 'All Products';
  };

  // Get subcategories based on current category
  const getSubcategories = () => {
    const path = location.pathname;
    if (path === '/laptops') return ['All Laptops', 'Gaming Laptops', 'Business Laptops', '2-in-1 Laptops', 'Chromebooks'];
    if (path === '/routers') return ['All Routers', 'Wi-Fi 6 Routers', 'Gaming Routers', 'Mesh Systems'];
    if (path === '/pcs') return ['All PCs', 'Gaming PCs', 'Business PCs', 'Creative PCs'];
    if (path === '/ups') return ['All UPS', 'Home UPS', 'Office UPS', 'Server UPS'];
    if (path === '/components') return ['All Components', 'RAM', 'Storage', 'Graphics Cards', 'Processors'];
    if (path === '/monitors') return ['All Monitors', '27" 4K Monitors', '32" Monitors'];
    if (path === '/keyboards') return ['All Keyboards', 'Mechanical Keyboards', 'Wireless Keyboards'];
    if (path === '/accessories') return ['All Accessories', 'Mouse Pro', 'USB-C Hub'];
    return ['All Categories'];
  };

  const subcategories = getSubcategories();

  return (
    <div className="min-h-screen bg-stone-50">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-stone-600 mb-8 animate-fade-in">
          <Link to="/" className="text-red-600 hover:scale-105 transition-transform duration-200">Home</Link>
          <span>/</span>
          <Link to="/store" className="text-red-600 hover:scale-105 transition-transform duration-200">Store</Link>
          <span>/</span>
          <span>{getCategoryTitle()}</span>
        </div>

        <div className="flex gap-6">
          {/* Smaller Sidebar Filters */}
          <div className="w-64 space-y-6 animate-slide-up">
            <div>
              <h3 className="text-lg font-semibold text-stone-900 mb-4">{getCategoryTitle()}</h3>
              <div className="space-y-2">
                {subcategories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "ghost"}
                    className={`w-full justify-start text-sm transform hover:scale-105 transition-all duration-200 ${
                      selectedCategory === category 
                        ? "bg-stone-200 text-stone-900" 
                        : "text-stone-700 hover:bg-stone-100"
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-stone-900 mb-4">Filters</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-stone-700 mb-2 block">Brand</label>
                  <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                    <SelectTrigger className="w-full text-sm">
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      {getAvailableBrands().map((brand) => (
                        <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-stone-700 mb-3 block">Price Range</label>
                  <div className="px-2">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={300000}
                      min={5000}
                      step={1000}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-stone-600 mt-2">
                      <span>₹{priceRange[0].toLocaleString('en-IN')}</span>
                      <span>₹{priceRange[1].toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-stone-700 mb-2 block">Customer Ratings</label>
                  <Select value={selectedRating} onValueChange={setSelectedRating}>
                    <SelectTrigger className="w-full text-sm">
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="4-plus">4+ Stars</SelectItem>
                      <SelectItem value="5">5 Stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6 animate-fade-in delay-100">
              <h2 className="text-2xl font-bold text-stone-900">Products</h2>
              <div className="flex items-center space-x-4">
                {/* View Mode Toggle */}
                <div className="flex items-center space-x-2 border rounded-lg p-1">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="p-2"
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="p-2"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-stone-700">Sort by:</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="popularity">Popularity</SelectItem>
                      <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                      <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-stone-600">{filteredProducts.length} products found</p>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(8)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <CardContent className="p-4 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-8 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12 animate-fade-in">
                <p className="text-stone-600 text-lg">No products found matching your criteria.</p>
                <p className="text-stone-500 mt-2">Try adjusting your filters to see more results.</p>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                {filteredProducts.map((product, index) => {
                  const productInWishlist = isInWishlist(parseInt(product.id) || 0);
                  const brand = product.specifications?.brand;
                  
                  return viewMode === 'grid' ? (
                    // Grid View
                    <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 border-stone-200 transform hover:-translate-y-2 animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                      <CardContent className="p-0">
                        <div className="relative">
                          <Link to={`/product/${product.id}`}>
                            <div className="aspect-square overflow-hidden rounded-t-lg bg-stone-100">
                              {product.images[0] ? (
                                <img
                                  src={product.images[0]}
                                  alt={product.name}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                  <span className="text-gray-400">No Image</span>
                                </div>
                              )}
                            </div>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`absolute top-2 right-2 bg-white/80 hover:bg-white transform hover:scale-110 transition-all duration-200 ${
                              productInWishlist ? 'text-red-500' : 'text-stone-600'
                            }`}
                            onClick={() => handleWishlistToggle(product)}
                          >
                            <Heart className={`w-4 h-4 transition-all duration-200 ${productInWishlist ? 'fill-current scale-110' : ''}`} />
                          </Button>
                        </div>
                        <div className="p-4">
                          <Link to={`/product/${product.id}`}>
                            <h3 className="font-semibold text-stone-900 mb-1 hover:text-red-600 transition-colors duration-200 line-clamp-2">{product.name}</h3>
                          </Link>
                          
                          {brand && (
                            <p className="text-sm text-gray-500 mb-2">{brand}</p>
                          )}
                          
                          <p className="text-lg font-bold text-stone-900 mb-3">₹{Number(product.price).toLocaleString('en-IN')}</p>
                          <Button 
                            onClick={() => handleAddToCart(product)}
                            className="w-full bg-red-600 hover:bg-red-700 text-white transform hover:scale-105 transition-all duration-200"
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Add to Cart
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    // List View
                    <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 border-stone-200 animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                      <CardContent className="p-0">
                        <div className="flex items-center p-4 gap-4">
                          <div className="relative flex-shrink-0">
                            <Link to={`/product/${product.id}`}>
                              <div className="w-24 h-24 overflow-hidden rounded-lg bg-stone-100">
                                {product.images[0] ? (
                                  <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                    <span className="text-gray-400 text-xs">No Image</span>
                                  </div>
                                )}
                              </div>
                            </Link>
                          </div>
                          <div className="flex-1 min-w-0">
                            <Link to={`/product/${product.id}`}>
                              <h3 className="font-semibold text-stone-900 mb-1 hover:text-red-600 transition-colors duration-200">{product.name}</h3>
                            </Link>
                            
                            {brand && (
                              <p className="text-sm text-gray-500 mb-2">{brand}</p>
                            )}
                            
                            {product.description && (
                              <p className="text-sm text-stone-600 mb-2 line-clamp-2">{product.description}</p>
                            )}
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            <p className="text-xl font-bold text-stone-900">₹{Number(product.price).toLocaleString('en-IN')}</p>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className={`${
                                  productInWishlist ? 'text-red-500' : 'text-stone-600'
                                }`}
                                onClick={() => handleWishlistToggle(product)}
                              >
                                <Heart className={`w-4 h-4 ${productInWishlist ? 'fill-current' : ''}`} />
                              </Button>
                              <Button 
                                onClick={() => handleAddToCart(product)}
                                className="bg-red-600 hover:bg-red-700 text-white"
                              >
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                Add to Cart
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;

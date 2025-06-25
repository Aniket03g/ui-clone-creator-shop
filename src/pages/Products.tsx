import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Heart } from 'lucide-react';
import Header from '@/components/Header';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useToast } from '@/hooks/use-toast';

const Products = () => {
  const location = useLocation();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();
  const [priceRange, setPriceRange] = useState([300000, 5000]); // High to low
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('any');
  const [selectedRating, setSelectedRating] = useState('any');
  const [sortBy, setSortBy] = useState('newest');

  // Get current category from route
  const getCurrentCategory = () => {
    const path = location.pathname;
    if (path === '/laptops') return 'laptops';
    if (path === '/routers') return 'routers';
    if (path === '/pcs') return 'pcs';
    if (path === '/ups') return 'ups';
    if (path === '/components') return 'components';
    return 'store';
  };

  const currentCategory = getCurrentCategory();

  // Extended products data with more items and brands
  const allProducts = {
    laptops: [
      {
        id: 1,
        name: 'TechBook Pro 15',
        price: 97425,
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
        category: 'Laptop',
        brand: 'TechShop',
        rating: 4.5
      },
      {
        id: 7,
        name: 'TechBook Air 13',
        price: 75325,
        image: 'https://images.unsplash.com/photo-1541807084-9913014e4c4d?w=400&h=300&fit=crop',
        category: 'Laptop',
        brand: 'TechShop',
        rating: 4.3
      },
      {
        id: 8,
        name: 'TechBook Gaming X1',
        price: 134925,
        image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=300&fit=crop',
        category: 'Laptop',
        brand: 'TechShop',
        rating: 4.7
      },
      {
        id: 9,
        name: 'TechBook Business Elite',
        price: 89175,
        image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=300&fit=crop',
        category: 'Laptop',
        brand: 'TechShop',
        rating: 4.4
      },
      {
        id: 17,
        name: 'Dell Inspiron 15',
        price: 65000,
        image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&h=300&fit=crop',
        category: 'Laptop',
        brand: 'Dell',
        rating: 4.2
      },
      {
        id: 18,
        name: 'HP Pavilion 14',
        price: 55000,
        image: 'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=400&h=300&fit=crop',
        category: 'Laptop',
        brand: 'HP',
        rating: 4.1
      },
      {
        id: 19,
        name: 'Lenovo ThinkPad E14',
        price: 78000,
        image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=300&fit=crop',
        category: 'Laptop',
        brand: 'Lenovo',
        rating: 4.6
      },
      {
        id: 20,
        name: 'ASUS VivoBook 15',
        price: 52000,
        image: 'https://images.unsplash.com/photo-1515343476470-163c97a3c1a3?w=400&h=300&fit=crop',
        category: 'Laptop',
        brand: 'ASUS',
        rating: 4.0
      }
    ],
    routers: [
      {
        id: 2,
        name: 'NetLink 6000',
        price: 11175,
        image: 'https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=400&h=300&fit=crop',
        category: 'Wi-Fi Router',
        brand: 'TechShop',
        rating: 4.4
      },
      {
        id: 10,
        name: 'SpeedLink Pro',
        price: 18675,
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
        category: 'Wi-Fi Router',
        brand: 'TechShop',
        rating: 4.5
      },
      {
        id: 11,
        name: 'UltraConnect 5G',
        price: 26175,
        image: 'https://images.unsplash.com/photo-1544717440-6d6866c37ef7?w=400&h=300&fit=crop',
        category: 'Wi-Fi Router',
        brand: 'TechShop',
        rating: 4.7
      },
      {
        id: 21,
        name: 'TP-Link Archer AX73',
        price: 15000,
        image: 'https://images.unsplash.com/photo-1558618047-fd3c8c5d17d0?w=400&h=300&fit=crop',
        category: 'Wi-Fi Router',
        brand: 'TP-Link',
        rating: 4.3
      },
      {
        id: 22,
        name: 'Netgear Nighthawk AX12',
        price: 35000,
        image: 'https://images.unsplash.com/photo-1580584126903-c17d41830450?w=400&h=300&fit=crop',
        category: 'Wi-Fi Router',
        brand: 'Netgear',
        rating: 4.8
      },
      {
        id: 23,
        name: 'D-Link DIR-X1560',
        price: 8500,
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop',
        category: 'Wi-Fi Router',
        brand: 'D-Link',
        rating: 4.1
      }
    ],
    pcs: [
      {
        id: 3,
        name: 'VisionDesk 27',
        price: 134925,
        image: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=400&h=300&fit=crop',
        category: 'All-in-One PC',
        brand: 'TechShop',
        rating: 4.6
      },
      {
        id: 12,
        name: 'PowerStation 32',
        price: 186750,
        image: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=400&h=300&fit=crop',
        category: 'All-in-One PC',
        brand: 'TechShop',
        rating: 4.8
      },
      {
        id: 24,
        name: 'HP All-in-One 24',
        price: 95000,
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop',
        category: 'All-in-One PC',
        brand: 'HP',
        rating: 4.3
      },
      {
        id: 25,
        name: 'Dell Inspiron 27 AIO',
        price: 120000,
        image: 'https://images.unsplash.com/photo-1572459443203-55bf9c14e87d?w=400&h=300&fit=crop',
        category: 'All-in-One PC',
        brand: 'Dell',
        rating: 4.5
      }
    ],
    ups: [
      {
        id: 4,
        name: 'PowerGuard 1000',
        price: 18675,
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop',
        category: 'UPS System',
        brand: 'TechShop',
        rating: 4.4
      },
      {
        id: 13,
        name: 'PowerShield 1500',
        price: 26175,
        image: 'https://images.unsplash.com/photo-1580584126903-c17d41830450?w=400&h=300&fit=crop',
        category: 'UPS System',
        brand: 'TechShop',
        rating: 4.5
      },
      {
        id: 14,
        name: 'PowerMax 2000',
        price: 37425,
        image: 'https://images.unsplash.com/photo-1558618047-fd3c8c5d17d0?w=400&h=300&fit=crop',
        category: 'UPS System',
        brand: 'TechShop',
        rating: 4.7
      },
      {
        id: 26,
        name: 'APC Back-UPS 1100',
        price: 22000,
        image: 'https://images.unsplash.com/photo-1509909756405-be0199881695?w=400&h=300&fit=crop',
        category: 'UPS System',
        brand: 'APC',
        rating: 4.6
      },
      {
        id: 27,
        name: 'Microtek UPS EB 800',
        price: 12000,
        image: 'https://images.unsplash.com/photo-1572459443203-55bf9c14e87d?w=400&h=300&fit=crop',
        category: 'UPS System',
        brand: 'Microtek',
        rating: 4.2
      }
    ],
    components: [
      {
        id: 15,
        name: 'TechRAM 16GB DDR4',
        price: 7425,
        image: 'https://images.unsplash.com/photo-1555617778-5b5d3d8d5e6b?w=400&h=300&fit=crop',
        category: 'Component',
        brand: 'TechShop',
        rating: 4.3
      },
      {
        id: 16,
        name: 'TechSSD 1TB NVMe',
        price: 14925,
        image: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=400&h=300&fit=crop',
        category: 'Component',
        brand: 'TechShop',
        rating: 4.5
      },
      {
        id: 28,
        name: 'Corsair Vengeance 32GB',
        price: 18000,
        image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&h=300&fit=crop',
        category: 'Component',
        brand: 'Corsair',
        rating: 4.7
      },
      {
        id: 29,
        name: 'Samsung 980 PRO 2TB',
        price: 28000,
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
        category: 'Component',
        brand: 'Samsung',
        rating: 4.8
      },
      {
        id: 30,
        name: 'NVIDIA RTX 4060',
        price: 85000,
        image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&h=300&fit=crop',
        category: 'Component',
        brand: 'NVIDIA',
        rating: 4.9
      },
      {
        id: 31,
        name: 'AMD Ryzen 7 5800X',
        price: 32000,
        image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=400&h=300&fit=crop',
        category: 'Component',
        brand: 'AMD',
        rating: 4.6
      }
    ]
  };

  // Get products based on current route
  const getProducts = () => {
    if (currentCategory === 'store') {
      return Object.values(allProducts).flat();
    }
    return allProducts[currentCategory] || [];
  };

  // Apply filters and sorting
  const getFilteredProducts = () => {
    let products = getProducts();
    
    // Filter by price range (note: priceRange[0] is max, priceRange[1] is min)
    products = products.filter(product => 
      product.price >= priceRange[1] && product.price <= priceRange[0]
    );
    
    // Filter by brand
    if (selectedBrand !== 'any') {
      products = products.filter(product => product.brand === selectedBrand);
    }
    
    // Filter by rating
    if (selectedRating === '4-plus') {
      products = products.filter(product => product.rating >= 4);
    } else if (selectedRating === '5') {
      products = products.filter(product => product.rating === 5);
    }
    
    // Sort products
    switch (sortBy) {
      case 'price-low-high':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-high-low':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'popularity':
        products.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
      default:
        // Keep original order for newest
        break;
    }
    
    return products;
  };

  const filteredProducts = getFilteredProducts();

  // Get unique brands from current products
  const getAvailableBrands = () => {
    const products = getProducts();
    const brands = [...new Set(products.map(product => product.brand))];
    return brands.sort();
  };

  // Get category title
  const getCategoryTitle = () => {
    switch (currentCategory) {
      case 'laptops': return 'Laptops';
      case 'routers': return 'Wi-Fi Routers';
      case 'pcs': return 'All-in-One PCs';
      case 'ups': return 'UPS Systems';
      case 'components': return 'Components';
      default: return 'All Products';
    }
  };

  // Get subcategories based on current category
  const getSubcategories = () => {
    switch (currentCategory) {
      case 'laptops':
        return ['All Laptops', 'Gaming Laptops', 'Business Laptops', '2-in-1 Laptops', 'Chromebooks'];
      case 'routers':
        return ['All Routers', 'Wi-Fi 6 Routers', 'Gaming Routers', 'Mesh Systems'];
      case 'pcs':
        return ['All PCs', 'Gaming PCs', 'Business PCs', 'Creative PCs'];
      case 'ups':
        return ['All UPS', 'Home UPS', 'Office UPS', 'Server UPS'];
      case 'components':
        return ['All Components', 'RAM', 'Storage', 'Graphics Cards', 'Processors'];
      default:
        return ['All Categories'];
    }
  };

  const subcategories = getSubcategories();

  const handleAddToCart = (product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category
    });
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleWishlistToggle = (product) => {
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
        price: product.price,
        image: product.image,
        category: product.category
      });
      toast({
        title: "Added to Wishlist",
        description: `${product.name} has been added to your wishlist.`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-stone-600 mb-8 animate-fade-in">
          <Link to="/" className="text-red-600 hover:scale-105 transition-transform duration-200">Home</Link>
          <span>/</span>
          <Link to="/store" className="text-red-600 hover:scale-105 transition-transform duration-200">Store</Link>
          <span>/</span>
          <span>{getCategoryTitle()}</span>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <div className="w-80 space-y-6 animate-slide-up">
            <div>
              <h3 className="text-lg font-semibold text-stone-900 mb-4">{getCategoryTitle()}</h3>
              <div className="space-y-2">
                {subcategories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "ghost"}
                    className={`w-full justify-start transform hover:scale-105 transition-all duration-200 ${
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
              
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-stone-700 mb-2 block">Brand</label>
                  <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                    <SelectTrigger className="w-full hover:scale-105 transform transition-all duration-200">
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
                  <label className="text-sm font-medium text-stone-700 mb-4 block">Price Range</label>
                  <div className="px-2">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={300000}
                      min={5000}
                      step={1000}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-stone-600 mt-2">
                      <span>₹{priceRange[1].toLocaleString('en-IN')}</span>
                      <span>₹{priceRange[0].toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-stone-700 mb-2 block">Customer Ratings</label>
                  <Select value={selectedRating} onValueChange={setSelectedRating}>
                    <SelectTrigger className="w-full hover:scale-105 transform transition-all duration-200">
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
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-stone-700">Sort by:</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48 hover:scale-105 transform transition-all duration-200">
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product, index) => (
                <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 border-stone-200 transform hover:-translate-y-2 animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                  <CardContent className="p-0">
                    <div className="relative">
                      <Link to={`/product/${product.id}`}>
                        <div className="aspect-square overflow-hidden rounded-t-lg bg-stone-100">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`absolute top-2 right-2 bg-white/80 hover:bg-white transform hover:scale-110 transition-all duration-200 ${
                          isInWishlist(product.id) ? 'text-red-500' : 'text-stone-600'
                        }`}
                        onClick={() => handleWishlistToggle(product)}
                      >
                        <Heart className={`w-4 h-4 transition-all duration-200 ${isInWishlist(product.id) ? 'fill-current scale-110' : ''}`} />
                      </Button>
                    </div>
                    <div className="p-4">
                      <Link to={`/product/${product.id}`}>
                        <h3 className="font-semibold text-stone-900 mb-1 hover:text-red-600 transition-colors duration-200">{product.name}</h3>
                      </Link>
                      <div className="flex items-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-sm transition-colors duration-200 ${
                              i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-stone-300'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                        <span className="ml-1 text-sm text-stone-600">({product.rating})</span>
                      </div>
                      <p className="text-lg font-bold text-stone-900 mb-3">₹{product.price.toLocaleString('en-IN')}</p>
                      <Button 
                        onClick={() => handleAddToCart(product)}
                        className="w-full bg-red-600 hover:bg-red-700 text-white transform hover:scale-105 transition-all duration-200"
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;

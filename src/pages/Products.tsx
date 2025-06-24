
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import Header from '@/components/Header';
import { useCart } from '@/contexts/CartContext';

const Products = () => {
  const location = useLocation();
  const { addToCart } = useCart();
  const [priceRange, setPriceRange] = useState([500, 200000]);
  const [selectedCategory, setSelectedCategory] = useState('All');

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

  // All products data
  const allProducts = {
    laptops: [
      {
        id: 1,
        name: 'TechBook Pro 15',
        price: 97425,
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
        category: 'Laptop'
      },
      {
        id: 7,
        name: 'TechBook Air 13',
        price: 75325,
        image: 'https://images.unsplash.com/photo-1541807084-9913014e4c4d?w=400&h=300&fit=crop',
        category: 'Laptop'
      },
      {
        id: 8,
        name: 'TechBook Gaming X1',
        price: 134925,
        image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=300&fit=crop',
        category: 'Laptop'
      },
      {
        id: 9,
        name: 'TechBook Business Elite',
        price: 89175,
        image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=300&fit=crop',
        category: 'Laptop'
      }
    ],
    routers: [
      {
        id: 2,
        name: 'NetLink 6000',
        price: 11175,
        image: 'https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=400&h=300&fit=crop',
        category: 'Wi-Fi Router'
      },
      {
        id: 10,
        name: 'SpeedLink Pro',
        price: 18675,
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
        category: 'Wi-Fi Router'
      },
      {
        id: 11,
        name: 'UltraConnect 5G',
        price: 26175,
        image: 'https://images.unsplash.com/photo-1544717440-6d6866c37ef7?w=400&h=300&fit=crop',
        category: 'Wi-Fi Router'
      }
    ],
    pcs: [
      {
        id: 3,
        name: 'VisionDesk 27',
        price: 134925,
        image: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=400&h=300&fit=crop',
        category: 'All-in-One PC'
      },
      {
        id: 12,
        name: 'PowerStation 32',
        price: 186750,
        image: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=400&h=300&fit=crop',
        category: 'All-in-One PC'
      }
    ],
    ups: [
      {
        id: 4,
        name: 'PowerGuard 1000',
        price: 18675,
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop',
        category: 'UPS System'
      },
      {
        id: 13,
        name: 'PowerShield 1500',
        price: 26175,
        image: 'https://images.unsplash.com/photo-1580584126903-c17d41830450?w=400&h=300&fit=crop',
        category: 'UPS System'
      },
      {
        id: 14,
        name: 'PowerMax 2000',
        price: 37425,
        image: 'https://images.unsplash.com/photo-1558618047-fd3c8c5d17d0?w=400&h=300&fit=crop',
        category: 'UPS System'
      }
    ],
    components: [
      {
        id: 15,
        name: 'TechRAM 16GB DDR4',
        price: 7425,
        image: 'https://images.unsplash.com/photo-1555617778-5b5d3d8d5e6b?w=400&h=300&fit=crop',
        category: 'Component'
      },
      {
        id: 16,
        name: 'TechSSD 1TB NVMe',
        price: 14925,
        image: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=400&h=300&fit=crop',
        category: 'Component'
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

  const products = getProducts();

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
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-stone-600 mb-8">
          <Link to="/" className="text-red-600">Home</Link>
          <span>/</span>
          <Link to="/store" className="text-red-600">Store</Link>
          <span>/</span>
          <span>{getCategoryTitle()}</span>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <div className="w-80 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-stone-900 mb-4">{getCategoryTitle()}</h3>
              <div className="space-y-2">
                {subcategories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "ghost"}
                    className={`w-full justify-start ${
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
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="techshop">TechShop</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-stone-700 mb-4 block">Price Range</label>
                  <div className="px-2">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={200000}
                      min={5000}
                      step={1000}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-stone-600 mt-2">
                      <span>₹{priceRange[0].toLocaleString('en-IN')}</span>
                      <span>₹{priceRange[1].toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-stone-700 mb-2 block">Customer Ratings</label>
                  <Select>
                    <SelectTrigger className="w-full">
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
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-stone-900">Products</h2>
              <p className="text-stone-600">{products.length} products found</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300 border-stone-200">
                  <CardContent className="p-0">
                    <Link to={`/product/${product.id}`}>
                      <div className="aspect-square overflow-hidden rounded-t-lg bg-stone-100">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </Link>
                    <div className="p-4">
                      <Link to={`/product/${product.id}`}>
                        <h3 className="font-semibold text-stone-900 mb-1 hover:text-red-600 transition-colors">{product.name}</h3>
                      </Link>
                      <p className="text-lg font-bold text-stone-900 mb-3">₹{product.price.toLocaleString('en-IN')}</p>
                      <Button 
                        onClick={() => handleAddToCart(product)}
                        className="w-full bg-red-600 hover:bg-red-700 text-white"
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

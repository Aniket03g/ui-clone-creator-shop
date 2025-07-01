
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, ShoppingCart } from 'lucide-react';
import Header from '@/components/Header';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useToast } from '@/hooks/use-toast';

const Electronics = () => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();

  const electronicsProducts = [
    {
      id: 32,
      name: 'UltraView 27" 4K Monitor',
      price: 45000,
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop',
      category: 'Monitor',
      brand: 'TechShop',
      rating: 4.6,
      keyFeatures: ['4K Resolution', '27 Inch', 'IPS Panel']
    },
    {
      id: 33,
      name: 'Gaming Monitor 32"',
      price: 38000,
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop',
      category: 'Monitor',
      brand: 'TechShop',
      rating: 4.5,
      keyFeatures: ['144Hz Refresh', '32 Inch', 'Curved Display']
    },
    {
      id: 34,
      name: 'Mechanical Pro RGB Keyboard',
      price: 8500,
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=300&fit=crop',
      category: 'Keyboard',
      brand: 'TechShop',
      rating: 4.4,
      keyFeatures: ['Mechanical Keys', 'RGB Backlight', 'Wireless']
    },
    {
      id: 35,
      name: 'Compact Wireless Keyboard',
      price: 3500,
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=300&fit=crop',
      category: 'Keyboard',
      brand: 'TechShop',
      rating: 4.2,
      keyFeatures: ['Compact Design', 'Wireless', 'Long Battery']
    },
    {
      id: 36,
      name: 'Wireless Mouse Pro',
      price: 2500,
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop',
      category: 'Mouse',
      brand: 'TechShop',
      rating: 4.3,
      keyFeatures: ['Wireless', 'Ergonomic', 'Precision Sensor']
    },
    {
      id: 37,
      name: 'USB-C Hub',
      price: 4500,
      image: 'https://images.unsplash.com/photo-1558618047-fd3c8c5d17d0?w=400&h=300&fit=crop',
      category: 'Accessory',
      brand: 'TechShop',
      rating: 4.5,
      keyFeatures: ['7-in-1 Ports', 'USB-C', 'Compact Design']
    }
  ];

  const handleAddToCart = (product: any) => {
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

  const handleWishlistToggle = (product: any) => {
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
          <span>Electronics</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-stone-900 mb-4">Electronics</h1>
          <p className="text-stone-600">Discover our wide range of electronic accessories and peripherals</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {electronicsProducts.map((product, index) => (
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
                  <div className="mb-3">
                    {product.keyFeatures.map((feature, i) => (
                      <div key={i} className="text-xs text-stone-600 mb-1">• {feature}</div>
                    ))}
                  </div>
                  <p className="text-lg font-bold text-stone-900 mb-3">₹{product.price.toLocaleString('en-IN')}</p>
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default Electronics;

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useToast } from '@/hooks/use-toast';
import { Heart, ShoppingCart } from 'lucide-react';
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

const Category = () => {
  const { slug } = useParams<{ slug: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState('');
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();

  useEffect(() => {
    if (slug) {
      fetchProducts();
    }
  }, [slug]);

  const fetchProducts = async () => {
    if (!slug) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'published')
        .eq('product_type', slug as 'laptop' | 'software' | 'accessory' | 'component' | 'peripheral');

      if (error) {
        console.error('Error fetching products:', error);
        toast({
          title: "Error",
          description: "Failed to load products",
          variant: "destructive",
        });
      } else {
        setProducts(data || []);
        // Convert slug back to readable category name
        setCategoryName(slug.split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' '));
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-64 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <nav className="text-sm breadcrumbs mb-4">
          <ol className="list-none p-0 inline-flex">
            <li className="flex items-center">
              <Link to="/" className="text-blue-600 hover:text-blue-800">Home</Link>
              <span className="mx-2">/</span>
            </li>
            <li className="text-gray-500">{categoryName}</li>
          </ol>
        </nav>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{categoryName}</h1>
        <p className="text-gray-600">
          {products.length} {products.length === 1 ? 'product' : 'products'} found
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500 mb-4">We couldn't find any products in this category.</p>
          <Link to="/">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => {
            const productInWishlist = isInWishlist(parseInt(product.id) || 0);
            const brand = product.specifications?.brand;
            
            return (
              <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative">
                    <Link to={`/product/${product.id}`}>
                      <div className="aspect-square overflow-hidden bg-gray-100">
                        {product.images[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
                      size="sm"
                      className="absolute top-2 right-2 p-2 bg-white/80 hover:bg-white shadow-sm"
                      onClick={() => handleWishlistToggle(product)}
                    >
                      <Heart 
                        className={`h-4 w-4 ${productInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
                      />
                    </Button>
                  </div>
                  
                  <div className="p-4 space-y-3">
                    <Link to={`/product/${product.id}`}>
                      <h3 className="font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>
                    
                    {brand && (
                      <p className="text-sm text-gray-500">{brand}</p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-lg font-bold text-gray-900">
                          ₹{Number(product.price).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => handleAddToCart(product)}
                      className="w-full"
                      size="sm"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Category;
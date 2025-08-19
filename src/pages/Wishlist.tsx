
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, ShoppingCart } from 'lucide-react';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (item) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      category: item.category
    });
    toast({
      title: "Added to Cart",
      description: `${item.name} has been added to your cart.`,
    });
  };

  const handleRemoveFromWishlist = (item) => {
    removeFromWishlist(item.id);
    toast({
      title: "Removed from Wishlist",
      description: `${item.name} has been removed from your wishlist.`,
    });
  };

  return (
    <div className="min-h-screen bg-stone-50">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center space-x-2 text-sm text-stone-600 mb-8">
          <Link to="/" className="text-red-600">Home</Link>
          <span>/</span>
          <span>Wishlist</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-stone-900 mb-2">My Wishlist</h1>
          <p className="text-stone-600">{wishlistItems.length} items in your wishlist</p>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-stone-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-stone-900 mb-2">Your wishlist is empty</h2>
            <p className="text-stone-600 mb-6">Save items you love to your wishlist</p>
            <Link to="/store">
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                Continue Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <Card key={item.id} className="group hover:shadow-lg transition-shadow duration-300 border-stone-200">
                <CardContent className="p-0">
                  <div className="relative">
                    <Link to={`/product/${item.id}`}>
                      <div className="aspect-square overflow-hidden rounded-t-lg bg-stone-100">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white text-red-500"
                      onClick={() => handleRemoveFromWishlist(item)}
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </Button>
                  </div>
                  <div className="p-4">
                    <Link to={`/product/${item.id}`}>
                      <h3 className="font-semibold text-stone-900 mb-1 hover:text-red-600 transition-colors">{item.name}</h3>
                    </Link>
                    <p className="text-lg font-bold text-stone-900 mb-3">₹{item.price.toLocaleString('en-IN')}</p>
                    <div className="flex space-x-2">
                      <Button 
                        onClick={() => handleAddToCart(item)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;

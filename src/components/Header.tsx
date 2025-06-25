
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Search, Heart, User } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';

const Header = () => {
  const { getTotalItems } = useCart();
  const { getTotalWishlistItems } = useWishlist();
  const totalItems = getTotalItems();
  const totalWishlistItems = getTotalWishlistItems();

  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-bold text-stone-900">
              TechShop
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link to="/store" className="text-stone-700 hover:text-stone-900 transition-colors">
                Store
              </Link>
              <Link to="/laptops" className="text-stone-700 hover:text-stone-900 transition-colors">
                Laptops
              </Link>
              <Link to="/routers" className="text-stone-700 hover:text-stone-900 transition-colors">
                Wi-Fi Routers
              </Link>
              <Link to="/pcs" className="text-stone-700 hover:text-stone-900 transition-colors">
                All-in-One PCs
              </Link>
              <Link to="/ups" className="text-stone-700 hover:text-stone-900 transition-colors">
                UPS Systems
              </Link>
              <Link to="/components" className="text-stone-700 hover:text-stone-900 transition-colors">
                Components
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
              <Input
                type="search"
                placeholder="Search"
                className="pl-10 w-64 bg-stone-100 border-0 focus:bg-white transition-colors"
              />
            </div>
            <Link to="/wishlist">
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="w-5 h-5" />
                {totalWishlistItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalWishlistItems}
                  </span>
                )}
              </Button>
            </Link>
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>
            <Button variant="ghost" size="icon">
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

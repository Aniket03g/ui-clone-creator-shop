
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart, User, LogOut, Settings } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useUser } from '@/contexts/UserContext';
import SearchDropdown from './SearchDropdown';
import AuthDialog from './AuthDialog';

const Header = () => {
  const { getTotalItems } = useCart();
  const { getTotalWishlistItems } = useWishlist();
  const { user, logout, isAuthenticated } = useUser();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const navigate = useNavigate();
  
  const totalItems = getTotalItems();
  const totalWishlistItems = getTotalWishlistItems();

  const handleUserMenuClick = () => {
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      setShowAuthDialog(true);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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
            <SearchDropdown />
            
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

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5 text-sm font-medium">
                    Hello, {user?.firstName || 'User'}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <Settings className="w-4 h-4 mr-2" />
                    My Account
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="icon" onClick={handleUserMenuClick}>
                <User className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />
    </header>
  );
};

export default Header;

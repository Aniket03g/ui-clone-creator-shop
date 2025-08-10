import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart, User, Search, Menu, ChevronDown, Heart } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useUser } from '@/contexts/UserContext';
import { useAuth } from '@/contexts/AuthContext';
import AuthDialog from './AuthDialog';

// Updated category data structure focused on tech/hardware
const categories = {
  'Laptops & Computers': [
    'Gaming Laptops',
    'Business Laptops',
    'Desktop PCs',
    'All-in-One PCs',
    '2-in-1 Laptops',
    'Workstations',
    'Mini PCs',
    'Refurbished Systems'
  ],
  'Computer Components': [
    'Processors (CPUs)',
    'Graphics Cards (GPUs)',
    'Memory (RAM)',
    'Storage (SSD/HDD)',
    'Motherboards',
    'Power Supplies',
    'Cooling Systems',
    'Computer Cases'
  ],
  'Networking & Internet': [
    'Wi-Fi Routers',
    'Modems',
    'Network Switches',
    'Access Points',
    'Network Cables',
    'Firewalls',
    'VPN Hardware',
    'Mesh Systems'
  ],
  'Power & UPS': [
    'UPS Systems',
    'Power Strips',
    'Surge Protectors',
    'Battery Backups',
    'Voltage Stabilizers',
    'Power Inverters',
    'Solar Power Systems',
    'Power Cables'
  ],
  'Software & Licenses': [
    'Microsoft Office 365',
    'Windows Operating System',
    'Antivirus Software',
    'Business Software',
    'Design Software',
    'Development Tools',
    'Productivity Apps',
    'Security Software'
  ],
  'Accessories & Peripherals': [
    'Keyboards & Mice',
    'Monitors & Displays',
    'Webcams',
    'Speakers & Headsets',
    'External Storage',
    'Cables & Adapters',
    'Docking Stations',
    'Printer & Scanners'
  ]
};

const AmazonHeader = () => {
  const { getTotalItems } = useCart();
  const { getTotalWishlistItems } = useWishlist();
  const { isAuthenticated, user: oldUser, logout } = useUser();
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('All');
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Laptops & Computers');
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const allButtonRef = useRef<HTMLButtonElement>(null);
  
  const totalItems = getTotalItems();
  const totalWishlistItems = getTotalWishlistItems();

  // Handle mouse enter/leave for mega menu
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (
        megaMenuRef.current && 
        allButtonRef.current &&
        !megaMenuRef.current.contains(e.relatedTarget as Node) &&
        !allButtonRef.current.contains(e.relatedTarget as Node)
      ) {
        setShowMegaMenu(false);
      }
    };

    if (showMegaMenu) {
      document.addEventListener('mouseleave', handleMouseLeave);
      return () => document.removeEventListener('mouseleave', handleMouseLeave);
    }
  }, [showMegaMenu]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleCategoryClick = (category: string) => {
    navigate(`/${category.toLowerCase().replace(/\s+/g, '-')}`);
    setShowMegaMenu(false);
  };

  const handleSubcategoryClick = (subcategory: string) => {
    navigate(`/search?q=${encodeURIComponent(subcategory)}`);
    setShowMegaMenu(false);
  };

  const handleAccountClick = () => {
    if (user) {
      navigate('/profile');
    } else {
      navigate('/auth');
    }
  };

  return (
    <>
      <header className="bg-gradient-to-r from-stone-800 to-stone-900 text-white sticky top-0 z-50 shadow-lg">
        {/* Top Bar with Search */}
        <div className="bg-gradient-to-r from-stone-800 to-stone-900 border-b border-stone-600">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center h-16 space-x-4">
              {/* Logo */}
              <Link to="/" className="text-2xl font-bold text-white hover:text-red-400 transition-colors flex-shrink-0">
                TechShop
              </Link>

              {/* Search Bar */}
              <div className="flex-1 max-w-3xl mx-4">
                <form onSubmit={handleSearch} className="flex shadow-lg">
                  {/* Category Dropdown */}
                  <div className="relative">
                    <Select value={searchCategory} onValueChange={setSearchCategory}>
                      <SelectTrigger className="w-16 h-12 rounded-l-lg rounded-r-none border-r-0 bg-stone-100 text-stone-900 text-sm font-medium hover:bg-stone-200 transition-colors">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-stone-300 shadow-xl">
                        <SelectItem value="All">All</SelectItem>
                        {Object.keys(categories).map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Search Input */}
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search TechShop for products..."
                    className="flex-1 h-12 px-4 text-stone-900 border-0 focus:outline-none focus:ring-2 focus:ring-red-400 bg-white"
                  />

                  {/* Search Button */}
                  <Button
                    type="submit"
                    className="h-12 px-6 bg-red-600 hover:bg-red-700 text-white rounded-l-none rounded-r-lg transition-colors shadow-md"
                  >
                    <Search className="w-5 h-5" />
                  </Button>
                </form>
              </div>

              {/* Right Side - Account, Wishlist & Cart */}
              <div className="flex items-center space-x-6">
                {/* Account */}
                {user ? (
                  <div className="relative group">
                    <button className="text-sm hover:text-red-400 transition-colors cursor-pointer">
                      <div className="flex items-center space-x-2">
                        <User className="w-5 h-5" />
                        <div>
                          <div className="text-xs opacity-90">Hello, {user.user_metadata?.first_name || user.email?.split('@')[0]}</div>
                          <div className="font-semibold">Account</div>
                        </div>
                      </div>
                    </button>
                    <div className="absolute top-full right-0 bg-white border shadow-lg py-2 px-4 text-black text-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all rounded">
                      {isAdmin && (
                        <Link to="/admin/add-product" className="block py-1 hover:text-red-600 whitespace-nowrap">
                          Admin Panel
                        </Link>
                      )}
                      <Link to="/profile" className="block py-1 hover:text-red-600">Profile</Link>
                      <button onClick={signOut} className="block py-1 hover:text-red-600 text-left w-full">
                        Sign Out
                      </button>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={handleAccountClick}
                    className="text-sm hover:text-red-400 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-2">
                      <User className="w-5 h-5" />
                      <div>
                        <div className="text-xs opacity-90">Hello, Sign in</div>
                        <div className="font-semibold">Account</div>
                      </div>
                    </div>
                  </button>
                )}

                {/* Wishlist */}
                <Link to="/wishlist" className="flex items-center space-x-2 hover:text-red-400 transition-colors relative">
                  <Heart className="w-6 h-6" />
                  <span className="font-semibold">Wishlist</span>
                  {totalWishlistItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {totalWishlistItems}
                    </span>
                  )}
                </Link>

                {/* Cart */}
                <Link to="/cart" className="flex items-center space-x-2 hover:text-red-400 transition-colors relative">
                  <ShoppingCart className="w-6 h-6" />
                  <span className="font-semibold">Cart</span>
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {totalItems}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Main Navigation */}
        <div className="bg-stone-700">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center h-12 space-x-8">
              {/* All Button with Mega Menu */}
              <div className="relative">
                <button
                  ref={allButtonRef}
                  onMouseEnter={() => setShowMegaMenu(true)}
                  className="flex items-center space-x-2 px-4 py-2 text-white hover:text-red-400 transition-colors border border-stone-500 rounded-lg hover:border-red-400 hover:bg-stone-600"
                >
                  <Menu className="w-4 h-4" />
                  <span className="font-medium">All Categories</span>
                </button>

                {/* Mega Menu */}
                {showMegaMenu && (
                  <div
                    ref={megaMenuRef}
                    onMouseLeave={() => setShowMegaMenu(false)}
                    className="absolute top-full left-0 w-screen max-w-5xl bg-white text-stone-900 shadow-2xl border border-stone-300 z-50 animate-slide-up rounded-lg mt-2"
                    style={{ marginLeft: '-16px' }}
                  >
                    <div className="flex rounded-lg overflow-hidden">
                      {/* Left Section - Categories */}
                      <div className="w-1/3 bg-stone-50 border-r border-stone-200">
                        <div className="p-6">
                          <h3 className="font-bold text-xl mb-4 text-stone-900">Shop by Category</h3>
                          <ul className="space-y-1">
                            {Object.keys(categories).map(category => (
                              <li key={category}>
                                <button
                                  onMouseEnter={() => setActiveCategory(category)}
                                  onClick={() => handleCategoryClick(category)}
                                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                                    activeCategory === category
                                      ? 'bg-red-100 text-red-800 font-medium border-l-4 border-red-600'
                                      : 'hover:bg-stone-100 text-stone-700 hover:text-red-600'
                                  }`}
                                >
                                  {category}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Right Section - Subcategories */}
                      <div className="w-2/3 p-6 bg-white">
                        <h3 className="font-bold text-xl mb-4 text-stone-900 border-b border-stone-200 pb-2">{activeCategory}</h3>
                        <div className="grid grid-cols-2 gap-3">
                          {categories[activeCategory as keyof typeof categories]?.map(subcategory => (
                            <button
                              key={subcategory}
                              onClick={() => handleSubcategoryClick(subcategory)}
                              className="text-left px-4 py-3 text-stone-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors border border-transparent hover:border-red-200"
                            >
                              {subcategory}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Other Navigation Links */}
              <Link to="/deals" className="text-white hover:text-red-400 transition-colors font-medium">
                Today's Deals
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Auth Dialog */}
      <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />
    </>
  );
};

export default AmazonHeader;

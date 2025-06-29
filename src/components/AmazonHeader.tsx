import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart, User, Search, Menu, ChevronDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCart } from '@/contexts/CartContext';
import { useUser } from '@/contexts/UserContext';

// Category data structure
const categories = {
  'Electronics': [
    'Mobile Phones',
    'Laptops & Computers',
    'Tablets',
    'Cameras & Photography',
    'Audio & Headphones',
    'Smart Home',
    'Gaming',
    'Wearable Technology'
  ],
  'Books': [
    'Fiction',
    'Non-Fiction',
    'Textbooks',
    'Business & Economics',
    'Self-Help',
    'Children\'s Books',
    'Comics & Graphic Novels',
    'Educational & Professional'
  ],
  'Clothing': [
    'Women\'s Fashion',
    'Men\'s Fashion',
    'Kids & Baby',
    'Shoes',
    'Accessories',
    'Jewelry',
    'Watches',
    'Bags & Luggage'
  ],
  'Home & Garden': [
    'Kitchen & Dining',
    'Home Decor',
    'Furniture',
    'Garden & Outdoor',
    'Tools & Hardware',
    'Bedding & Bath',
    'Storage & Organization',
    'Appliances'
  ],
  'Sports & Outdoors': [
    'Exercise & Fitness',
    'Outdoor Recreation',
    'Sports Equipment',
    'Water Sports',
    'Winter Sports',
    'Team Sports',
    'Golf',
    'Cycling'
  ],
  'Health & Beauty': [
    'Skincare',
    'Makeup & Cosmetics',
    'Hair Care',
    'Personal Care',
    'Health Supplements',
    'Medical Supplies',
    'Fragrances',
    'Oral Care'
  ]
};

const AmazonHeader = () => {
  const { getTotalItems } = useCart();
  const { isAuthenticated, user } = useUser();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('All');
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Electronics');
  
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const allButtonRef = useRef<HTMLButtonElement>(null);
  
  const totalItems = getTotalItems();

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

  return (
    <header className="bg-slate-900 text-white sticky top-0 z-50">
      {/* Top Bar with Search */}
      <div className="bg-slate-900 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center h-16 space-x-4">
            {/* Logo */}
            <Link to="/" className="text-2xl font-bold text-white hover:text-orange-400 transition-colors flex-shrink-0">
              TechShop
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-3xl mx-4">
              <form onSubmit={handleSearch} className="flex">
                {/* Category Dropdown */}
                <div className="relative">
                  <Select value={searchCategory} onValueChange={setSearchCategory}>
                    <SelectTrigger className="w-16 h-10 rounded-l-md rounded-r-none border-r-0 bg-slate-200 text-slate-900 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
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
                  placeholder="Search TechShop"
                  className="flex-1 h-10 px-4 text-slate-900 border-0 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />

                {/* Search Button */}
                <Button
                  type="submit"
                  className="h-10 px-4 bg-orange-400 hover:bg-orange-500 text-slate-900 rounded-l-none rounded-r-md"
                >
                  <Search className="w-5 h-5" />
                </Button>
              </form>
            </div>

            {/* Right Side - Account & Cart */}
            <div className="flex items-center space-x-4">
              {/* Account */}
              <Link to={isAuthenticated ? "/profile" : "/login"} className="text-sm hover:text-orange-400 transition-colors">
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <div>
                    <div className="text-xs">Hello, {isAuthenticated ? user?.firstName : 'Sign in'}</div>
                    <div className="font-semibold">Account</div>
                  </div>
                </div>
              </Link>

              {/* Cart */}
              <Link to="/cart" className="flex items-center space-x-1 hover:text-orange-400 transition-colors relative">
                <ShoppingCart className="w-6 h-6" />
                <span className="font-semibold">Cart</span>
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-400 text-slate-900 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Main Navigation */}
      <div className="bg-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center h-12 space-x-6">
            {/* All Button with Mega Menu */}
            <div className="relative">
              <button
                ref={allButtonRef}
                onMouseEnter={() => setShowMegaMenu(true)}
                className="flex items-center space-x-2 px-3 py-2 text-white hover:text-orange-400 transition-colors border border-slate-600 rounded hover:border-orange-400"
              >
                <Menu className="w-4 h-4" />
                <span className="font-medium">All</span>
              </button>

              {/* Mega Menu */}
              {showMegaMenu && (
                <div
                  ref={megaMenuRef}
                  onMouseLeave={() => setShowMegaMenu(false)}
                  className="absolute top-full left-0 w-screen max-w-4xl bg-white text-slate-900 shadow-2xl border border-slate-200 z-50 animate-slide-up"
                  style={{ marginLeft: '-16px' }}
                >
                  <div className="flex">
                    {/* Left Section - Categories */}
                    <div className="w-1/3 bg-slate-50 border-r border-slate-200">
                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-4 text-slate-900">Shop by Category</h3>
                        <ul className="space-y-2">
                          {Object.keys(categories).map(category => (
                            <li key={category}>
                              <button
                                onMouseEnter={() => setActiveCategory(category)}
                                onClick={() => handleCategoryClick(category)}
                                className={`w-full text-left px-3 py-2 rounded transition-colors ${
                                  activeCategory === category
                                    ? 'bg-orange-100 text-orange-800 font-medium'
                                    : 'hover:bg-slate-100 text-slate-700'
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
                    <div className="w-2/3 p-4">
                      <h3 className="font-bold text-lg mb-4 text-slate-900">{activeCategory}</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {categories[activeCategory as keyof typeof categories]?.map(subcategory => (
                          <button
                            key={subcategory}
                            onClick={() => handleSubcategoryClick(subcategory)}
                            className="text-left px-3 py-2 text-slate-700 hover:bg-slate-100 hover:text-orange-600 rounded transition-colors"
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
            <Link to="/deals" className="text-white hover:text-orange-400 transition-colors">
              Today's Deals
            </Link>
            <Link to="/customer-service" className="text-white hover:text-orange-400 transition-colors">
              Customer Service
            </Link>
            <Link to="/gift-cards" className="text-white hover:text-orange-400 transition-colors">
              Gift Cards
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AmazonHeader;

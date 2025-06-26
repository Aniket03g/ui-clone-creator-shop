
import React, { useState, useRef, useEffect } from 'react';
import { Search, ShoppingCart, Heart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSearch } from '@/contexts/SearchContext';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useNavigate } from 'react-router-dom';

const SearchDropdown = () => {
  const { searchQuery, setSearchQuery, searchResults, setSearchResults } = useSearch();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Mock products data
  const mockProducts = [
    { id: 1, name: "MacBook Pro M3", price: 1999, category: "Laptops", image: "/placeholder.svg" },
    { id: 2, name: "ASUS ROG Strix", price: 1599, category: "Laptops", image: "/placeholder.svg" },
    { id: 3, name: "NETGEAR Nighthawk", price: 299, category: "Wi-Fi Routers", image: "/placeholder.svg" },
    { id: 4, name: "TP-Link Archer", price: 89, category: "Wi-Fi Routers", image: "/placeholder.svg" },
    { id: 5, name: "iMac 24-inch", price: 1299, category: "All-in-One PCs", image: "/placeholder.svg" },
    { id: 6, name: "HP Pavilion All-in-One", price: 799, category: "All-in-One PCs", image: "/placeholder.svg" },
  ];

  const performSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const results = mockProducts.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
      setIsLoading(false);
    }, 300);
  };

  useEffect(() => {
    performSearch(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsOpen(false);
    }
  };

  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <form onSubmit={handleSearchSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
        <Input
          type="search"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="pl-10 w-64 bg-stone-100 border-0 focus:bg-white transition-colors"
        />
      </form>

      {isOpen && (searchQuery.trim() || searchResults.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-stone-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-stone-500">Searching...</div>
          ) : searchResults.length > 0 ? (
            <div className="py-2">
              {searchResults.slice(0, 5).map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 hover:bg-stone-50 cursor-pointer"
                  onClick={() => handleProductClick(product.id)}
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium text-stone-900">{product.name}</p>
                      <p className="text-sm text-stone-500">{product.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-stone-900">${product.price}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToWishlist(product);
                      }}
                      className="h-8 w-8"
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      className="h-8 w-8"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {searchResults.length > 5 && (
                <div className="p-3 border-t">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                      setIsOpen(false);
                    }}
                  >
                    View all {searchResults.length} results
                  </Button>
                </div>
              )}
            </div>
          ) : searchQuery.trim() ? (
            <div className="p-4 text-center text-stone-500">
              No products found for "{searchQuery}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchDropdown;

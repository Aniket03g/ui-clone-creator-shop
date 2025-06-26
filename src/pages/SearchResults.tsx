
import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart } from 'lucide-react';
import Header from '@/components/Header';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useToast } from '@/hooks/use-toast';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();
  const [searchResults, setSearchResults] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // All products data (same as in Products.tsx)
  const allProducts = {
    laptops: [
      {
        id: 1,
        name: 'TechBook Pro 15',
        price: 97425,
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
        category: 'Laptop',
        brand: 'TechShop',
        rating: 4.5,
        description: 'High-performance laptop for professionals'
      },
      {
        id: 7,
        name: 'TechBook Air 13',
        price: 75325,
        image: 'https://images.unsplash.com/photo-1541807084-9913014e4c4d?w=400&h=300&fit=crop',
        category: 'Laptop',
        brand: 'TechShop',
        rating: 4.3,
        description: 'Lightweight and portable laptop'
      },
      {
        id: 8,
        name: 'TechBook Gaming X1',
        price: 134925,
        image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=300&fit=crop',
        category: 'Laptop',
        brand: 'TechShop',
        rating: 4.7,
        description: 'Gaming laptop with powerful graphics'
      },
      {
        id: 17,
        name: 'Dell Inspiron 15',
        price: 65000,
        image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&h=300&fit=crop',
        category: 'Laptop',
        brand: 'Dell',
        rating: 4.2,
        description: 'Reliable everyday laptop'
      },
      {
        id: 18,
        name: 'HP Pavilion 14',
        price: 55000,
        image: 'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=400&h=300&fit=crop',
        category: 'Laptop',
        brand: 'HP',
        rating: 4.1,
        description: 'Compact laptop for students'
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
        rating: 4.4,
        description: 'High-speed Wi-Fi router'
      },
      {
        id: 21,
        name: 'TP-Link Archer AX73',
        price: 15000,
        image: 'https://images.unsplash.com/photo-1558618047-fd3c8c5d17d0?w=400&h=300&fit=crop',
        category: 'Wi-Fi Router',
        brand: 'TP-Link',
        rating: 4.3,
        description: 'Advanced Wi-Fi 6 router'
      }
    ],
    components: [
      {
        id: 30,
        name: 'NVIDIA RTX 4060',
        price: 85000,
        image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&h=300&fit=crop',
        category: 'Component',
        brand: 'NVIDIA',
        rating: 4.9,
        description: 'High-performance graphics card'
      },
      {
        id: 31,
        name: 'AMD Ryzen 7 5800X',
        price: 32000,
        image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=400&h=300&fit=crop',
        category: 'Component',
        brand: 'AMD',
        rating: 4.6,
        description: 'Powerful processor for gaming'
      }
    ]
  };

  const performSearch = (searchQuery) => {
    const allProductsList = Object.values(allProducts).flat();
    
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setRelatedProducts([]);
      return;
    }

    const searchTerms = searchQuery.toLowerCase().split(' ');
    
    // Find exact matches
    const exactMatches = allProductsList.filter(product => {
      const searchableText = `${product.name} ${product.category} ${product.brand} ${product.description || ''}`.toLowerCase();
      return searchTerms.every(term => searchableText.includes(term));
    });

    // Find partial matches
    const partialMatches = allProductsList.filter(product => {
      const searchableText = `${product.name} ${product.category} ${product.brand} ${product.description || ''}`.toLowerCase();
      return searchTerms.some(term => searchableText.includes(term)) && !exactMatches.find(exact => exact.id === product.id);
    });

    // Get related products (same category or brand as search results)
    const categories = [...new Set([...exactMatches, ...partialMatches].map(p => p.category))];
    const brands = [...new Set([...exactMatches, ...partialMatches].map(p => p.brand))];
    
    const related = allProductsList.filter(product => {
      const isInResults = [...exactMatches, ...partialMatches].find(result => result.id === product.id);
      return !isInResults && (categories.includes(product.category) || brands.includes(product.brand));
    }).slice(0, 4);

    setSearchResults([...exactMatches, ...partialMatches]);
    setRelatedProducts(related);
  };

  useEffect(() => {
    performSearch(query);
  }, [query]);

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
          <span>Search Results</span>
        </div>

        {/* Search Query Display */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-stone-900 mb-2">
            Search Results for "{query}"
          </h1>
          <p className="text-stone-600">
            {searchResults.length} product{searchResults.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {searchResults.length === 0 && query ? (
          <div className="text-center py-12 animate-fade-in">
            <p className="text-stone-600 text-lg">No products found for "{query}"</p>
            <p className="text-stone-500 mt-2">Try searching with different keywords.</p>
          </div>
        ) : searchResults.length > 0 ? (
          <>
            {/* Search Results */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-stone-900 mb-6 animate-fade-in">Products</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((product, index) => (
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
                        <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-medium">
                          {product.category}
                        </div>
                      </div>
                      <div className="p-4">
                        <Link to={`/product/${product.id}`}>
                          <h3 className="font-semibold text-stone-900 mb-1 hover:text-red-600 transition-colors duration-200">{product.name}</h3>
                        </Link>
                        <p className="text-sm text-stone-600 mb-2">{product.description}</p>
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

            {/* Related Products */}
            {relatedProducts.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-stone-900 mb-6 animate-fade-in">Related Products</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {relatedProducts.map((product, index) => (
                    <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 border-stone-200 transform hover:-translate-y-2 animate-fade-in" style={{ animationDelay: `${(index + searchResults.length) * 50}ms` }}>
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
                          <div className="absolute top-2 left-2 bg-stone-600 text-white px-2 py-1 rounded text-xs font-medium">
                            {product.category}
                          </div>
                        </div>
                        <div className="p-4">
                          <Link to={`/product/${product.id}`}>
                            <h3 className="font-semibold text-stone-900 mb-1 hover:text-red-600 transition-colors duration-200">{product.name}</h3>
                          </Link>
                          <p className="text-lg font-bold text-stone-900 mb-3">₹{product.price.toLocaleString('en-IN')}</p>
                          <Button 
                            onClick={() => handleAddToCart(product)}
                            className="w-full bg-red-600 hover:bg-red-700 text-white transform hover:scale-105 transition-all duration-200"
                            size="sm"
                          >
                            Add to Cart
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
};

export default SearchResults;


import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart, Search, Heart, User } from 'lucide-react';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const featuredProducts = [
    {
      id: 1,
      name: 'High-Performance Laptop',
      description: 'Experience lightning-fast processing and stunning visuals.',
      price: '$1,299',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=400&fit=crop',
      category: 'Laptops'
    },
    {
      id: 2,
      name: 'Next-Gen Wi-Fi Router',
      description: 'Boost your internet speed and coverage with our latest router.',
      price: '$199',
      image: 'https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=500&h=400&fit=crop',
      category: 'Wi-Fi Routers'
    },
    {
      id: 3,
      name: 'Sleek All-in-One PC',
      description: 'Combine power and elegance with our all-in-one PC.',
      price: '$899',
      image: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=500&h=400&fit=crop',
      category: 'All-in-One PCs'
    }
  ];

  const specialOffers = [
    {
      id: 1,
      title: 'Laptop Deals',
      description: 'Save up to 30% on select laptops.',
      image: 'https://images.unsplash.com/photo-1541807084-9913014e4c4d?w=400&h=300&fit=crop'
    },
    {
      id: 2,
      title: 'Router Discounts',
      description: 'Get 20% off on our top-rated routers.',
      image: 'https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=400&h=300&fit=crop'
    },
    {
      id: 3,
      title: 'PC Component Sale',
      description: 'Upgrade your PC with discounts on components.',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop'
    }
  ];

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-2xl font-bold text-stone-900">
                Tech Haven
              </Link>
              <nav className="hidden md:flex space-x-6">
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64 bg-stone-100 border-0 focus:bg-white transition-colors"
                />
              </div>
              <Button variant="ghost" size="icon">
                <Heart className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <ShoppingCart className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <User className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-stone-100 to-sage-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-stone-200 to-sage-100 p-12 md:p-16">
            <div className="absolute right-8 top-8 w-32 h-40 opacity-60">
              <img 
                src="https://images.unsplash.com/photo-1509909756405-be0199881695?w=200&h=300&fit=crop"
                alt="Plant decoration"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold text-stone-900 mb-6">
                Upgrade Your Tech Today
              </h1>
              <p className="text-lg text-stone-700 mb-8">
                Explore our wide range of laptops, routers, and PC components to enhance your digital experience.
              </p>
              <Button size="lg" className="bg-stone-800 hover:bg-stone-900 text-white px-8 py-3">
                Shop Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-stone-900 mb-12">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300 border-stone-200">
                <CardContent className="p-0">
                  <div className="aspect-[4/3] overflow-hidden rounded-t-lg">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-stone-900 mb-2">{product.name}</h3>
                    <p className="text-stone-600 mb-4">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-stone-900">{product.price}</span>
                      <Button variant="outline" className="border-stone-300 hover:bg-stone-50">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Special Offers */}
      <section className="py-16 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-stone-900 mb-12">Special Offers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {specialOffers.map((offer) => (
              <Card key={offer.id} className="group hover:shadow-lg transition-shadow duration-300 border-stone-200">
                <CardContent className="p-0">
                  <div className="aspect-[4/3] overflow-hidden rounded-t-lg">
                    <img
                      src={offer.image}
                      alt={offer.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-stone-900 mb-2">{offer.title}</h3>
                    <p className="text-stone-600 mb-4">{offer.description}</p>
                    <Button variant="outline" className="border-stone-300 hover:bg-stone-50">
                      Shop Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center space-x-8 mb-8">
            <Link to="/about" className="text-stone-600 hover:text-stone-900 transition-colors">
              About Us
            </Link>
            <Link to="/contact" className="text-stone-600 hover:text-stone-900 transition-colors">
              Contact
            </Link>
            <Link to="/support" className="text-stone-600 hover:text-stone-900 transition-colors">
              Support
            </Link>
            <Link to="/privacy" className="text-stone-600 hover:text-stone-900 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-stone-600 hover:text-stone-900 transition-colors">
              Terms of Service
            </Link>
          </div>
          <div className="text-center text-stone-500">
            <p>@2024 Tech Haven. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;


import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Star, ShoppingCart } from 'lucide-react';
import Header from '@/components/Header';
import DealsCarousel from '@/components/DealsCarousel';
import BestsellersCarousel from '@/components/BestsellersCarousel';
import CategoryGrid from '@/components/CategoryGrid';

const Index = () => {
  const featuredProducts = [
    {
      id: 1,
      name: 'High-Performance Laptop',
      description: 'Experience lightning-fast processing and stunning visuals.',
      price: 97425,
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=400&fit=crop',
      category: 'Laptops',
      rating: 4.5,
      tag: 'SALE'
    },
    {
      id: 2,
      name: 'Next-Gen Wi-Fi Router',
      description: 'Boost your internet speed and coverage with our latest router.',
      price: 11175,
      image: 'https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=500&h=400&fit=crop',
      category: 'Wi-Fi Routers',
      rating: 4.8,
      tag: 'NEW'
    },
    {
      id: 3,
      name: 'Sleek All-in-One PC',
      description: 'Combine power and elegance with our all-in-one PC.',
      price: 134925,
      image: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=500&h=400&fit=crop',
      category: 'All-in-One PCs',
      rating: 4.3,
      tag: null
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

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? 'fill-yellow-400 text-yellow-400'
            : i < rating
            ? 'fill-yellow-200 text-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />

      {/* Deals Carousel */}
      <section className="py-4 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <DealsCarousel />
        </div>
      </section>

      {/* Shop by Category Grid */}
      <section className="py-8 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CategoryGrid />
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-stone-100 to-sage-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-stone-200 to-sage-100 p-12 md:p-16 group hover:shadow-2xl transition-all duration-500">
            <div className="absolute right-8 top-8 w-32 h-40 opacity-60 transform group-hover:scale-110 transition-transform duration-500">
              <img 
                src="https://images.unsplash.com/photo-1509909756405-be0199881695?w=200&h=300&fit=crop"
                alt="Plant decoration"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div className="max-w-2xl transform group-hover:translate-x-2 transition-transform duration-500">
              <h1 className="text-4xl md:text-5xl font-bold text-stone-900 mb-6 animate-fade-in">
                Upgrade Your Tech Today
              </h1>
              <p className="text-lg text-stone-700 mb-8 animate-fade-in delay-100">
                Explore our wide range of laptops, routers, and PC components to enhance your digital experience.
              </p>
              <Link to="/store">
                <Button size="lg" className="bg-stone-800 hover:bg-stone-900 text-white px-8 py-3 transform hover:scale-105 transition-all duration-200 animate-fade-in delay-200">
                  Shop Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-stone-900 mb-12 animate-fade-in">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
              <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 border-stone-200 transform hover:-translate-y-2 animate-fade-in relative" style={{ animationDelay: `${index * 100}ms` }}>
                <CardContent className="p-0">
                  <div className="aspect-[4/3] overflow-hidden rounded-t-lg relative">
                    {product.tag && (
                      <div className={`absolute top-3 left-3 z-10 px-2 py-1 text-xs font-bold text-white rounded ${
                        product.tag === 'SALE' ? 'bg-red-500' : 'bg-green-500'
                      }`}>
                        {product.tag}
                      </div>
                    )}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-stone-900 mb-2">{product.name}</h3>
                    <div className="flex items-center mb-2">
                      {renderStars(product.rating)}
                      <span className="ml-2 text-sm text-stone-600">({product.rating})</span>
                    </div>
                    <p className="text-stone-600 mb-4">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-stone-900">₹{product.price.toLocaleString('en-IN')}</span>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="border-stone-300 hover:bg-stone-50">
                          <Heart className="w-4 h-4" />
                        </Button>
                        <Button size="sm" className="bg-stone-800 hover:bg-stone-900 text-white">
                          <ShoppingCart className="w-4 h-4 mr-1" />
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Bestsellers Section */}
      <section className="py-16 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BestsellersCarousel />
        </div>
      </section>

      {/* Special Offers */}
      <section className="py-16 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-stone-900 mb-12 animate-fade-in">Special Offers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {specialOffers.map((offer, index) => (
              <Card key={offer.id} className="group hover:shadow-xl transition-all duration-300 border-stone-200 transform hover:-translate-y-2 animate-fade-in" style={{ animationDelay: `${index * 150}ms` }}>
                <CardContent className="p-0">
                  <div className="aspect-[4/3] overflow-hidden rounded-t-lg">
                    <img
                      src={offer.image}
                      alt={offer.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-stone-900 mb-2 group-hover:text-red-600 transition-colors duration-200">{offer.title}</h3>
                    <p className="text-stone-600 mb-4">{offer.description}</p>
                    <Link to="/store">
                      <Button variant="outline" className="border-stone-300 hover:bg-stone-50 transform hover:scale-105 transition-all duration-200">
                        Shop Now
                      </Button>
                    </Link>
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
            <Link to="/about" className="text-stone-600 hover:text-stone-900 transition-colors hover:scale-105 transform duration-200">
              About Us
            </Link>
            <Link to="/contact" className="text-stone-600 hover:text-stone-900 transition-colors hover:scale-105 transform duration-200">
              Contact
            </Link>
            <Link to="/support" className="text-stone-600 hover:text-stone-900 transition-colors hover:scale-105 transform duration-200">
              Support
            </Link>
            <Link to="/privacy" className="text-stone-600 hover:text-stone-900 transition-colors hover:scale-105 transform duration-200">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-stone-600 hover:text-stone-900 transition-colors hover:scale-105 transform duration-200">
              Terms of Service
            </Link>
          </div>
          <div className="text-center text-stone-500">
            <p>©2024 TechShop. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

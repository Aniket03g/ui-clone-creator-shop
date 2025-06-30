
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Sparkles, Zap } from 'lucide-react';

const DealsCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const deals = [
    {
      id: 1,
      title: 'Flash Sale: Laptops up to 40% OFF',
      description: 'Limited time offer on premium laptops',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=400&fit=crop',
      discount: '40% OFF',
      bgGradient: 'from-red-500 via-red-600 to-red-700',
      accentColor: 'red',
      icon: Zap
    },
    {
      id: 2,
      title: 'Router Mega Deal: Buy 2 Get 1 Free',
      description: 'Upgrade your home network today',
      image: 'https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=800&h=400&fit=crop',
      discount: 'Buy 2 Get 1',
      bgGradient: 'from-blue-500 via-blue-600 to-blue-700',
      accentColor: 'blue',
      icon: Sparkles
    },
    {
      id: 3,
      title: 'PC Components: Massive Savings',
      description: 'Build your dream PC for less',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=400&fit=crop',
      discount: '30% OFF',
      bgGradient: 'from-green-500 via-green-600 to-green-700',
      accentColor: 'green',
      icon: Zap
    }
  ];

  useEffect(() => {
    if (!isHovered) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % deals.length);
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [deals.length, isHovered]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % deals.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + deals.length) % deals.length);
  };

  return (
    <div 
      className="relative overflow-hidden rounded-2xl shadow-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className="flex transition-all duration-700 ease-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {deals.map((deal, index) => {
          const IconComponent = deal.icon;
          const isActive = index === currentSlide;
          
          return (
            <div key={deal.id} className="w-full flex-shrink-0">
              <Card className="border-none overflow-hidden">
                <CardContent className="p-0">
                  <div className={`relative h-80 bg-gradient-to-br ${deal.bgGradient} overflow-hidden group`}>
                    {/* Animated background pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white/20 animate-pulse" />
                      <div className="absolute bottom-10 right-10 w-24 h-24 rounded-full bg-white/10 animate-pulse delay-500" />
                      <div className="absolute top-1/2 left-1/3 w-16 h-16 rounded-full bg-white/15 animate-pulse delay-1000" />
                    </div>
                    
                    {/* Floating particles */}
                    <div className="absolute inset-0 overflow-hidden">
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className={`absolute w-2 h-2 bg-white/30 rounded-full animate-bounce`}
                          style={{
                            left: `${20 + i * 15}%`,
                            top: `${30 + (i % 3) * 20}%`,
                            animationDelay: `${i * 0.2}s`,
                            animationDuration: '3s'
                          }}
                        />
                      ))}
                    </div>

                    {/* Main content */}
                    <div className="relative z-10 p-8 h-full flex items-center">
                      <div className="flex-1 max-w-2xl">
                        {/* Discount badge with animation */}
                        <div className={`inline-flex items-center gap-2 bg-white/95 backdrop-blur-sm rounded-full px-6 py-3 mb-6 shadow-lg transform transition-all duration-500 ${isActive ? 'scale-100 rotate-0' : 'scale-95 rotate-3'} hover:scale-105`}>
                          <IconComponent className={`w-5 h-5 text-${deal.accentColor}-600 animate-spin`} style={{ animationDuration: '3s' }} />
                          <span className={`text-${deal.accentColor}-700 font-bold text-lg`}>
                            {deal.discount}
                          </span>
                        </div>
                        
                        {/* Title with slide-in animation */}
                        <h3 className={`text-4xl md:text-5xl font-bold text-white mb-4 transform transition-all duration-700 ${isActive ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-70'}`}>
                          {deal.title}
                        </h3>
                        
                        {/* Description with fade-in animation */}
                        <p className={`text-white/90 text-lg mb-8 transform transition-all duration-700 delay-100 ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-70'}`}>
                          {deal.description}
                        </p>
                        
                        {/* CTA Button with hover effects */}
                        <Button className={`bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 text-lg font-semibold rounded-full shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-70'}`}>
                          Shop Now
                          <Sparkles className="w-5 h-5 ml-2 animate-pulse" />
                        </Button>
                      </div>
                      
                      {/* Product image with parallax effect */}
                      <div className="hidden md:block flex-1 relative">
                        <div className={`absolute right-0 top-1/2 -translate-y-1/2 w-80 h-60 rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-700 ${isActive ? 'scale-100 rotate-0' : 'scale-95 rotate-2'} hover:scale-105`}>
                          <img 
                            src={deal.image} 
                            alt={deal.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
      
      {/* Navigation buttons with improved design */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 rounded-full w-12 h-12 shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl"
        onClick={prevSlide}
      >
        <ChevronLeft className="w-6 h-6" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 rounded-full w-12 h-12 shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl"
        onClick={nextSlide}
      >
        <ChevronRight className="w-6 h-6" />
      </Button>
      
      {/* Enhanced slide indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3">
        {deals.map((_, index) => (
          <button
            key={index}
            className={`transition-all duration-500 rounded-full ${
              index === currentSlide 
                ? 'bg-white w-10 h-3 shadow-lg' 
                : 'bg-white/50 w-3 h-3 hover:bg-white/70 hover:scale-110'
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default DealsCarousel;


import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DealsCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const deals = [
    {
      id: 1,
      title: 'Flash Sale: Laptops up to 40% OFF',
      description: 'Limited time offer on premium laptops',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=400&fit=crop',
      discount: '40% OFF',
      bgColor: 'from-red-500 to-red-600'
    },
    {
      id: 2,
      title: 'Router Mega Deal: Buy 2 Get 1 Free',
      description: 'Upgrade your home network today',
      image: 'https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=800&h=400&fit=crop',
      discount: 'Buy 2 Get 1',
      bgColor: 'from-blue-500 to-blue-600'
    },
    {
      id: 3,
      title: 'PC Components: Massive Savings',
      description: 'Build your dream PC for less',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=400&fit=crop',
      discount: '30% OFF',
      bgColor: 'from-green-500 to-green-600'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % deals.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [deals.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % deals.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + deals.length) % deals.length);
  };

  return (
    <div className="relative overflow-hidden rounded-xl">
      <div 
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {deals.map((deal) => (
          <div key={deal.id} className="w-full flex-shrink-0">
            <Card className="border-none">
              <CardContent className="p-0">
                <div className={`relative h-64 bg-gradient-to-r ${deal.bgColor} overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute right-0 top-0 w-1/2 h-full opacity-30">
                    <img 
                      src={deal.image} 
                      alt={deal.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="relative z-10 p-8 h-full flex flex-col justify-center">
                    <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4 text-white font-bold text-lg w-fit">
                      {deal.discount}
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-2">{deal.title}</h3>
                    <p className="text-white/90 mb-6">{deal.description}</p>
                    <Button className="bg-white text-gray-900 hover:bg-gray-100 w-fit">
                      Shop Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 rounded-full"
        onClick={prevSlide}
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 rounded-full"
        onClick={nextSlide}
      >
        <ChevronRight className="w-5 h-5" />
      </Button>
      
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {deals.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-white w-6' : 'bg-white/50'
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default DealsCarousel;

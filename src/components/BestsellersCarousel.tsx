
import { Star, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const BestsellersCarousel = () => {
  const bestsellers = [
    {
      id: 1,
      name: 'UltraBook Pro Max',
      price: 125000,
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=200&fit=crop',
      rating: 4.9,
      tag: 'BESTSELLER'
    },
    {
      id: 2,
      name: 'Gaming Router X1',
      price: 15999,
      image: 'https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=300&h=200&fit=crop',
      rating: 4.7,
      tag: 'HOT'
    },
    {
      id: 3,
      name: 'Professional Monitor 32"',
      price: 45000,
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300&h=200&fit=crop',
      rating: 4.6,
      tag: null
    },
    {
      id: 4,
      name: 'Workstation Desktop',
      price: 89999,
      image: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=300&h=200&fit=crop',
      rating: 4.8,
      tag: 'POPULAR'
    },
    {
      id: 5,
      name: 'High-Speed SSD 2TB',
      price: 25999,
      image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=300&h=200&fit=crop',
      rating: 4.5,
      tag: null
    },
    {
      id: 6,
      name: 'Mechanical Keyboard',
      price: 8999,
      image: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=300&h=200&fit=crop',
      rating: 4.4,
      tag: 'NEW'
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
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
    <div>
      <h2 className="text-3xl font-bold text-stone-900 mb-8 animate-fade-in">Our Bestsellers</h2>
      
      <div className="relative">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex w-max space-x-6 pb-4">
            {bestsellers.map((product) => (
              <Card key={product.id} className="w-72 group hover:shadow-xl transition-all duration-300 border-stone-200 transform hover:-translate-y-2 flex-none">
                <CardContent className="p-0">
                  <div className="aspect-[3/2] overflow-hidden rounded-t-lg relative">
                    {product.tag && (
                      <div className={`absolute top-2 left-2 z-10 px-2 py-1 text-xs font-bold text-white rounded ${
                        product.tag === 'BESTSELLER' ? 'bg-purple-500' :
                        product.tag === 'HOT' ? 'bg-red-500' :
                        product.tag === 'POPULAR' ? 'bg-blue-500' : 'bg-green-500'
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
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-stone-900 mb-2 truncate">{product.name}</h3>
                    <div className="flex items-center mb-3">
                      <div className="flex items-center">
                        {renderStars(product.rating)}
                      </div>
                      <span className="ml-2 text-sm text-stone-600">({product.rating})</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-stone-900">₹{product.price.toLocaleString('en-IN')}</span>
                      <Button size="sm" className="bg-stone-800 hover:bg-stone-900 text-white transform hover:scale-105 transition-all duration-200">
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
};

export default BestsellersCarousel;

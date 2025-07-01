
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

const CategoryGrid = () => {
  const categories = [
    {
      name: 'Laptops',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=400&fit=crop',
      link: '/laptops',
      gradient: 'from-blue-500/80 to-purple-600/80'
    },
    {
      name: 'Routers',
      image: 'https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=600&h=400&fit=crop',
      link: '/routers',
      gradient: 'from-green-500/80 to-teal-600/80'
    },
    {
      name: 'Monitors',
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop',
      link: '/electronics',
      gradient: 'from-orange-500/80 to-red-600/80'
    },
    {
      name: 'PC Components',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop',
      link: '/components',
      gradient: 'from-purple-500/80 to-pink-600/80'
    }
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold text-stone-900 mb-8 animate-fade-in">Shop by Category</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <Link key={category.name} to={category.link}>
            <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 animate-fade-in cursor-pointer" style={{ animationDelay: `${index * 100}ms` }}>
              <CardContent className="p-0 relative h-48">
                <div className="absolute inset-0">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} group-hover:opacity-90 transition-opacity duration-300`} />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center transform group-hover:scale-110 transition-transform duration-300">
                    <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
                      {category.name}
                    </h3>
                    <div className="w-12 h-0.5 bg-white mx-auto group-hover:w-20 transition-all duration-300" />
                  </div>
                </div>
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid;

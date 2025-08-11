
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

const CategoryGrid = () => {
  const categories = [
    {
      name: 'Laptops',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=300&fit=crop',
      link: '/category/laptops',
      gradient: 'from-slate-600 to-slate-800'
    },
    {
      name: 'Routers',
      image: 'https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=500&h=300&fit=crop',
      link: '/category/routers',
      gradient: 'from-blue-600 to-blue-800'
    },
    {
      name: 'Monitors',
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=300&fit=crop',
      link: '/category/monitors',
      gradient: 'from-purple-600 to-purple-800'
    },
    {
      name: 'PC Components',
      image: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f?w=500&h=300&fit=crop',
      link: '/category/pc-components',
      gradient: 'from-green-600 to-green-800'
    }
  ];

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-stone-900 mb-6 animate-fade-in">Shop by Category</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((category, index) => (
          <Link key={category.name} to={category.link}>
            <Card className="group hover:shadow-xl transition-all duration-300 border-stone-200 transform hover:-translate-y-1 animate-fade-in overflow-hidden" style={{ animationDelay: `${index * 100}ms` }}>
              <CardContent className="p-0 relative">
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${category.gradient} opacity-60 group-hover:opacity-70 transition-opacity duration-300`}></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-white text-lg font-bold text-center px-4 transform group-hover:scale-105 transition-transform duration-300">
                      {category.name}
                    </h3>
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

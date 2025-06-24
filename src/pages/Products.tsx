
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { ShoppingCart, Search, Heart, User, ChevronDown } from 'lucide-react';

const Products = () => {
  const [priceRange, setPriceRange] = useState([500, 2000]);
  const [selectedCategory, setSelectedCategory] = useState('All Laptops');

  const products = [
    {
      id: 1,
      name: 'Tech Haven ProBook 450 G8',
      price: '$1,299',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
      category: 'Laptop'
    },
    {
      id: 2,
      name: 'Tech Haven EliteBook 840 G9',
      price: '$1,599',
      image: 'https://images.unsplash.com/photo-1541807084-9913014e4c4d?w=400&h=300&fit=crop',
      category: 'Laptop'
    },
    {
      id: 3,
      name: 'Tech Haven Spectre x360',
      price: '$1,399',
      image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=300&fit=crop',
      category: 'Laptop'
    },
    {
      id: 4,
      name: 'Tech Haven Envy 13',
      price: '$999',
      image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=300&fit=crop',
      category: 'Laptop'
    },
    {
      id: 5,
      name: 'Tech Haven Pavilion 15',
      price: '$799',
      image: 'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=400&h=300&fit=crop',
      category: 'Laptop'
    },
    {
      id: 6,
      name: 'Tech Haven Omen 16',
      price: '$1,799',
      image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=300&fit=crop',
      category: 'Laptop'
    }
  ];

  const categories = [
    'All Laptops',
    'Gaming Laptops',
    'Business Laptops',
    '2-in-1 Laptops',
    'Chromebooks'
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
                <Link to="/store" className="text-red-600 font-medium">Store</Link>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-stone-600 mb-8">
          <Link to="/store" className="text-red-600">Store</Link>
          <span>/</span>
          <span>Laptops</span>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <div className="w-80 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-stone-900 mb-4">Laptops</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "ghost"}
                    className={`w-full justify-start ${
                      selectedCategory === category 
                        ? "bg-stone-200 text-stone-900" 
                        : "text-stone-700 hover:bg-stone-100"
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-stone-900 mb-4">Filters</h4>
              
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-stone-700 mb-2 block">Brand</label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="tech-haven">Tech Haven</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-stone-700 mb-4 block">Price Range</label>
                  <div className="px-2">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={3000}
                      min={200}
                      step={50}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-stone-600 mt-2">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-stone-700 mb-2 block">Specifications</label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="intel-i5">Intel i5</SelectItem>
                      <SelectItem value="intel-i7">Intel i7</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-stone-700 mb-2 block">Customer Ratings</label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="4-plus">4+ Stars</SelectItem>
                      <SelectItem value="5">5 Stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-stone-900">Products</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300 border-stone-200">
                  <CardContent className="p-0">
                    <div className="aspect-square overflow-hidden rounded-t-lg bg-stone-100">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-stone-900 mb-1">{product.name}</h3>
                      <p className="text-lg font-bold text-stone-900">{product.price}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;

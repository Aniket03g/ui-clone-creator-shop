
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Search, Heart, User } from 'lucide-react';

const ProductDetail = () => {
  const [selectedImage, setSelectedImage] = useState(0);

  const product = {
    name: 'UltraBook Pro 15',
    subtitle: '15.6-inch 16GB RAM 512GB SSD Intel Core i7',
    price: '$1,299',
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1541807084-9913014e4c4d?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&h=400&fit=crop'
    ],
    specifications: {
      Display: '15.6-inch Full HD (1920x1080) IPS',
      Processor: 'Intel Core i7-11617',
      Memory: '16GB DDR4 3200MHz',
      Graphics: 'Intel Xe Graphics',
      Storage: '512GB PCIe NVMe SSD',
      Connectivity: 'Wi-Fi 6, Bluetooth 5.1',
      Battery: 'Up to 10 hours',
      'Operating System': 'Windows 10 Home'
    },
    rating: 4.5,
    totalReviews: 125,
    reviews: [
      {
        id: 1,
        author: 'Sophia Carter',
        time: '2 months ago',
        rating: 5,
        comment: 'This laptop is amazing! It\'s super fast and the display is beautiful. Perfect for both work and entertainment.'
      },
      {
        id: 2,
        author: 'Ethan Bennett',
        time: '3 months ago',
        rating: 4,
        comment: 'Great laptop for the price. It\'s lightweight and has a good battery life. The keyboard is comfortable to type on.'
      }
    ]
  };

  const relatedProducts = [
    {
      id: 1,
      name: 'High-Speed Wi-Fi Router',
      description: 'Stable and fast internet connection',
      image: 'https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=300&h=200&fit=crop'
    },
    {
      id: 2,
      name: 'Laptop Cooling Pad',
      description: 'Keep your laptop cool during heavy use',
      image: 'https://images.unsplash.com/photo-1572459443203-55bf9c14e87d?w=300&h=200&fit=crop'
    },
    {
      id: 3,
      name: 'Ergonomic Wireless Mouse',
      description: 'Comfortable and precise mouse',
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=200&fit=crop'
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
                TechGadget
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
          <Link to="/laptops" className="text-red-600">Laptops</Link>
          <span>/</span>
          <span>UltraBook Pro 15</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex space-x-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square w-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-stone-400' : 'border-stone-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-stone-900 mb-2">{product.name}</h1>
              <p className="text-stone-600">{product.subtitle}</p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-lg ${
                      i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-stone-300'
                    }`}
                  >
                    ★
                  </span>
                ))}
                <span className="ml-2 text-lg font-bold">{product.rating}</span>
              </div>
              <span className="text-stone-600">{product.totalReviews} reviews</span>
            </div>

            <div className="text-3xl font-bold text-stone-900">{product.price}</div>

            <div className="flex space-x-4">
              <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3">
                Add to Cart
              </Button>
              <Button variant="outline" className="px-6">
                Add to Wishlist
              </Button>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-stone-900 mb-6">Specifications</h2>
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-stone-200 last:border-b-0">
                    <span className="font-medium text-stone-900">{key}</span>
                    <span className="text-stone-600">{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customer Reviews */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-stone-900 mb-6">Customer Reviews</h2>
          <div className="space-y-6">
            {product.reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-stone-300 rounded-full flex items-center justify-center">
                      <span className="text-stone-600 font-medium">
                        {review.author.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <span className="font-medium text-stone-900">{review.author}</span>
                        <span className="text-stone-500 text-sm">{review.time}</span>
                      </div>
                      <div className="flex items-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-sm ${
                              i < review.rating ? 'text-yellow-400' : 'text-stone-300'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <p className="text-stone-700">{review.comment}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Related Products */}
        <div>
          <h2 className="text-2xl font-bold text-stone-900 mb-6">Related Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-0">
                  <div className="aspect-[4/3] overflow-hidden rounded-t-lg">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-stone-900 mb-2">{product.name}</h3>
                    <p className="text-stone-600 text-sm">{product.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

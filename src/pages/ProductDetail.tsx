import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart } from 'lucide-react';
import Header from '@/components/Header';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useToast } from '@/hooks/use-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();

  // Sample products data - in a real app this would come from an API
  const products: Record<string, any> = {
    1: {
      id: 1,
      name: 'UltraBook Pro 15',
      subtitle: '15.6-inch 16GB RAM 512GB SSD Intel Core i7',
      price: 97425,
      category: 'Laptop',
      images: [
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1541807084-9913014e4c4d?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&h=400&fit=crop'
      ],
      aboutItem: [
        'Ultra-portable design with premium aluminum construction for durability and style',
        'High-performance Intel Core i7 processor delivers exceptional speed for multitasking',
        'Stunning 15.6-inch Full HD display with vibrant colors and sharp detail',
        '16GB of high-speed DDR4 RAM ensures smooth performance even with demanding applications',
        '512GB PCIe NVMe SSD provides lightning-fast boot times and file access',
        'Advanced Intel Xe Graphics for enhanced visual performance and content creation',
        'All-day battery life up to 10 hours for uninterrupted productivity',
        'Comprehensive connectivity with USB-C, USB-A, HDMI, and audio ports'
      ],
      specifications: {
        'Display Size': '15.6 inches',
        'Display Type': 'Full HD IPS Anti-Glare',
        'Resolution': '1920 x 1080 pixels',
        'Processor': 'Intel Core i7-1165G7',
        'Processor Speed': '2.8 GHz (Base), 4.7 GHz (Turbo)',
        'RAM Size': '16GB DDR4',
        'Storage': '512GB PCIe NVMe SSD',
        'Graphics': 'Intel Xe Graphics',
        'Operating System': 'Windows 11 Home',
        'Battery Life': 'Up to 10 hours',
        'Weight': '1.69 kg (3.7 lbs)',
        'Dimensions': '357.6 x 234 x 17.9 mm',
        'Wi-Fi': 'Wi-Fi 6 (802.11ax)',
        'Bluetooth': 'Bluetooth 5.1',
        'USB Ports': '2x USB-C, 1x USB-A',
        'HDMI': 'HDMI 2.0',
        'Webcam': '720p HD with privacy shutter',
        'Keyboard': 'Backlit chiclet keyboard',
        'Audio': 'Dolby Audio Premium',
        'Warranty': '1 year limited warranty'
      },
      rating: 4.5,
      totalReviews: 125
    },
    2: {
      id: 2,
      name: 'Gaming Beast X1',
      subtitle: '17.3-inch 32GB RAM 1TB SSD RTX 4060',
      price: 125000,
      category: 'Laptop',
      images: [
        'https://images.unsplash.com/photo-1593640393608-3b4e0b07b25c?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1541807084-9913014e4c4d?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=400&fit=crop'
      ],
      aboutItem: [
        'Ultimate gaming performance with RTX 4060 graphics card',
        'Lightning-fast AMD Ryzen 7 processor for seamless multitasking',
        'Immersive 17.3-inch Full HD 144Hz display for smooth gameplay',
        '32GB DDR4 RAM for handling the most demanding games and applications',
        '1TB NVMe SSD for instant game loading and file access',
        'Advanced cooling system to maintain peak performance',
        'RGB backlit gaming keyboard with customizable lighting',
        'Premium audio system with enhanced bass for immersive gaming'
      ],
      specifications: {
        'Display Size': '17.3 inches',
        'Display Type': 'Full HD IPS 144Hz',
        'Resolution': '1920 x 1080 pixels',
        'Processor': 'AMD Ryzen 7 6800H',
        'Processor Speed': '3.2 GHz (Base), 4.7 GHz (Boost)',
        'RAM Size': '32GB DDR4',
        'Storage': '1TB PCIe NVMe SSD',
        'Graphics': 'NVIDIA RTX 4060 8GB',
        'Operating System': 'Windows 11 Home',
        'Battery Life': 'Up to 6 hours',
        'Weight': '2.8 kg (6.2 lbs)',
        'Dimensions': '395 x 262 x 25 mm',
        'Wi-Fi': 'Wi-Fi 6E (802.11ax)',
        'Bluetooth': 'Bluetooth 5.2',
        'USB Ports': '3x USB-A, 2x USB-C',
        'HDMI': 'HDMI 2.1',
        'Webcam': '1080p HD with privacy shutter',
        'Keyboard': 'RGB backlit mechanical',
        'Audio': '2x 5W speakers with subwoofer',
        'Warranty': '2 year limited warranty'
      },
      rating: 4.7,
      totalReviews: 89
    },
    3: {
      id: 3,
      name: 'Business Elite 14',
      subtitle: '14-inch 8GB RAM 256GB SSD Intel Core i5',
      price: 55000,
      category: 'Laptop',
      images: [
        'https://images.unsplash.com/photo-1541807084-9913014e4c4d?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&h=400&fit=crop'
      ],
      aboutItem: [
        'Sleek and professional design perfect for business environments',
        'Reliable Intel Core i5 processor for everyday productivity tasks',
        'Crisp 14-inch Full HD display for clear document viewing',
        '8GB DDR4 RAM for smooth multitasking and application performance',
        '256GB SSD for quick boot times and responsive file access',
        'Long-lasting battery life for all-day productivity',
        'Lightweight design for easy portability',
        'Enhanced security features for business data protection'
      ],
      specifications: {
        'Display Size': '14 inches',
        'Display Type': 'Full HD IPS',
        'Resolution': '1920 x 1080 pixels',
        'Processor': 'Intel Core i5-1235U',
        'Processor Speed': '2.1 GHz (Base), 4.4 GHz (Turbo)',
        'RAM Size': '8GB DDR4',
        'Storage': '256GB PCIe NVMe SSD',
        'Graphics': 'Intel Iris Xe Graphics',
        'Operating System': 'Windows 11 Pro',
        'Battery Life': 'Up to 12 hours',
        'Weight': '1.4 kg (3.1 lbs)',
        'Dimensions': '321 x 212 x 18 mm',
        'Wi-Fi': 'Wi-Fi 6 (802.11ax)',
        'Bluetooth': 'Bluetooth 5.1',
        'USB Ports': '2x USB-C, 1x USB-A',
        'HDMI': 'HDMI 1.4',
        'Webcam': '720p HD with privacy shutter',
        'Keyboard': 'Backlit keyboard',
        'Audio': 'Stereo speakers',
        'Warranty': '3 year business warranty'
      },
      rating: 4.3,
      totalReviews: 156
    }
  };

  const product = products[id || '1'] || products['1'];

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

  const reviews = [
    {
      id: 1,
      author: 'Sophia Carter',
      time: '2 months ago',
      rating: 5,
      comment: `This ${product.name.toLowerCase()} is amazing! It's super fast and the display is beautiful. Perfect for both work and entertainment.`
    },
    {
      id: 2,
      author: 'Ethan Bennett',
      time: '3 months ago',
      rating: 4,
      comment: `Great ${product.category.toLowerCase()} for the price. It's lightweight and has a good battery life. The keyboard is comfortable to type on.`
    }
  ];

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      category: product.category
    });
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleWishlistToggle = () => {
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
        image: product.images[0],
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
        <div className="flex items-center space-x-2 text-sm text-stone-600 mb-8">
          <Link to="/laptops" className="text-red-600">Laptops</Link>
          <span>/</span>
          <span>{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images - Sticky Container */}
          <div className="lg:sticky lg:top-8 lg:self-start space-y-4">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex space-x-4">
              {product.images.map((image: string, index: number) => (
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

          {/* Product Info - Scrollable Content */}
          <div className="space-y-8">
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

            <div className="text-3xl font-bold text-stone-900">₹{product.price.toLocaleString('en-IN')}</div>

            <div className="flex space-x-4">
              <Button 
                onClick={handleAddToCart}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3"
              >
                Add to Cart
              </Button>
              <Button 
                variant="outline" 
                className={`px-6 ${isInWishlist(product.id) ? 'text-red-500 border-red-500' : ''}`}
                onClick={handleWishlistToggle}
              >
                <Heart className={`w-4 h-4 mr-2 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                {isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </Button>
            </div>

            {/* About this item Section */}
            <div className="pt-4">
              <h2 className="text-2xl font-bold text-stone-900 mb-4">About this item</h2>
              <Card>
                <CardContent className="p-6">
                  <ul className="space-y-3">
                    {product.aboutItem.map((item: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-stone-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-stone-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Technical Specifications */}
            <div className="pt-4">
              <h2 className="text-2xl font-bold text-stone-900 mb-6">Technical Specifications</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 gap-3">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-3 border-b border-stone-100 last:border-b-0">
                        <span className="font-medium text-stone-900">{key}</span>
                        <span className="text-stone-600 text-right ml-4">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Customer Reviews */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-stone-900 mb-6">Customer Reviews</h2>
          <div className="space-y-6">
            {reviews.map((review) => (
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

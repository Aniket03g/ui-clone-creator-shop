import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart } from 'lucide-react';
import Header from '@/components/Header';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useToast } from '@/hooks/use-toast';

const ProductDetail = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();

  const product = {
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
      'Comprehensive connectivity with USB-C, USB-A, HDMI, and audio ports',
      'Fast and reliable Wi-Fi 6 and Bluetooth 5.1 for seamless wireless connectivity',
      'Backlit keyboard for comfortable typing in any lighting condition'
    ],
    specifications: {
      // Display Specifications
      'Display Size': '15.6 inches',
      'Display Type': 'Full HD IPS Anti-Glare',
      'Resolution': '1920 x 1080 pixels',
      'Pixel Density': '141 PPI',
      'Brightness': '300 nits',
      'Color Gamut': 'sRGB 99%',
      'Refresh Rate': '60Hz',
      'Aspect Ratio': '16:9',
      
      // Processor Specifications
      'Processor Brand': 'Intel',
      'Processor Model': 'Core i7-1165G7',
      'Processor Generation': '11th Gen',
      'Processor Speed': '2.8 GHz (Base), 4.7 GHz (Turbo)',
      'Number of Cores': '4 Cores',
      'Number of Threads': '8 Threads',
      'Cache Memory': '12MB Intel Smart Cache',
      'Processor Architecture': '64-bit',
      'Manufacturing Process': '10nm SuperFin',
      
      // Memory Specifications
      'RAM Size': '16GB',
      'RAM Type': 'DDR4',
      'RAM Speed': '3200MHz',
      'Memory Slots': '2 (1 occupied)',
      'Maximum Memory': '32GB',
      'Memory Configuration': '1 x 16GB',
      
      // Storage Specifications
      'Storage Type': 'SSD',
      'Storage Capacity': '512GB',
      'Storage Interface': 'PCIe NVMe 3.0',
      'Storage Speed': 'Up to 3,500 MB/s read',
      'Additional Storage': 'M.2 slot available',
      'Hard Drive': 'None',
      
      // Graphics Specifications
      'Graphics Card': 'Intel Xe Graphics',
      'Graphics Memory': 'Shared with system memory',
      'Graphics Clock Speed': '1.3 GHz',
      'Display Output': 'Up to 4K @ 60Hz',
      'Multiple Display Support': 'Yes, up to 3 displays',
      
      // Audio Specifications
      'Audio Technology': 'Dolby Audio Premium',
      'Speakers': 'Dual stereo speakers',
      'Microphone': 'Dual-array digital microphone',
      'Audio Jack': '3.5mm combo headphone/microphone',
      
      // Connectivity Specifications
      'Wi-Fi Standard': 'Wi-Fi 6 (802.11ax)',
      'Wi-Fi Speed': 'Up to 2.4 Gbps',
      'Bluetooth Version': 'Bluetooth 5.1',
      'Ethernet': 'Not available',
      'NFC': 'Not supported',
      
      // Port Specifications
      'USB-C Ports': '2 x Thunderbolt 4',
      'USB-A Ports': '1 x USB 3.2 Gen 1',
      'HDMI Port': '1 x HDMI 2.0',
      'Audio Port': '1 x 3.5mm combo jack',
      'SD Card Reader': 'Yes, microSD',
      'Power Port': 'USB-C (either port)',
      
      // Input Specifications
      'Keyboard Type': 'Backlit chiclet keyboard',
      'Keyboard Layout': 'QWERTY',
      'Trackpad': 'Precision touchpad',
      'Trackpad Size': '4.3 x 2.8 inches',
      'Multi-touch Support': 'Yes, Windows Precision',
      
      // Camera Specifications
      'Webcam Resolution': '720p HD',
      'Webcam Features': 'Privacy shutter, Windows Hello',
      'Webcam Position': 'Top bezel center',
      
      // Battery Specifications
      'Battery Type': 'Lithium-ion',
      'Battery Capacity': '56Wh',
      'Battery Life': 'Up to 10 hours',
      'Charging Technology': 'Fast charging via USB-C',
      'Charging Time': '80% in 1 hour',
      'Power Adapter': '65W USB-C charger',
      
      // Physical Specifications
      'Dimensions (W x D x H)': '357.6 x 234 x 17.9 mm',
      'Weight': '1.69 kg (3.7 lbs)',
      'Build Material': 'Aluminum alloy',
      'Color Options': 'Space Gray, Silver',
      'Finish': 'Anodized aluminum',
      
      // Security Features
      'Fingerprint Reader': 'Yes, integrated with power button',
      'TPM Chip': 'TPM 2.0',
      'Secure Boot': 'Yes',
      'Windows Hello': 'Face recognition and fingerprint',
      'Kensington Lock': 'Yes',
      
      // Software Specifications
      'Operating System': 'Windows 11 Home',
      'Pre-installed Software': 'Microsoft Office trial',
      'Bloatware': 'Minimal pre-installed apps',
      'Driver Support': 'Automatic via Windows Update',
      
      // Environmental Specifications
      'Operating Temperature': '5°C to 35°C',
      'Storage Temperature': '-20°C to 60°C',
      'Humidity': '20% to 80% RH',
      'Altitude': 'Up to 3,048m operating',
      
      // Compliance & Certifications
      'Energy Star': 'Certified',
      'EPEAT Rating': 'Gold',
      'Regulatory Compliance': 'FCC, CE, RoHS',
      'Warranty': '1 year limited hardware warranty',
      'Support': '24/7 technical support'
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
          <span>UltraBook Pro 15</span>
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
                    {product.aboutItem.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-stone-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-stone-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Expanded Specifications - Part of scrollable content */}
            <div className="pt-4">
              <h2 className="text-2xl font-bold text-stone-900 mb-6">Technical Specifications</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-8">
                    {/* Group specifications by category */}
                    {Object.entries({
                      'Display': ['Display Size', 'Display Type', 'Resolution', 'Pixel Density', 'Brightness', 'Color Gamut', 'Refresh Rate', 'Aspect Ratio'],
                      'Processor': ['Processor Brand', 'Processor Model', 'Processor Generation', 'Processor Speed', 'Number of Cores', 'Number of Threads', 'Cache Memory', 'Processor Architecture', 'Manufacturing Process'],
                      'Memory & Storage': ['RAM Size', 'RAM Type', 'RAM Speed', 'Memory Slots', 'Maximum Memory', 'Memory Configuration', 'Storage Type', 'Storage Capacity', 'Storage Interface', 'Storage Speed', 'Additional Storage'],
                      'Graphics & Audio': ['Graphics Card', 'Graphics Memory', 'Graphics Clock Speed', 'Display Output', 'Multiple Display Support', 'Audio Technology', 'Speakers', 'Microphone', 'Audio Jack'],
                      'Connectivity': ['Wi-Fi Standard', 'Wi-Fi Speed', 'Bluetooth Version', 'Ethernet', 'NFC'],
                      'Ports & I/O': ['USB-C Ports', 'USB-A Ports', 'HDMI Port', 'Audio Port', 'SD Card Reader', 'Power Port'],
                      'Input & Camera': ['Keyboard Type', 'Keyboard Layout', 'Trackpad', 'Trackpad Size', 'Multi-touch Support', 'Webcam Resolution', 'Webcam Features', 'Webcam Position'],
                      'Battery & Power': ['Battery Type', 'Battery Capacity', 'Battery Life', 'Charging Technology', 'Charging Time', 'Power Adapter'],
                      'Physical Design': ['Dimensions (W x D x H)', 'Weight', 'Build Material', 'Color Options', 'Finish'],
                      'Security & Software': ['Fingerprint Reader', 'TPM Chip', 'Secure Boot', 'Windows Hello', 'Kensington Lock', 'Operating System', 'Pre-installed Software', 'Bloatware', 'Driver Support'],
                      'Environmental & Compliance': ['Operating Temperature', 'Storage Temperature', 'Humidity', 'Altitude', 'Energy Star', 'EPEAT Rating', 'Regulatory Compliance', 'Warranty', 'Support']
                    }).map(([category, specs]) => (
                      <div key={category}>
                        <h3 className="text-lg font-semibold text-stone-900 mb-4 border-b border-stone-200 pb-2">{category}</h3>
                        <div className="grid grid-cols-1 gap-3">
                          {specs.map((spec) => (
                            product.specifications[spec] && (
                              <div key={spec} className="flex justify-between py-2 border-b border-stone-100 last:border-b-0">
                                <span className="font-medium text-stone-900 text-sm">{spec}</span>
                                <span className="text-stone-600 text-sm text-right ml-4">{product.specifications[spec]}</span>
                              </div>
                            )
                          ))}
                        </div>
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

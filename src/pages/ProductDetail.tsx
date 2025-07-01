
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

  // All products data with proper matching IDs
  const allProducts = {
    // Laptops
    1: {
      id: 1,
      name: 'TechBook Pro 15',
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
    7: {
      id: 7,
      name: 'TechBook Air 13',
      subtitle: '13.3-inch 8GB RAM 256GB SSD Intel Core i5',
      price: 75325,
      category: 'Laptop',
      images: [
        'https://images.unsplash.com/photo-1541807084-9913014e4c4d?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&h=400&fit=crop'
      ],
      aboutItem: [
        'Ultra-thin and lightweight design perfect for portability',
        'Reliable Intel Core i5 processor for everyday computing tasks',
        'Crisp 13.3-inch Retina display with True Tone technology',
        '8GB unified memory for smooth multitasking',
        '256GB SSD storage for fast file access and boot times',
        'All-day battery life up to 15 hours',
        'Fanless design for silent operation',
        'Touch ID for secure authentication'
      ],
      specifications: {
        'Display Size': '13.3 inches',
        'Display Type': 'Retina IPS',
        'Resolution': '2560 x 1600 pixels',
        'Processor': 'Intel Core i5-1235U',
        'Processor Speed': '2.1 GHz (Base), 4.4 GHz (Turbo)',
        'RAM Size': '8GB unified memory',
        'Storage': '256GB PCIe NVMe SSD',
        'Graphics': 'Intel Iris Xe Graphics',
        'Operating System': 'macOS Monterey',
        'Battery Life': 'Up to 15 hours',
        'Weight': '1.29 kg (2.8 lbs)',
        'Dimensions': '304.1 x 212.4 x 16.1 mm',
        'Wi-Fi': 'Wi-Fi 6 (802.11ax)',
        'Bluetooth': 'Bluetooth 5.0',
        'USB Ports': '2x Thunderbolt/USB 4',
        'Audio': 'Stereo speakers with wide stereo sound',
        'Warranty': '1 year limited warranty'
      },
      rating: 4.3,
      totalReviews: 89
    },
    // Routers
    2: {
      id: 2,
      name: 'NetLink 6000',
      subtitle: 'AX1200 Dual-Band Wi-Fi 6 Router',
      price: 11175,
      category: 'Router',
      images: [
        'https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1544717440-6d6866c37ef7?w=600&h=400&fit=crop'
      ],
      aboutItem: [
        'Next-generation Wi-Fi 6 technology for ultra-fast wireless speeds',
        'Dual-band connectivity with combined speeds up to 1200 Mbps',
        '4 high-gain antennas with beamforming for extended coverage',
        'Advanced security with WPA3 encryption and automatic firmware updates',
        'Easy setup with mobile app and voice control compatibility',
        'Supports 50+ connected devices simultaneously',
        'Gaming accelerator and QoS prioritization for lag-free experience',
        'Gigabit Ethernet ports for wired connections'
      ],
      specifications: {
        'Wi-Fi Standard': 'Wi-Fi 6 (802.11ax)',
        'Max Speed': '1200 Mbps (AX1200)',
        'Frequency Bands': 'Dual-band (2.4GHz, 5GHz)',
        'Antennas': '4x High-gain external antennas',
        'Ethernet Ports': '4x Gigabit LAN, 1x Gigabit WAN',
        'USB Ports': '1x USB 3.0',
        'Processor': 'Dual-core 1.5GHz ARM',
        'Memory': '512MB RAM, 128MB Flash',
        'Security': 'WPA3, WPA2, VPN support',
        'Coverage': 'Up to 2000 sq ft',
        'Device Capacity': '50+ devices',
        'Power': '12V/2A adapter',
        'Dimensions': '230 x 144 x 35 mm',
        'Weight': '0.6 kg',
        'Operating Temperature': '0°C to 40°C',
        'Warranty': '2 year limited warranty'
      },
      rating: 4.4,
      totalReviews: 156
    },
    10: {
      id: 10,
      name: 'SpeedLink Pro',
      subtitle: 'AX1800 Tri-Band Wi-Fi 6 Router',
      price: 18675,
      category: 'Router',
      images: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1544717440-6d6866c37ef7?w=600&h=400&fit=crop'
      ],
      aboutItem: [
        'Advanced tri-band Wi-Fi 6 technology for maximum performance',
        'Combined speeds up to 1800 Mbps across all bands',
        '6 high-performance antennas with MU-MIMO technology',
        'Dedicated gaming band for lag-free online gaming',
        'Built-in VPN server for secure remote access',
        'Advanced parental controls and guest network',
        'USB 3.0 port for network storage and printer sharing',
        'Easy mesh compatibility for whole-home coverage'
      ],
      specifications: {
        'Wi-Fi Standard': 'Wi-Fi 6 (802.11ax)',
        'Max Speed': '1800 Mbps (AX1800)',
        'Frequency Bands': 'Tri-band (2.4GHz, 5GHz, 5GHz)',
        'Antennas': '6x High-performance external antennas',
        'Ethernet Ports': '4x Gigabit LAN, 1x Gigabit WAN',
        'USB Ports': '1x USB 3.0, 1x USB 2.0',
        'Processor': 'Quad-core 1.8GHz ARM',
        'Memory': '1GB RAM, 256MB Flash',
        'Security': 'WPA3, WPA2, Built-in VPN',
        'Coverage': 'Up to 3500 sq ft',
        'Device Capacity': '100+ devices',
        'Power': '19V/3A adapter',
        'Dimensions': '280 x 180 x 50 mm',
        'Weight': '1.1 kg',
        'Operating Temperature': '0°C to 40°C',
        'Warranty': '3 year limited warranty'
      },
      rating: 4.5,
      totalReviews: 203
    },
    // PCs
    3: {
      id: 3,
      name: 'VisionDesk 27',
      subtitle: '27-inch All-in-One PC with 4K Display',
      price: 134925,
      category: 'PC',
      images: [
        'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f?w=600&h=400&fit=crop'
      ],
      aboutItem: [
        'Stunning 27-inch 4K UHD display with vibrant colors',
        'Powerful Intel Core i7 processor for demanding applications',
        '16GB DDR4 RAM for smooth multitasking performance',
        '512GB NVMe SSD for lightning-fast storage',
        'Integrated graphics perfect for creative work',
        'Wireless keyboard and mouse included',
        'Multiple connectivity options including USB-C',
        'Space-saving all-in-one design'
      ],
      specifications: {
        'Display Size': '27 inches',
        'Display Type': '4K UHD IPS',
        'Resolution': '3840 x 2160 pixels',
        'Processor': 'Intel Core i7-12700',
        'Processor Speed': '2.1 GHz (Base), 4.9 GHz (Turbo)',
        'RAM Size': '16GB DDR4',
        'Storage': '512GB PCIe NVMe SSD',
        'Graphics': 'Intel UHD Graphics 770',
        'Operating System': 'Windows 11 Home',
        'Webcam': '1080p HD with privacy shutter',
        'Audio': 'Stereo speakers with subwoofer',
        'Connectivity': 'Wi-Fi 6, Bluetooth 5.2',
        'Ports': '4x USB 3.2, 2x USB-C, HDMI out',
        'Dimensions': '612 x 518 x 175 mm',
        'Weight': '8.5 kg',
        'Warranty': '2 year comprehensive warranty'
      },
      rating: 4.6,
      totalReviews: 78
    },
    // UPS
    4: {
      id: 4,
      name: 'PowerGuard 1000',
      subtitle: '1000VA Line Interactive UPS with LCD Display',
      price: 18675,
      category: 'UPS',
      images: [
        'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1558618047-fd3c8c5d17d0?w=600&h=400&fit=crop'
      ],
      aboutItem: [
        'Reliable 1000VA capacity for home and small office equipment',
        'Line interactive technology with automatic voltage regulation',
        'Clear LCD display showing power status and battery information',
        'Multiple outlets with surge protection and battery backup',
        'USB connectivity for automatic shutdown software',
        'Replaceable battery design for long-term cost savings',
        'Energy efficient operation with low power consumption',
        'Audible alarms for power events and low battery warnings'
      ],
      specifications: {
        'Capacity': '1000VA / 600W',
        'Technology': 'Line Interactive',
        'Input Voltage': '140V - 300V AC',
        'Output Voltage': '220V ± 10%',
        'Battery': '12V 7Ah x 2',
        'Backup Time': '15-30 minutes (typical load)',
        'Outlets': '6x outlets (3 with battery backup)',
        'Display': 'LCD with status indicators',
        'Connectivity': 'USB port for monitoring',
        'Transfer Time': '2-6 milliseconds',
        'Surge Protection': 'Yes, built-in',
        'Dimensions': '335 x 165 x 190 mm',
        'Weight': '8.5 kg',
        'Operating Temperature': '0°C to 40°C',
        'Warranty': '2 year product, 1 year battery'
      },
      rating: 4.4,
      totalReviews: 134
    }
  };

  const product = allProducts[Number(id)] || allProducts[1];

  const relatedProducts = [
    {
      id: 21,
      name: 'TP-Link Archer AX73',
      description: 'Wi-Fi 6 router with dual band support',
      image: 'https://images.unsplash.com/photo-1558618047-fd3c8c5d17d0?w=300&h=200&fit=crop'
    },
    {
      id: 22,
      name: 'Laptop Cooling Pad',
      description: 'Keep your laptop cool during heavy use',
      image: 'https://images.unsplash.com/photo-1572459443203-55bf9c14e87d?w=300&h=200&fit=crop'
    },
    {
      id: 23,
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
      comment: `This ${product.name} is amazing! It's super fast and the performance is excellent. Perfect for both work and entertainment.`
    },
    {
      id: 2,
      author: 'Ethan Bennett',
      time: '3 months ago',
      rating: 4,
      comment: `Great ${product.category.toLowerCase()} for the price. The build quality is solid and it meets all my requirements perfectly.`
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
          <Link to="/" className="text-red-600 hover:scale-105 transition-transform duration-200">Home</Link>
          <span>/</span>
          <Link to="/store" className="text-red-600 hover:scale-105 transition-transform duration-200">Store</Link>
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

            {/* Return Policy Section */}
            <div className="pt-4">
              <h2 className="text-2xl font-bold text-stone-900 mb-4">Return Policy</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h3 className="font-semibold text-stone-900 mb-1">30-Day Return Window</h3>
                        <p className="text-stone-700 text-sm">You can return this item within 30 days of delivery if it's in original condition with all accessories.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h3 className="font-semibold text-stone-900 mb-1">Customer Pays Return Shipping</h3>
                        <p className="text-stone-700 text-sm">Return shipping costs are the customer's responsibility. We recommend using a trackable service.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h3 className="font-semibold text-stone-900 mb-1">Return Authorization Required</h3>
                        <p className="text-stone-700 text-sm">Contact us for a Return Authorization Number (RAN) before shipping any returns.</p>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-red-50 rounded-lg">
                      <p className="text-red-800 text-sm font-medium">
                        <strong>Note:</strong> Software products and digital licenses cannot be returned once activated. Custom orders are final sale.
                      </p>
                    </div>
                    <div className="mt-4">
                      <Link to="/returns-policy" className="text-red-600 hover:text-red-700 font-medium text-sm">
                        View Full Return Policy →
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
                  <Link to={`/product/${product.id}`}>
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
                  </Link>
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

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
    // Laptops
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
    },
    // Routers
    4: {
      id: 4,
      name: 'WiFi Pro Max 6E',
      subtitle: 'AX6600 Tri-Band Wi-Fi 6E Router with 8 Antennas',
      price: 15999,
      category: 'Router',
      images: [
        'https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&h=400&fit=crop'
      ],
      aboutItem: [
        'Next-generation Wi-Fi 6E technology for ultra-fast wireless speeds',
        'Tri-band connectivity with dedicated 6GHz band for less congestion',
        'AX6600 combined speeds up to 6.6 Gbps for seamless streaming',
        '8 high-gain antennas with beamforming for extended coverage',
        'Advanced security with WPA3 encryption and automatic updates',
        'Easy setup with mobile app and voice control compatibility',
        'Supports 200+ connected devices simultaneously',
        'Gaming accelerator and QoS prioritization for lag-free experience'
      ],
      specifications: {
        'Wi-Fi Standard': 'Wi-Fi 6E (802.11ax)',
        'Max Speed': '6600 Mbps (AX6600)',
        'Frequency Bands': 'Tri-band (2.4GHz, 5GHz, 6GHz)',
        'Antennas': '8x High-gain external antennas',
        'Ethernet Ports': '4x Gigabit LAN, 1x Gigabit WAN',
        'USB Ports': '1x USB 3.0, 1x USB 2.0',
        'Processor': 'Quad-core 1.8GHz ARM Cortex-A53',
        'Memory': '1GB RAM, 256MB Flash',
        'Security': 'WPA3, WPA2, VPN support',
        'Coverage': 'Up to 3000 sq ft',
        'Device Capacity': '200+ devices',
        'Power': '12V/4A adapter',
        'Dimensions': '300 x 200 x 60 mm',
        'Weight': '1.2 kg',
        'Operating Temperature': '0°C to 40°C',
        'Warranty': '3 year limited warranty'
      },
      rating: 4.6,
      totalReviews: 234
    },
    5: {
      id: 5,
      name: 'Mesh Pro System',
      subtitle: '3-Pack AX3000 Whole Home Mesh Wi-Fi System',
      price: 25999,
      category: 'Router',
      images: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&h=400&fit=crop'
      ],
      aboutItem: [
        'Whole home mesh system eliminates dead zones and weak signals',
        'AX3000 dual-band Wi-Fi 6 for consistent high-speed connectivity',
        'Seamless roaming between nodes without connection drops',
        'Easy setup and management through mobile app',
        'Advanced parental controls and guest network features',
        'Automatic band steering and load balancing optimization',
        'Works with existing modem and internet service provider',
        'Expandable system - add more nodes as needed'
      ],
      specifications: {
        'Wi-Fi Standard': 'Wi-Fi 6 (802.11ax)',
        'Max Speed': '3000 Mbps (AX3000)',
        'Frequency Bands': 'Dual-band (2.4GHz, 5GHz)',
        'Coverage': 'Up to 6000 sq ft (3-pack)',
        'Nodes Included': '3x Mesh nodes',
        'Ethernet Ports': '2x Gigabit per node',
        'Processor': 'Dual-core 1.2GHz',
        'Memory': '512MB RAM, 128MB Flash',
        'Security': 'WPA3, automatic security updates',
        'Device Capacity': '150+ devices',
        'Setup': 'App-based setup and management',
        'Power': 'Power adapter per node',
        'Dimensions': '110 x 110 x 75 mm per node',
        'Weight': '0.4 kg per node',
        'Compatibility': 'Works with all ISPs',
        'Warranty': '2 year limited warranty'
      },
      rating: 4.4,
      totalReviews: 189
    },
    // Desktop PCs
    6: {
      id: 6,
      name: 'Workstation Pro Tower',
      subtitle: 'Intel i9-13900K 32GB RAM RTX 4070 1TB NVMe',
      price: 185000,
      category: 'Desktop PC',
      images: [
        'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=600&h=400&fit=crop'
      ],
      aboutItem: [
        'High-performance workstation for professional content creation',
        'Latest Intel Core i9-13900K processor with 24 cores',
        'NVIDIA RTX 4070 graphics card for 4K rendering and gaming',
        '32GB DDR5 RAM for handling complex multitasking workflows',
        '1TB NVMe SSD for ultra-fast file access and boot times',
        'Premium cooling system with liquid CPU cooler',
        'Tool-free upgrades with spacious mid-tower design',
        'Pre-installed Windows 11 Pro with productivity software'
      ],
      specifications: {
        'Processor': 'Intel Core i9-13900K',
        'Cores/Threads': '24 cores / 32 threads',
        'Base Clock': '3.0 GHz',
        'Boost Clock': 'Up to 5.8 GHz',
        'RAM': '32GB DDR5-5600',
        'Storage': '1TB NVMe PCIe 4.0 SSD',
        'Graphics': 'NVIDIA GeForce RTX 4070 12GB',
        'Motherboard': 'Intel Z790 chipset',
        'Power Supply': '750W 80+ Gold certified',
        'Cooling': 'Liquid CPU cooler + case fans',
        'Case': 'Mid-tower with tempered glass',
        'Operating System': 'Windows 11 Pro',
        'Connectivity': 'Wi-Fi 6E, Bluetooth 5.3',
        'Ports': 'USB-C, USB 3.2, HDMI, DisplayPort',
        'Warranty': '3 year parts and labor'
      },
      rating: 4.8,
      totalReviews: 67
    },
    7: {
      id: 7,
      name: 'Gaming Rig Ultimate',
      subtitle: 'AMD Ryzen 9 7900X 64GB RAM RTX 4080 2TB NVMe',
      price: 245000,
      category: 'Desktop PC',
      images: [
        'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=600&h=400&fit=crop'
      ],
      aboutItem: [
        'Ultimate gaming performance with flagship AMD Ryzen processor',
        'NVIDIA RTX 4080 graphics for 4K gaming at maximum settings',
        'Massive 64GB DDR5 RAM for future-proof gaming and streaming',
        '2TB NVMe SSD storage for extensive game library',
        'Custom RGB lighting with synchronized effects',
        'Advanced liquid cooling for optimal thermal performance',
        'High-refresh rate gaming support up to 240Hz',
        'VR-ready with premium connectivity options'
      ],
      specifications: {
        'Processor': 'AMD Ryzen 9 7900X',
        'Cores/Threads': '12 cores / 24 threads',
        'Base Clock': '4.7 GHz',
        'Boost Clock': 'Up to 5.6 GHz',
        'RAM': '64GB DDR5-6000',
        'Storage': '2TB NVMe PCIe 4.0 SSD',
        'Graphics': 'NVIDIA GeForce RTX 4080 16GB',
        'Motherboard': 'AMD X670E chipset',
        'Power Supply': '850W 80+ Platinum modular',
        'Cooling': 'Custom liquid cooling loop',
        'Case': 'Full-tower with RGB lighting',
        'Operating System': 'Windows 11 Home',
        'Connectivity': 'Wi-Fi 6E, Bluetooth 5.3',
        'Ports': 'Multiple USB-C, USB 3.2, HDMI 2.1',
        'Warranty': '3 year comprehensive warranty'
      },
      rating: 4.9,
      totalReviews: 43
    },
    // UPS Systems
    8: {
      id: 8,
      name: 'PowerGuard Pro 1500VA',
      subtitle: 'Line Interactive UPS with LCD Display',
      price: 12500,
      category: 'UPS',
      images: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f?w=600&h=400&fit=crop'
      ],
      aboutItem: [
        'Reliable power protection for home and small office equipment',
        '1500VA/900W capacity supports multiple devices simultaneously',
        'Line interactive technology with automatic voltage regulation',
        'LCD display shows real-time power status and battery information',
        'Multiple outlets with surge protection and battery backup',
        'USB connectivity for automatic shutdown software',
        'Replaceable battery design for long-term cost savings',
        'Energy efficient operation with low power consumption'
      ],
      specifications: {
        'Capacity': '1500VA / 900W',
        'Technology': 'Line Interactive',
        'Input Voltage': '140V - 300V AC',
        'Output Voltage': '220V ± 10%',
        'Battery': '12V 9Ah x 2',
        'Backup Time': '10-25 minutes (typical load)',
        'Outlets': '8x outlets (4 with battery backup)',
        'Display': 'LCD with status indicators',
        'Connectivity': 'USB port for monitoring',
        'Transfer Time': '2-4 milliseconds',
        'Surge Protection': 'Yes, built-in',
        'Dimensions': '365 x 180 x 210 mm',
        'Weight': '11.5 kg',
        'Operating Temperature': '0°C to 40°C',
        'Warranty': '2 year product, 1 year battery'
      },
      rating: 4.3,
      totalReviews: 156
    },
    9: {
      id: 9,
      name: 'Enterprise UPS 3000VA',
      subtitle: 'Online Double Conversion UPS System',
      price: 35000,
      category: 'UPS',
      images: [
        'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f?w=600&h=400&fit=crop'
      ],
      aboutItem: [
        'Premium online double conversion technology for critical applications',
        '3000VA/2700W capacity for servers and network equipment',
        'Zero transfer time with continuous power conditioning',
        'Hot-swappable batteries for maintenance without downtime',
        'Network management card for remote monitoring and control',
        'Automatic bypass for overload and internal fault protection',
        'Extended runtime with external battery cabinet option',
        'Enterprise-grade reliability with advanced diagnostics'
      ],
      specifications: {
        'Capacity': '3000VA / 2700W',
        'Technology': 'Online Double Conversion',
        'Input Voltage': '120V-300V AC (wide range)',
        'Output Voltage': '220V ± 1%',
        'Efficiency': '95% (ECO mode)',
        'Battery': 'Hot-swappable modules',
        'Runtime': '5-15 minutes at full load',
        'Display': 'Color LCD touchscreen',
        'Communication': 'SNMP, USB, RS-232',
        'Outlets': '6x IEC outlets',
        'Transfer Time': '0ms (online)',
        'Input Power Factor': '0.99',
        'Dimensions': '440 x 665 x 88 mm (2U)',
        'Weight': '28 kg',
        'Operating Temp': '0°C to 40°C',
        'Warranty': '3 year advanced replacement'
      },
      rating: 4.7,
      totalReviews: 89
    },
    // Components
    10: {
      id: 10,
      name: 'RGB Gaming Memory Kit',
      subtitle: '32GB (2x16GB) DDR5-6000 RGB RAM',
      price: 18500,
      category: 'Component',
      images: [
        'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f?w=600&h=400&fit=crop'
      ],
      aboutItem: [
        'High-performance DDR5 memory for gaming and content creation',
        'RGB lighting with customizable effects and software control',
        '6000MHz speed with low latency timings for maximum performance',
        'Intel XMP 3.0 and AMD EXPO certified for easy overclocking',
        'Premium aluminum heat spreaders for optimal thermal management',
        'Lifetime warranty with dedicated technical support',
        'Compatible with latest Intel and AMD platforms',
        'Tested and validated for stability and reliability'
      ],
      specifications: {
        'Memory Type': 'DDR5 SDRAM',
        'Capacity': '32GB (2 x 16GB)',
        'Speed': 'DDR5-6000',
        'Latency': 'CL30-36-36-76',
        'Voltage': '1.35V',
        'RGB Lighting': 'Addressable RGB LEDs',
        'Heat Spreader': 'Aluminum with thermal pads',
        'Form Factor': '288-pin DIMM',
        'Compatibility': 'Intel XMP 3.0, AMD EXPO',
        'Operating Temp': '0°C to 85°C',
        'Dimensions': '133.35 x 34.9 x 6.62 mm',
        'Weight': '45g per module',
        'Software': 'RGB control software included',
        'Warranty': 'Lifetime limited warranty',
        'Certification': 'JEDEC compliant'
      },
      rating: 4.6,
      totalReviews: 312
    },
    11: {
      id: 11,
      name: 'NVMe SSD Pro 2TB',
      subtitle: 'PCIe 4.0 M.2 SSD with Heat Sink',
      price: 22000,
      category: 'Component',
      images: [
        'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f?w=600&h=400&fit=crop'
      ],
      aboutItem: [
        'Ultra-fast PCIe 4.0 NVMe SSD for maximum storage performance',
        '2TB capacity for large game libraries and professional workloads',
        'Sequential read speeds up to 7,400 MB/s for instant loading',
        'Advanced 3D NAND technology for reliability and endurance',
        'Integrated aluminum heat sink for thermal management',
        'Dynamic SLC caching and intelligent TurboWrite acceleration',
        '5-year warranty with migration software included',
        'Compatible with PlayStation 5 and latest gaming systems'
      ],
      specifications: {
        'Interface': 'PCIe 4.0 x4, NVMe 1.4',
        'Form Factor': 'M.2 2280',
        'Capacity': '2TB (2,000GB)',
        'Sequential Read': 'Up to 7,400 MB/s',
        'Sequential Write': 'Up to 6,900 MB/s',
        'Random Read': 'Up to 1,000K IOPS',
        'Random Write': 'Up to 1,200K IOPS',
        'NAND Flash': '3D TLC V-NAND',
        'Controller': 'Samsung Elpis',
        'Cache': 'LPDDR4 DRAM + SLC',
        'Endurance': '1,200 TBW',
        'Operating Temp': '0°C to 70°C',
        'Dimensions': '80 x 22 x 8.6 mm',
        'Weight': '9.5g',
        'Warranty': '5 year limited warranty'
      },
      rating: 4.8,
      totalReviews: 278
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
      comment: `This ${product.name.toLowerCase()} is amazing! It's super fast and the performance is excellent. Perfect for both work and entertainment.`
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
          <Link to={`/${product.category.toLowerCase()}s`} className="text-red-600 capitalize">
            {product.category}s
          </Link>
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

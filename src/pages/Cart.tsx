
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart, Search, Heart, User } from 'lucide-react';

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Laptop - Model X',
      price: 1299.99,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&h=150&fit=crop'
    },
    {
      id: 2,
      name: 'Wi-Fi Router - Model Y',
      price: 199.98,
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=200&h=150&fit=crop'
    },
    {
      id: 3,
      name: 'All-in-One PC - Model Z',
      price: 249.99,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=200&h=150&fit=crop'
    },
    {
      id: 4,
      name: 'UPS System - Model A',
      price: 99.99,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&h=150&fit=crop'
    }
  ]);

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const taxes = subtotal * 0.08; // 8% tax
  const total = subtotal + taxes;

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-2xl font-bold text-stone-900">
                TechShop
              </Link>
              <nav className="hidden md:flex space-x-6">
                <Link to="/store" className="text-stone-700 hover:text-stone-900 transition-colors">
                  Store
                </Link>
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-stone-600 mb-8">
          <Link to="/" className="text-red-600">Shopping Cart</Link>
          <span>/</span>
          <span>Your Cart</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-stone-900 mb-8">Your Cart</h1>
            
            <div className="space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id} className="border-stone-200">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-stone-100">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-stone-900 mb-1">{item.name}</h3>
                        <p className="text-lg font-bold text-stone-900">${item.price.toFixed(2)}</p>
                        <p className="text-stone-600">Quantity: {item.quantity}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="border-stone-200 sticky top-24">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-stone-900 mb-6">Order Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-stone-700">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-stone-700">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between text-stone-700">
                    <span>Taxes</span>
                    <span>${taxes.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-stone-200 pt-4">
                    <div className="flex justify-between text-lg font-bold text-stone-900">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Link to="/checkout">
                  <Button className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white py-3">
                    Proceed to Checkout
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

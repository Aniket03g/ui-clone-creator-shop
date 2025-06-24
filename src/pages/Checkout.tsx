
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingCart, Search, Heart, User, CreditCard } from 'lucide-react';

const Checkout = () => {
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [sameAsBilling, setSameAsBilling] = useState(false);

  const orderItems = [
    { name: 'TechBook Pro 15', category: 'Laptop', price: 1299 },
    { name: 'NetLink 6000', category: 'Wi-Fi Router', price: 149 },
    { name: 'VisionDesk 27', category: 'All-in-One PC', price: 1799 },
    { name: 'PowerGuard 1000', category: 'UPS System', price: 249 }
  ];

  const subtotal = orderItems.reduce((sum, item) => sum + item.price, 0);
  const tax = 244.72;
  const total = subtotal + tax;

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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-stone-600 mb-8">
          <Link to="/cart" className="text-red-600">Cart</Link>
          <span>/</span>
          <span>Checkout</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Checkout Form */}
          <div>
            <h1 className="text-3xl font-bold text-stone-900 mb-8">Checkout</h1>

            {/* Shipping Address */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-stone-900 mb-4">Shipping Address</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="Enter your full name"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="Enter your address"
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="Enter your city"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      placeholder="Enter your postal code"
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="Enter your phone number"
                    className="mt-1"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="saveInfo" />
                  <Label htmlFor="saveInfo">Save this information for next time</Label>
                </div>
              </div>
            </div>

            {/* Billing Address */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-stone-900 mb-4">Billing Address</h2>
              <div className="flex items-center space-x-2 mb-4">
                <Checkbox 
                  id="sameAddress" 
                  checked={sameAsBilling}
                  onCheckedChange={(checked) => setSameAsBilling(checked === true)}
                />
                <Label htmlFor="sameAddress">Same as shipping address</Label>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-stone-900 mb-4">Payment Method</h2>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="flex items-center space-x-2 p-4 border border-stone-200 rounded-lg">
                  <RadioGroupItem value="credit-card" id="credit-card" />
                  <Label htmlFor="credit-card" className="flex items-center space-x-2">
                    <CreditCard className="w-4 h-4" />
                    <span>Credit Card</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-4 border border-stone-200 rounded-lg">
                  <RadioGroupItem value="paypal" id="paypal" />
                  <Label htmlFor="paypal">PayPal</Label>
                </div>
                <div className="flex items-center space-x-2 p-4 border border-stone-200 rounded-lg">
                  <RadioGroupItem value="bank-transfer" id="bank-transfer" />
                  <Label htmlFor="bank-transfer">Bank Transfer</Label>
                </div>
              </RadioGroup>

              {paymentMethod === 'credit-card' && (
                <div className="mt-4 space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="Enter your card number"
                      className="mt-1"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="Enter CVV"
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="cardName">Name on Card</Label>
                    <Input
                      id="cardName"
                      placeholder="Enter name on card"
                      className="mt-1"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="border-stone-200 sticky top-24">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-stone-900 mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  {orderItems.map((item, index) => (
                    <div key={index} className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-stone-900">{item.name}</h3>
                        <p className="text-sm text-stone-600">{item.category}</p>
                      </div>
                      <span className="font-medium text-stone-900">${item.price}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-stone-200 pt-4 space-y-2">
                  <div className="flex justify-between text-stone-700">
                    <span>Subtotal</span>
                    <span>${subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-stone-700">
                    <span>Shipping</span>
                    <span>$0</span>
                  </div>
                  <div className="flex justify-between text-stone-700">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-stone-200 pt-2">
                    <div className="flex justify-between text-lg font-bold text-stone-900">
                      <span>Total</span>
                      <span>${(total).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <Button className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white py-3">
                  Place Order
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

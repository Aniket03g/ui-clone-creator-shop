
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CartItem } from '@/contexts/CartContext';
import { CheckCircle, MapPin, CreditCard, Truck, Calendar } from 'lucide-react';
import { CheckoutData } from '@/pages/Checkout';

interface OrderSummaryStepProps {
  cartItems: CartItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  checkoutData: CheckoutData;
  onPlaceOrder: () => void;
  onBack: () => void;
}

const OrderSummaryStep: React.FC<OrderSummaryStepProps> = ({ 
  cartItems, 
  subtotal, 
  tax, 
  deliveryFee, 
  total, 
  checkoutData,
  onPlaceOrder, 
  onBack 
}) => {
  const getPaymentMethodDisplay = (method: string) => {
    switch (method) {
      case 'credit-card': return 'Credit/Debit Card';
      case 'upi': return 'UPI';
      case 'netbanking': return 'Net Banking';
      case 'cod': return 'Cash on Delivery';
      default: return method;
    }
  };

  const getDeliveryOptionDisplay = (option: string) => {
    switch (option) {
      case 'standard': return { name: 'Standard Delivery', time: '5-7 business days' };
      case 'express': return { name: 'Express Delivery', time: '2-3 business days' };
      case 'same-day': return { name: 'Same Day Delivery', time: 'Within 24 hours' };
      default: return { name: option, time: '5-7 business days' };
    }
  };

  const getEstimatedDeliveryDate = (option: string) => {
    const today = new Date();
    let deliveryDate = new Date(today);
    
    switch (option) {
      case 'standard':
        deliveryDate.setDate(today.getDate() + 7);
        break;
      case 'express':
        deliveryDate.setDate(today.getDate() + 3);
        break;
      case 'same-day':
        deliveryDate = today;
        break;
      default:
        deliveryDate.setDate(today.getDate() + 7);
    }
    
    return deliveryDate.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const deliveryOption = getDeliveryOptionDisplay(checkoutData.deliveryOption);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Delivery Address */}
        {checkoutData.address && (
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-medium text-green-900 mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Delivering to
            </h3>
            <div className="text-sm text-green-800">
              <p className="font-medium">{checkoutData.address.fullName}</p>
              <p>{checkoutData.address.street}</p>
              <p>{checkoutData.address.city}, {checkoutData.address.state} {checkoutData.address.zipCode}</p>
              <p>Phone: {checkoutData.address.phone}</p>
            </div>
          </div>
        )}

        {/* Payment Method */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Payment Method
          </h3>
          <p className="text-sm text-blue-800">
            {getPaymentMethodDisplay(checkoutData.paymentMethod)}
          </p>
        </div>

        {/* Delivery Information */}
        <div className="p-4 bg-orange-50 rounded-lg">
          <h3 className="font-medium text-orange-900 mb-2 flex items-center gap-2">
            <Truck className="w-4 h-4" />
            Delivery Option
          </h3>
          <div className="text-sm text-orange-800">
            <p className="font-medium">{deliveryOption.name}</p>
            <p>{deliveryOption.time}</p>
          </div>
        </div>

        {/* Estimated Delivery Date */}
        <div className="p-4 bg-purple-50 rounded-lg">
          <h3 className="font-medium text-purple-900 mb-2 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Estimated Delivery
          </h3>
          <p className="text-sm text-purple-800 font-medium">
            {getEstimatedDeliveryDate(checkoutData.deliveryOption)}
          </p>
        </div>

        <div>
          <h3 className="font-medium text-stone-900 mb-4">Items in your order</h3>
          <div className="space-y-3">
            {cartItems.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-stone-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div>
                    <h4 className="font-medium text-stone-900">{item.name}</h4>
                    <p className="text-sm text-stone-600">Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-medium text-stone-900">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-stone-200 pt-4">
          <div className="space-y-3">
            <div className="flex justify-between text-stone-700">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-stone-700">
              <span>Delivery</span>
              <span>{deliveryFee === 0 ? 'Free' : `₹${deliveryFee.toLocaleString('en-IN')}`}</span>
            </div>
            <div className="flex justify-between text-stone-700">
              <span>GST (18%)</span>
              <span>₹{Math.round(tax).toLocaleString('en-IN')}</span>
            </div>
            <div className="border-t border-stone-200 pt-3">
              <div className="flex justify-between text-xl font-bold text-stone-900">
                <span>Total</span>
                <span>₹{Math.round(total).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-green-50 rounded-lg">
          <h3 className="font-medium text-green-900 mb-2">Order Protection</h3>
          <p className="text-sm text-green-800">
            Your order is protected with our 30-day return policy and 1-year warranty on all products.
          </p>
        </div>

        <div className="flex gap-4 pt-4 border-t border-stone-200">
          <Button variant="outline" onClick={onBack} className="flex-1">
            Back to Delivery
          </Button>
          <Button 
            onClick={onPlaceOrder} 
            className="flex-1 bg-red-600 hover:bg-red-700 text-white text-lg py-3"
          >
            Place Order
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSummaryStep;

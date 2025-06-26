
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CartItem } from '@/contexts/CartContext';

interface ReviewOrderStepProps {
  cartItems: CartItem[];
  onNext: () => void;
}

const ReviewOrderStep: React.FC<ReviewOrderStepProps> = ({ cartItems, onNext }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Review Your Order</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {cartItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-stone-200 rounded-lg">
              <div className="flex items-center space-x-4">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-medium text-stone-900">{item.name}</h3>
                  <p className="text-sm text-stone-600">{item.category}</p>
                  <p className="text-sm text-stone-600">Quantity: {item.quantity}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-stone-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                <p className="text-sm text-stone-600">₹{item.price.toLocaleString('en-IN')} each</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-stone-200">
          <Button onClick={onNext} className="w-full bg-red-600 hover:bg-red-700 text-white">
            Continue to Address
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewOrderStep;

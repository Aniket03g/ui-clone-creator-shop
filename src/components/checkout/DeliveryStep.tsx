
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Truck, Clock, Zap } from 'lucide-react';

interface DeliveryStepProps {
  onNext: (deliveryOption: string) => void;
  onBack: () => void;
}

const DeliveryStep: React.FC<DeliveryStepProps> = ({ onNext, onBack }) => {
  const [deliveryOption, setDeliveryOption] = useState('standard');

  const deliveryOptions = [
    {
      id: 'standard',
      name: 'Standard Delivery',
      description: '5-7 business days',
      price: 0,
      icon: <Truck className="w-5 h-5" />
    },
    {
      id: 'express',
      name: 'Express Delivery',
      description: '2-3 business days',
      price: 150,
      icon: <Clock className="w-5 h-5" />
    },
    {
      id: 'same-day',
      name: 'Same Day Delivery',
      description: 'Within 24 hours',
      price: 300,
      icon: <Zap className="w-5 h-5" />
    }
  ];

  const handleNext = () => {
    onNext(deliveryOption);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="w-5 h-5" />
          Delivery Options
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup value={deliveryOption} onValueChange={setDeliveryOption}>
          {deliveryOptions.map((option) => (
            <div key={option.id} className="flex items-center space-x-3 p-4 border border-stone-200 rounded-lg">
              <RadioGroupItem value={option.id} id={option.id} />
              <Label htmlFor={option.id} className="flex items-center justify-between w-full cursor-pointer">
                <div className="flex items-center space-x-3">
                  {option.icon}
                  <div>
                    <div className="font-medium text-stone-900">{option.name}</div>
                    <div className="text-sm text-stone-600">{option.description}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-stone-900">
                    {option.price === 0 ? 'Free' : `₹${option.price}`}
                  </div>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>

        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Delivery Information</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• All deliveries are tracked and insured</li>
            <li>• Same day delivery available for orders placed before 12 PM</li>
            <li>• Free standard delivery on orders above ₹2,000</li>
          </ul>
        </div>

        <div className="flex gap-4 pt-4 border-t border-stone-200">
          <Button variant="outline" onClick={onBack} className="flex-1">
            Back to Payment
          </Button>
          <Button 
            onClick={handleNext} 
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
          >
            Review Order
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeliveryStep;

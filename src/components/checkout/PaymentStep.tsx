
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CreditCard, Smartphone, Building, Banknote } from 'lucide-react';

interface PaymentStepProps {
  onNext: (paymentMethod: string) => void;
  onBack: () => void;
}

const PaymentStep: React.FC<PaymentStepProps> = ({ onNext, onBack }) => {
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    cardName: ''
  });
  const [upiId, setUpiId] = useState('');

  const handleNext = () => {
    if (paymentMethod === 'credit-card') {
      if (!cardDetails.cardNumber || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.cardName) return;
    }
    if (paymentMethod === 'upi' && !upiId) return;
    onNext(paymentMethod);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Payment Method
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
          <div className="flex items-center space-x-3 p-4 border border-stone-200 rounded-lg">
            <RadioGroupItem value="credit-card" id="credit-card" />
            <Label htmlFor="credit-card" className="flex items-center space-x-2 cursor-pointer">
              <CreditCard className="w-4 h-4" />
              <span>Credit/Debit Card</span>
            </Label>
          </div>
          <div className="flex items-center space-x-3 p-4 border border-stone-200 rounded-lg">
            <RadioGroupItem value="upi" id="upi" />
            <Label htmlFor="upi" className="flex items-center space-x-2 cursor-pointer">
              <Smartphone className="w-4 h-4" />
              <span>UPI</span>
            </Label>
          </div>
          <div className="flex items-center space-x-3 p-4 border border-stone-200 rounded-lg">
            <RadioGroupItem value="netbanking" id="netbanking" />
            <Label htmlFor="netbanking" className="flex items-center space-x-2 cursor-pointer">
              <Building className="w-4 h-4" />
              <span>Net Banking</span>
            </Label>
          </div>
          <div className="flex items-center space-x-3 p-4 border border-stone-200 rounded-lg">
            <RadioGroupItem value="cod" id="cod" />
            <Label htmlFor="cod" className="flex items-center space-x-2 cursor-pointer">
              <Banknote className="w-4 h-4" />
              <span>Cash on Delivery</span>
            </Label>
          </div>
        </RadioGroup>

        {paymentMethod === 'credit-card' && (
          <div className="space-y-4 p-4 bg-stone-50 rounded-lg">
            <h3 className="font-medium text-stone-900">Card Details</h3>
            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                value={cardDetails.cardNumber}
                onChange={(e) => setCardDetails(prev => ({ ...prev, cardNumber: e.target.value }))}
                placeholder="1234 5678 9012 3456"
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input
                  id="expiry"
                  value={cardDetails.expiry}
                  onChange={(e) => setCardDetails(prev => ({ ...prev, expiry: e.target.value }))}
                  placeholder="MM/YY"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  value={cardDetails.cvv}
                  onChange={(e) => setCardDetails(prev => ({ ...prev, cvv: e.target.value }))}
                  placeholder="123"
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="cardName">Name on Card</Label>
              <Input
                id="cardName"
                value={cardDetails.cardName}
                onChange={(e) => setCardDetails(prev => ({ ...prev, cardName: e.target.value }))}
                placeholder="Enter name on card"
                className="mt-1"
              />
            </div>
          </div>
        )}

        {paymentMethod === 'upi' && (
          <div className="space-y-4 p-4 bg-stone-50 rounded-lg">
            <h3 className="font-medium text-stone-900">UPI Details</h3>
            <div>
              <Label htmlFor="upiId">UPI ID</Label>
              <Input
                id="upiId"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="yourname@paytm"
                className="mt-1"
              />
            </div>
          </div>
        )}

        <div className="flex gap-4 pt-4 border-t border-stone-200">
          <Button variant="outline" onClick={onBack} className="flex-1">
            Back to Address
          </Button>
          <Button 
            onClick={handleNext} 
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
          >
            Continue to Delivery
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentStep;

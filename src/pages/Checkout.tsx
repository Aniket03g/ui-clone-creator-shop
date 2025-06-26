
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import CheckoutSteps from '@/components/checkout/CheckoutSteps';
import AddressStep from '@/components/checkout/AddressStep';
import PaymentStep from '@/components/checkout/PaymentStep';
import DeliveryStep from '@/components/checkout/DeliveryStep';
import OrderSummaryStep from '@/components/checkout/OrderSummaryStep';

export interface CheckoutData {
  address: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
  } | null;
  paymentMethod: string;
  deliveryOption: string;
}

const Checkout = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    address: null,
    paymentMethod: '',
    deliveryOption: ''
  });
  
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const subtotal: number = getTotalPrice();
  const deliveryFee: number = 0; // This would be calculated based on delivery option
  const tax: number = subtotal * 0.18; // 18% GST for India
  const total: number = subtotal + tax + deliveryFee;

  const handleStepComplete = (step: number) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps(prev => [...prev, step]);
    }
  };

  const goToStep = (step: number) => {
    handleStepComplete(currentStep);
    setCurrentStep(step);
  };

  const handlePlaceOrder = () => {
    clearCart();
    toast({
      title: "Order Placed Successfully!",
      description: "Your order has been confirmed. You will receive a confirmation email shortly.",
    });
    navigate('/');
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold text-stone-900 mb-4">No Items to Checkout</h1>
            <p className="text-stone-600 mb-8">Your cart is empty. Add some products first!</p>
            <Link to="/store">
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-stone-600 mb-8">
          <Link to="/cart" className="text-red-600">Cart</Link>
          <span>/</span>
          <span>Checkout</span>
        </div>

        <h1 className="text-3xl font-bold text-stone-900 mb-8">Checkout</h1>

        <CheckoutSteps currentStep={currentStep} completedSteps={completedSteps} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <AddressStep 
                onNext={(addressData) => {
                  setCheckoutData(prev => ({ ...prev, address: addressData }));
                  goToStep(2);
                }}
                onBack={() => navigate('/cart')}
              />
            )}
            
            {currentStep === 2 && (
              <PaymentStep 
                onNext={(paymentMethod) => {
                  setCheckoutData(prev => ({ ...prev, paymentMethod }));
                  goToStep(3);
                }}
                onBack={() => setCurrentStep(1)}
              />
            )}
            
            {currentStep === 3 && (
              <DeliveryStep 
                onNext={(deliveryOption) => {
                  setCheckoutData(prev => ({ ...prev, deliveryOption }));
                  goToStep(4);
                }}
                onBack={() => setCurrentStep(2)}
              />
            )}
            
            {currentStep === 4 && (
              <OrderSummaryStep 
                cartItems={cartItems}
                subtotal={subtotal}
                tax={tax}
                deliveryFee={deliveryFee}
                total={total}
                checkoutData={checkoutData}
                onPlaceOrder={handlePlaceOrder}
                onBack={() => setCurrentStep(3)}
              />
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="border-stone-200 sticky top-24">
              <CardContent className="p-6">
                <h2 className="text-lg font-bold text-stone-900 mb-4">Order Total</h2>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-stone-700">
                    <span>Items ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})</span>
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
                  <div className="border-t border-stone-200 pt-2">
                    <div className="flex justify-between text-lg font-bold text-stone-900">
                      <span>Total</span>
                      <span>₹{Math.round(total).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-stone-500 mt-4">
                  <p>By placing your order, you agree to our Terms of Service and Privacy Policy.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

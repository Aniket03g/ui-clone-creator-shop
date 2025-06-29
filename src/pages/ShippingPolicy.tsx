
import React from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ShippingPolicy = () => {
  return (
    <div className="min-h-screen bg-stone-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-stone-900 mb-8">Shipping Policy</h1>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Methods & Delivery Times</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-stone-900 mb-2">Standard Shipping (Free)</h3>
                <p className="text-stone-700">5-7 business days delivery for orders above ₹2,999. Free shipping on all orders above ₹2,999.</p>
              </div>
              <div>
                <h3 className="font-semibold text-stone-900 mb-2">Express Shipping</h3>
                <p className="text-stone-700">2-3 business days delivery. Additional charges of ₹199 apply.</p>
              </div>
              <div>
                <h3 className="font-semibold text-stone-900 mb-2">Same Day Delivery</h3>
                <p className="text-stone-700">Available in select metro cities. Orders placed before 2 PM will be delivered the same day. Additional charges of ₹499 apply.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Processing Time</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-stone-700">All orders are processed within 1-2 business days. Orders are not shipped or delivered on weekends or holidays.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipping Locations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-stone-700">We currently ship to all locations within India. International shipping is not available at this time.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-stone-700">Once your order is shipped, you will receive a tracking number via email and SMS to track your package.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Damaged or Lost Packages</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-stone-700">If your package arrives damaged or goes missing, please contact our customer service within 48 hours of delivery for assistance.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;


import React from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ReturnsPolicy = () => {
  return (
    <div className="min-h-screen bg-stone-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-stone-900 mb-8">Returns & Refunds Policy</h1>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Return Window</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-stone-700">We offer a 30-day return window from the date of delivery for most items. Some electronics may have different return periods as specified on the product page.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Return Conditions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-stone-700">To be eligible for a return, items must be:</p>
              <ul className="list-disc list-inside text-stone-700 space-y-1">
                <li>In original condition with all accessories and packaging</li>
                <li>Unused and in the same condition as received</li>
                <li>Include original invoice/receipt</li>
                <li>Free from damage not caused by defect</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Non-Returnable Items</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-stone-700 space-y-1">
                <li>Software and digital products</li>
                <li>Items damaged by misuse</li>
                <li>Products with removed or tampered serial numbers</li>
                <li>Custom or personalized items</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Return Process</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <ol className="list-decimal list-inside text-stone-700 space-y-1">
                <li>Contact our customer service to initiate a return</li>
                <li>Receive return authorization and shipping label</li>
                <li>Pack the item securely with all original components</li>
                <li>Ship the item using provided return label</li>
                <li>Receive confirmation once return is processed</li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Refund Processing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-stone-700">Refunds will be processed within 5-7 business days after we receive and inspect the returned item. Refunds will be issued to the original payment method.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Exchanges</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-stone-700">We offer exchanges for defective or damaged items. Contact customer service within 7 days of delivery for defective products.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReturnsPolicy;

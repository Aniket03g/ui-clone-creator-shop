

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
              <p className="text-stone-700">We offer a 30-day return window from the date of delivery for most items. Software products and custom orders may have different return periods as specified on the product page.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Return Shipping Costs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-stone-700 font-semibold">Important: All return shipping costs must be paid by the customer.</p>
              <ul className="list-disc list-inside text-stone-700 space-y-1">
                <li>Customers are responsible for return shipping charges</li>
                <li>We recommend using a trackable shipping service</li>
                <li>Return shipping insurance is customer's responsibility</li>
                <li>Items lost during return shipping are customer's liability</li>
              </ul>
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
                <li>Free from damage not caused by manufacturing defect</li>
                <li>Have all original seals, stickers, and warranty labels intact</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Non-Returnable Items</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-stone-700 space-y-1">
                <li>Software products and digital licenses (once activated)</li>
                <li>Items damaged by misuse or normal wear</li>
                <li>Products with removed or tampered serial numbers</li>
                <li>Custom configured systems or special orders</li>
                <li>Consumable items (cables, batteries, etc.) after 7 days</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Return Process</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <ol className="list-decimal list-inside text-stone-700 space-y-1">
                <li>Contact our support team to request a Return Authorization Number (RAN)</li>
                <li>Pack the item securely with all original components and packaging</li>
                <li>Include the RAN and original invoice in the package</li>
                <li>Ship the item at your own expense using a trackable service</li>
                <li>Receive confirmation once we receive and inspect the returned item</li>
              </ol>
              <p className="text-stone-600 text-sm mt-4">
                Note: Returns without a valid RAN may be refused or subject to additional processing fees.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Refund Processing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-stone-700">Refunds will be processed within 5-7 business days after we receive and inspect the returned item. Refunds will be issued to the original payment method minus any return shipping costs if applicable. Processing fees may apply for certain payment methods.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Defective Items & Warranty Claims</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-stone-700">For items that arrive defective or develop faults within the warranty period, we will cover return shipping costs only if the defect is confirmed to be a manufacturing issue. Contact our support team within 7 days of delivery for defective products.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReturnsPolicy;


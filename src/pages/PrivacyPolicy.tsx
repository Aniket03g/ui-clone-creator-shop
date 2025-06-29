
import React from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-stone-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-stone-900 mb-8">Privacy Policy</h1>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-stone-700">We collect information you provide directly to us, such as:</p>
              <ul className="list-disc list-inside text-stone-700 space-y-1">
                <li>Personal details (name, email, phone number)</li>
                <li>Government identification (Aadhar card number, GST number)</li>
                <li>Shipping and billing addresses</li>
                <li>Payment information</li>
                <li>Order history and preferences</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-stone-700 space-y-1">
                <li>Process and fulfill your orders</li>
                <li>Communicate about your orders and account</li>
                <li>Provide customer support</li>
                <li>Send promotional communications (with consent)</li>
                <li>Improve our services and website</li>
                <li>Comply with legal obligations</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Information Sharing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-stone-700">We do not sell, trade, or rent your personal information to third parties. We may share information with:</p>
              <ul className="list-disc list-inside text-stone-700 space-y-1 mt-2">
                <li>Service providers who assist in our operations</li>
                <li>Payment processors for transaction processing</li>
                <li>Shipping companies for order delivery</li>
                <li>Legal authorities when required by law</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Security</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-stone-700">We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. Your Aadhar and GST numbers are encrypted and stored securely.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Rights</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-stone-700 space-y-1">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Delete your account and data</li>
                <li>Opt-out of marketing communications</li>
                <li>Data portability</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cookies and Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-stone-700">We use cookies and similar technologies to enhance your browsing experience, analyze website traffic, and personalize content.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-stone-700">If you have questions about this Privacy Policy, please contact us at privacy@techshop.com or call +91-1234567890.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

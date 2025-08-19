
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const About = () => {
  return (
    <div className="min-h-screen bg-stone-50">
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-stone-900 mb-8">About TechShop</h1>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Our Story</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-stone-700">
                Founded in 2020, TechShop has been India's trusted destination for premium technology products. 
                We specialize in providing high-quality laptops, networking equipment, desktop computers, 
                UPS systems, and computer components to individuals and businesses across the country.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-stone-700">
                To democratize access to cutting-edge technology by offering competitive prices, 
                exceptional customer service, and reliable after-sales support. We believe technology 
                should empower everyone to achieve their goals.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Why Choose TechShop?</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-stone-700 space-y-2">
                <li>Authorized dealer for all major brands</li>
                <li>Competitive pricing with regular deals and offers</li>
                <li>Fast and secure shipping across India</li>
                <li>30-day return policy on most products</li>
                <li>Expert customer support team</li>
                <li>Warranty support for all products</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h4 className="font-semibold text-stone-900">Customer Support</h4>
                <p className="text-stone-700">Phone: +91-1234567890</p>
                <p className="text-stone-700">Email: support@techshop.com</p>
              </div>
              <div>
                <h4 className="font-semibold text-stone-900">Business Hours</h4>
                <p className="text-stone-700">Monday - Saturday: 9:00 AM - 7:00 PM</p>
                <p className="text-stone-700">Sunday: 10:00 AM - 6:00 PM</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;

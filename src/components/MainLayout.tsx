import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Header from '@/components/Header';

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-stone-50">
      <Header />

      {/* Render page content */}
      <Outlet />

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 py-12 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center space-x-8 mb-8">
            <Link to="/about" className="text-stone-600 hover:text-stone-900 transition-colors hover:scale-105 transform duration-200">
              About Us
            </Link>
            <Link to="/contact" className="text-stone-600 hover:text-stone-900 transition-colors hover:scale-105 transform duration-200">
              Contact
            </Link>
            <Link to="/support" className="text-stone-600 hover:text-stone-900 transition-colors hover:scale-105 transform duration-200">
              Support
            </Link>
            <Link to="/privacy" className="text-stone-600 hover:text-stone-900 transition-colors hover:scale-105 transform duration-200">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-stone-600 hover:text-stone-900 transition-colors hover:scale-105 transform duration-200">
              Terms of Service
            </Link>
          </div>
          <div className="text-center text-stone-500">
            <p>©2024 TechShop. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;


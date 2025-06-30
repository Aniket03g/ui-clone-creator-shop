
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-stone-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-stone-900 mb-4">Terms of Service</h1>
          <p className="text-stone-600">Last updated: December 2024</p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">Acceptance of Terms</h2>
              <p className="text-stone-700">
                By accessing and using TechShop's website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">Products and Services</h2>
              <div className="space-y-4 text-stone-700">
                <p>TechShop specializes in computer hardware, software, and technology solutions including:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Laptops and desktop computers</li>
                  <li>Computer components and accessories</li>
                  <li>Networking equipment (routers, switches, etc.)</li>
                  <li>UPS and power solutions</li>
                  <li>Software licenses (Microsoft Office 365, Windows, antivirus solutions)</li>
                  <li>Firewall and security solutions</li>
                </ul>
                <p>All product descriptions, pricing, and availability are subject to change without notice.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">Orders and Payment</h2>
              <div className="space-y-4 text-stone-700">
                <ul className="list-disc pl-6 space-y-2">
                  <li>All orders are subject to acceptance and availability</li>
                  <li>We reserve the right to refuse or cancel any order</li>
                  <li>Payment must be received before order processing</li>
                  <li>Prices are in Indian Rupees (INR) and include applicable taxes</li>
                  <li>We accept major credit cards, debit cards, and digital payment methods</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">Shipping and Delivery</h2>
              <div className="space-y-4 text-stone-700">
                <ul className="list-disc pl-6 space-y-2">
                  <li>Delivery times are estimates and not guaranteed</li>
                  <li>Risk of loss passes to you upon delivery</li>
                  <li>We are not liable for delays caused by shipping carriers</li>
                  <li>Additional charges may apply for expedited shipping</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">Returns and Refunds</h2>
              <div className="space-y-4 text-stone-700">
                <ul className="list-disc pl-6 space-y-2">
                  <li>Hardware products may be returned within 30 days of purchase</li>
                  <li>Software licenses are non-refundable once activated</li>
                  <li>Items must be in original condition with all packaging</li>
                  <li>Return shipping costs are the responsibility of the customer</li>
                  <li>Refunds will be processed to the original payment method</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">Warranties</h2>
              <div className="space-y-4 text-stone-700">
                <p>Product warranties are provided by the respective manufacturers. TechShop:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Does not provide additional warranties beyond manufacturer warranties</li>
                  <li>Will assist with warranty claims and replacements</li>
                  <li>Is not responsible for software compatibility issues</li>
                  <li>Recommends professional installation for complex hardware</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">Intellectual Property</h2>
              <p className="text-stone-700">
                All content on this website, including but not limited to text, graphics, logos, images, and software, is the property of TechShop or its content suppliers and is protected by intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">Limitation of Liability</h2>
              <p className="text-stone-700">
                TechShop shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">Governing Law</h2>
              <p className="text-stone-700">
                These terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">Contact Information</h2>
              <div className="text-stone-700">
                <p>For questions about these Terms of Service, please contact us:</p>
                <div className="mt-4 space-y-2">
                  <p>Email: legal@techshop.com</p>
                  <p>Phone: +91-11-1234-5678</p>
                  <p>Address: 123 Tech Street, Delhi, India</p>
                </div>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TermsOfService;

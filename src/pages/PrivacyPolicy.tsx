
import { Card, CardContent } from '@/components/ui/card';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-stone-50">
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-stone-900 mb-4">Privacy Policy</h1>
          <p className="text-stone-600">Last updated: December 2024</p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">Information We Collect</h2>
              <div className="space-y-4 text-stone-700">
                <p>We collect information you provide directly to us, such as when you:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Create an account or make a purchase</li>
                  <li>Subscribe to our newsletter or marketing communications</li>
                  <li>Contact us for customer support</li>
                  <li>Participate in surveys or promotions</li>
                </ul>
                <p>This may include your name, email address, phone number, shipping address, payment information, and preferences.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">How We Use Your Information</h2>
              <div className="space-y-4 text-stone-700">
                <p>We use the information we collect to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Process and fulfill your orders and transactions</li>
                  <li>Provide customer service and technical support</li>
                  <li>Send you important updates about your orders and account</li>
                  <li>Personalize your shopping experience</li>
                  <li>Improve our products and services</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">Information Sharing</h2>
              <div className="space-y-4 text-stone-700">
                <p>We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>With service providers who help us operate our business</li>
                  <li>When required by law or to protect our rights</li>
                  <li>In connection with a business transfer or merger</li>
                  <li>With your explicit consent</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">Data Security</h2>
              <p className="text-stone-700">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">Your Rights</h2>
              <div className="space-y-4 text-stone-700">
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access and update your personal information</li>
                  <li>Request deletion of your personal information</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Request a copy of your data</li>
                </ul>
                <p>To exercise these rights, please contact us at privacy@techshop.com</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">Cookies</h2>
              <p className="text-stone-700">
                We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookie settings through your browser preferences.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">Contact Us</h2>
              <div className="text-stone-700">
                <p>If you have any questions about this Privacy Policy, please contact us:</p>
                <div className="mt-4 space-y-2">
                  <p>Email: privacy@techshop.com</p>
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

export default PrivacyPolicy;

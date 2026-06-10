import Link from 'next/link';
import SocialLinks from '@/components/SocialLinks';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Information Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Information</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/returns" className="text-gray-300 hover:text-white transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/warranty" className="text-gray-300 hover:text-white transition-colors">
                  Warranty
                </Link>
              </li>
              <li>
                <Link href="/instructions" className="text-gray-300 hover:text-white transition-colors">
                  Instructions
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="text-gray-300 hover:text-white transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-300 hover:text-white transition-colors">
                  Shipping Info
                </Link>
              </li>
              {/* Hidden for now
              <li>
                <Link href="/account" className="text-gray-300 hover:text-white transition-colors">
                  My Account
                </Link>
              </li>
              */}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Contact</h3>
            <p className="text-gray-300">
              <span className="font-medium text-white">Email:</span> support@castawaycovers.com
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3 text-white">Follow Us</h3>
            <SocialLinks linkClassName="text-gray-300 hover:text-white" />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Castaway Covers. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        
        {/* Brand Info */}
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold text-yellow-500 mb-2">Evoloop Shop</h2>
          <p className="text-gray-400 max-w-sm">
            Your go-to destination for quality products and a seamless shopping experience.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <h3 className="font-semibold text-lg mb-2">Quick Links</h3>
          <div className="flex flex-col md:flex-col gap-1">
            <a href="/" className="hover:text-yellow-500 transition">Home</a>
            <a href="/products" className="hover:text-yellow-500 transition">Products</a>
            <a href="/about" className="hover:text-yellow-500 transition">About</a>
            <a href="/contact" className="hover:text-yellow-500 transition">Contact</a>
          </div>
        </div>

        {/* Social Icons */}
        <div className="flex flex-col items-center md:items-end gap-2">
          <h3 className="font-semibold text-lg mb-2">Follow Us</h3>
          <div className="flex gap-4 text-gray-400">
            <a href="#" className="hover:text-yellow-500 transition"><FaFacebookF size={20} /></a>
            <a href="#" className="hover:text-yellow-500 transition"><FaTwitter size={20} /></a>
            <a href="#" className="hover:text-yellow-500 transition"><FaInstagram size={20} /></a>
            <a href="#" className="hover:text-yellow-500 transition"><FaLinkedinIn size={20} /></a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-10 border-t border-gray-700 pt-4 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Evoloop Shop. All rights reserved.
      </div>
    </footer>
  );
}

import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import toast from "react-hot-toast";

export default function Footer() {
  const handleSubscribe = (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();

    // Simple regex email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      toast.error("Please enter a valid email address!");
      return;
    }

    setTimeout(() => {
      toast.success("You have subscribed successfully!");
      e.target.reset();
    }, 800);
  };

  return (
    <footer className="bg-gray-900 text-white py-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* Brand Info */}
        <div>
          <h2 className="text-2xl font-bold text-yellow-500 mb-3">Evoloop Shop</h2>
          <p className="text-gray-400 mb-6">
            Your go-to destination for quality products and a seamless shopping experience.
          </p>
          <p className="text-gray-500 text-sm">
            🚀 Fast shipping | 🔒 Secure Payments | ⭐ Trusted by 10k+ Customers
          </p>
        </div>

        {/* Quick Links */}
        <div className="text-center md:text-left">
          <h3 className="font-semibold text-lg mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="/" className="hover:text-yellow-500 transition">Home</a></li>
            <li><a href="/products" className="hover:text-yellow-500 transition">Products</a></li>
            <li><a href="/about" className="hover:text-yellow-500 transition">About</a></li>
            <li><a href="/contact" className="hover:text-yellow-500 transition">Contact</a></li>
          </ul>
        </div>

        {/* Newsletter + Social */}
        <div>
          <h3 className="font-semibold text-lg mb-3">📩 Join Our Newsletter</h3>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 mb-5">
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-md border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
            <button
              type="submit"
              className="bg-yellow-500 text-black px-5 py-2 rounded-md font-semibold hover:bg-yellow-600 transition"
            >
              Subscribe
            </button>
          </form>

          <h3 className="font-semibold text-lg mb-3">Follow Us</h3>
          <div className="flex gap-5 text-gray-400">
            <a href="#" className="hover:text-yellow-500 transition"><FaFacebookF size={22} /></a>
            <a href="#" className="hover:text-yellow-500 transition"><FaTwitter size={22} /></a>
            <a href="#" className="hover:text-yellow-500 transition"><FaInstagram size={22} /></a>
            <a href="#" className="hover:text-yellow-500 transition"><FaLinkedinIn size={22} /></a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-12 border-t border-gray-700 pt-5 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Evoloop Shop. All rights reserved.
      </div>
    </footer>
  );
}

import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">

      {/* Hero Section */}
      <section className="bg-black text-white flex flex-col justify-center items-center h-[70vh] text-center px-6 md:px-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
          Welcome to <span className="text-yellow-400">Evoloop Shop</span>
        </h1>
        <p className="text-lg sm:text-xl mb-8 max-w-2xl text-gray-200">
          Discover the latest gadgets, electronics, and accessories all in one place.
          Shop now and upgrade your lifestyle.
        </p>
        <Link
          to="/products"
          className="bg-yellow-400 text-black font-semibold px-8 py-3 rounded-full hover:bg-yellow-500 shadow-lg transition-all duration-300"
        >
          Shop Now
        </Link>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          
          <div className="p-8 bg-white rounded-xl shadow hover:shadow-2xl transition-transform duration-300 transform hover:-translate-y-2">
            <h2 className="font-bold text-2xl mb-3 text-gray-800">Free Shipping</h2>
            <p className="text-gray-600">On all orders over $50, delivered fast and safe to your doorstep.</p>
          </div>

          <div className="p-8 bg-white rounded-xl shadow hover:shadow-2xl transition-transform duration-300 transform hover:-translate-y-2">
            <h2 className="font-bold text-2xl mb-3 text-gray-800">Secure Payments</h2>
            <p className="text-gray-600">Safe and encrypted checkout process for your peace of mind.</p>
          </div>

          <div className="p-8 bg-white rounded-xl shadow hover:shadow-2xl transition-transform duration-300 transform hover:-translate-y-2">
            <h2 className="font-bold text-2xl mb-3 text-gray-800">24/7 Support</h2>
            <p className="text-gray-600">Our dedicated team is here to help you anytime, anywhere.</p>
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 text-black py-16 px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Ready to upgrade your tech?
        </h2>
        <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto">
          Explore our collection of top-quality gadgets and electronics. Fast delivery, secure checkout, and guaranteed satisfaction.
        </p>
        <Link
          to="/products"
          className="bg-black text-yellow-400 font-semibold px-8 py-3 rounded-full hover:bg-gray-900 shadow-lg transition-all duration-300"
        >
          Browse Products
        </Link>
      </section>

    </div>
  );
}

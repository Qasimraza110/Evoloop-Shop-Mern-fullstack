import React from "react";
import { FaStar, FaShippingFast, FaHeadset } from "react-icons/fa";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">

        {/* Hero Section */}
        <header className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
            About <span className="text-yellow-400">Evoloop Shop</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Welcome to <span className="font-semibold text-yellow-500">Evoloop Shop</span>, your trusted online
            destination for high-quality products at unbeatable prices. We’re
            dedicated to making shopping easy, fast, and enjoyable.
          </p>
        </header>

        {/* Mission + Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
          <section className="bg-gray-50 p-6 sm:p-8 rounded-2xl shadow hover:shadow-lg transition">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Our Mission</h2>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              At Evoloop Shop, our mission is to provide customers with top-notch
              products, seamless shopping experiences, and outstanding customer
              service. We work hard to ensure online shopping is effortless,
              secure, and reliable for everyone.
            </p>
          </section>

          <section className="bg-gray-50 p-6 sm:p-8 rounded-2xl shadow hover:shadow-lg transition">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Our Vision</h2>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              Our vision is to become a leading e-commerce platform that connects
              people with products they love while ensuring trust, quality, and
              innovation every step of the way.
            </p>
          </section>
        </div>

        {/* Why Choose Us */}
        <section>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6 text-center">
            Why Choose <span className="text-yellow-400">Evoloop Shop?</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            
            <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-xl transition">
              <FaStar className="text-yellow-400 text-4xl mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Quality Products</h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                We carefully select and test our items to guarantee long-lasting value.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-xl transition">
              <FaShippingFast className="text-yellow-400 text-4xl mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Fast Delivery</h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Quick and reliable delivery so you receive your orders on time.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-xl transition">
              <FaHeadset className="text-yellow-400 text-4xl mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Customer Support</h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Our dedicated support team is always ready to assist with your needs.
              </p>
            </div>
          </div>
        </section>

        <footer className="text-center text-gray-600 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
          At Evoloop Shop, we believe shopping is more than buying—it’s an
          experience you should enjoy. Thank you for trusting us and being part
          of our journey.
        </footer>
      </div>
    </div>
  );
}

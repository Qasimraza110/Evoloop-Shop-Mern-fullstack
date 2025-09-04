import { useForm } from "react-hook-form";
import { useState } from "react";
import API from "../api";

export default function Contact() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [message, setMessage] = useState("");

  const onSubmit = async (data) => {
    try {
      await API.post("/contacts", data);
      setMessage("✅ Your message has been sent successfully!");
      reset();
      setTimeout(() => setMessage(""), 4000);
    } catch (err) {
      setMessage("❌ Failed to send message. Please try again.");
      setTimeout(() => setMessage(""), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center px-4 py-16">
      
      {/* Header */}
      <header className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-800">
          Get in <span className="text-yellow-400">Touch</span>
        </h1>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-lg">
          Have questions or suggestions? Send us a message and we’ll get back to you as soon as possible.
        </p>
      </header>

      {/* Form */}
      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-lg flex flex-col gap-6"
      >
        {message && (
          <p className={`text-center font-medium ${message.startsWith("✅") ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}

        <input 
          {...register("name", { required: true })} 
          placeholder="Your Name" 
          className="p-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none transition"
        />
        {errors.name && <span className="text-red-500 text-sm">Name is required</span>}

        <input 
          {...register("email", { required: true })} 
          placeholder="Your Email" 
          type="email"
          className="p-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none transition"
        />
        {errors.email && <span className="text-red-500 text-sm">Email is required</span>}

        <textarea 
          {...register("message", { required: true })} 
          placeholder="Your Message" 
          rows="5"
          className="p-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none transition"
        />
        {errors.message && <span className="text-red-500 text-sm">Message is required</span>}

        <button 
          type="submit" 
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 rounded-lg transition"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}

import React from "react";
import { ArrowRight, Phone } from "lucide-react";
import { ShieldCheck, BarChart, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/pi_logo.png";
import fb from "../../assets/fb.png";
import ig from "../../assets/ig.png";
import Linkedin from "../../assets/Linkedin.png";
import Xlogo from "../../assets/X.png";
import yt from "../../assets/yt.png";
import bgImage from "../../assets/bg.jpg";

const Home = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/login-user");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Hero Section */}
      <header
        className="relative py-44 px-6 text-center h-[80vh] bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="absolute inset-0 bg-white bg-opacity-85"></div>

        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl text-orange-500 font-bold">
            Phoenix Exam Portal
          </h1>
          <p className="mt-4 text-lg md:text-xl">
            Your Gateway to Smarter Assessments
          </p>
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleClick}
              className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-6 py-3 rounded-xl flex items-center gap-2"
            >
              Login to Portal <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Supervisor Section */}
      <section className="py-16 px-6 md:px-12 bg-gray-100 text-gray-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-inner">
        <div className="max-w-xl text-center md:text-left">
          <h2 className="text-3xl font-semibold mb-6">
            Get Your Supervisor Account
          </h2>
          <p className="text-lg">
            Become a supervisor to manage assessments and oversee student exams.
          </p>
        </div>

        <div className="w-full md:w-1/3 bg-white shadow-md p-6 rounded-2xl text-center space-y-4">
          <h3 className="text-2xl font-semibold">Contact for Account</h3>
          <p className="text-base">For account creation, reach out to us.</p>
          <div className="flex justify-center items-center gap-2">
            <Phone size={30} className="text-green-600" />
            <a
              href="tel:8483819210"
              className="text-blue-600 text-3xl font-semibold hover:underline"
            >
              8483819210
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 md:px-12 bg-white text-gray-800">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 text-center">
          <div className="shadow-lg p-6 rounded-2xl border-t-4 border-orange-500 hover:scale-105 transform transition-transform">
            <ShieldCheck className="w-12 h-12 mx-auto text-orange-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Fast & Secure</h3>
            <p>Experience smooth and secure online assessments without hassle.</p>
          </div>

          <div className="shadow-lg p-6 rounded-2xl border-t-4 border-blue-600 hover:scale-105 transform transition-transform">
            <BarChart className="w-12 h-12 mx-auto text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Live Results</h3>
            <p>Get instant results and detailed performance analytics.</p>
          </div>

          <div className="shadow-lg p-6 rounded-2xl border-t-4 border-orange-500 hover:scale-105 transform transition-transform">
            <UserPlus className="w-12 h-12 mx-auto text-orange-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Multi-role Dashboard</h3>
            <p>Separate views for Students, Supervisors, and Admins.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-600 text-white py-10 px-6 mt-auto">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          {/* Company Info */}
          <div className="flex flex-col items-center md:items-start">
            <img
              src={logo}
              alt="Phoenix Logo"
              className="rounded-full mb-4 h-20 w-20 object-cover"
            />
            <p className="text-lg font-semibold">Phoenix Infotech</p>
            <p className="text-sm">
              Anusaya complex, Near Bardeshkar Petrol Station, Gargoti, India
            </p>
            <p className="text-sm">
              HQ - Near Bus Stand, Gadhinglaj, India
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-lg font-semibold mb-2">Important Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/about" className="hover:text-blue-300">About Us</a></li>
              <li><a href="/terms" className="hover:text-blue-300">Terms of Service</a></li>
              <li><a href="/privacy" className="hover:text-blue-300">Privacy Policy</a></li>
              <li><a href="/contact" className="hover:text-blue-300">Contact Us</a></li>
            </ul>
          </div>

          {/* Social */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-lg font-semibold mb-2">Follow Us</h4>
            <div className="flex gap-4 mb-4">
              {[yt, ig, fb, Xlogo, Linkedin].map((icon, index) => (
                <img
                  key={index}
                  src={icon}
                  alt="social"
                  className="h-10 w-10 hover:bg-blue-500 rounded-md p-1 transition-colors"
                />
              ))}
            </div>
            <p className="text-xs">
              Created by{" "}
              <a
                href="https://www.linkedin.com/in/virendrachavan-in/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-white"
              >
                Virendra Chavan
              </a>
            </p>
            <p className="mt-2 text-xs">
              &copy; {new Date().getFullYear()} Phoenix Exam Portal. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

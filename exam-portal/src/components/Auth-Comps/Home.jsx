import React from "react";
import { ArrowRight,Phone,User } from "lucide-react";
import logo from "../../assets/pi_logo.png"; // Adjust the path as needed
import { useNavigate } from "react-router-dom"; 
import { ShieldCheck, BarChart, UserPlus } from "lucide-react";
import fb from "../../assets/fb.png"
import ig from "../../assets/ig.png"
import Linkedin from "../../assets/Linkedin.png"
import Xlogo from "../../assets/X.png"
import yt from "../../assets/yt.png"
import bgImage from "../../assets/bg.jpg"


const Home = () => {

    const navigate = useNavigate(); // Create navigate function

    const handleClick = () => {
      navigate("/login-user"); // Navigate to /login-user
    };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Hero Section */}
      <header
      className="relative py-44 px-6 text-center h-[80vh] "
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Dark overlay to reduce background image opacity */}
      <div className="absolute inset-0 bg-white bg-opacity-85"></div>

      {/* Foreground content */}
      <div className="relative z-10 ">
        <h1 className="text-4xl md:text-6xl text-orange-500 font-bold transition-transform transform duration-700 ease-in-out">
          Phoenix Exam Portal
        </h1>
        <p className="mt-4 text-lg md:text-xl transition-all duration-700 ease-in-out">
          Your Gateway to Smarter Assessments
        </p>
        <div className="mt-6 flex justify-center transition-all duration-700 ease-in-out">
          <button
            onClick={handleClick}
            className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-300"
          >
            Login to Portal <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>

      <section className="h-[40vh] py-16 px-6 md:px-12 bg-gray-100 text-gray-800 flex items-center justify-between
                           max-sm:flex-col shadow-inner">

        <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl max-lg:text-xl  font-semibold mb-6">Get Your Supervisor Account</h2>
            <p className="text-lg mb-10 max-lg:text-xs ">
            Become a supervisor to manage assessments and oversee student exams.
            </p>
        </div>

        <div className="flex flex-col w-1/3 items-center space-y-4 bg-white shadow-md p-4 rounded-2xl
        max-sm:w-full">
            
            <h3 className="text-2xl font-semibold max-lg:text-xl ">Contact for Account</h3>
            <p className="text-base max-lg:text-xs">For account creation, reach out to us.</p>
            <div className="flex justify-center items-center gap-2">
              <span className="text-xl font-medium max-lg:text-base"><Phone size={30} className="text-green-600 " /></span>
              <a href="tel:9890819210" className="text-blue-600 text-4xl font-semibold hover:underline max-lg:text-xl">
              9890819210
              </a>
            </div>
        </div>
          
    </section>

      {/* Features Section */}
      <section className="py-16 px-6 md:px-12 bg-white text-gray-800 ">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 text-center">
        
        {/* Fast & Secure Feature */}
        <div className="shadow-lg p-6 rounded-2xl border-t-4 border-orange-500 transform transition-transform hover:scale-105">
          <ShieldCheck className="w-12 h-12 mx-auto text-orange-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Fast & Secure</h3>
          <p>Experience smooth and secure online assessments without hassle.</p>
        </div>
        
        {/* Live Results Feature */}
        <div className="shadow-lg p-6 rounded-2xl border-t-4 border-blue-600 transform transition-transform hover:scale-105">
          <BarChart className="w-12 h-12 mx-auto text-blue-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Live Results</h3>
          <p>Get instant results and detailed performance analytics.</p>
        </div>

        {/* Multi-role Dashboard Feature */}
        <div className="shadow-lg p-6 rounded-2xl border-t-4 border-orange-500 transform transition-transform hover:scale-105">
          <UserPlus className="w-12 h-12 mx-auto text-orange-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Multi-role Dashboard</h3>
          <p>Separate views for Students, Supervisors, and Admins.</p>
        </div>

      

      </div>
    </section>

      {/* Footer */}

    <footer className="bg-blue-600 text-white py-10 px-6 mt-auto">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
        
        {/* Logo and Company Info */}
        <div className="flex flex-col items-center md:items-start">
          <img
            src={logo}// Replace with your logo path
            alt="Phoenix Logo"
            className="rounded-full mb-4 h-20 aspect-square"
          />
          <p className="text-lg font-semibold" onclick=""()=>{navigate("/signup-user")}>Phoenix Infotech</p>
          <p className="text-sm">Phoenix Infotech, Near Bus Stand, Gadhinglaj, India</p>
        </div>
        
        {/* Important Links */}
        <div className="flex flex-col items-center md:items-start">
          <h4 className="text-lg font-semibold mb-2">Important Links</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/about" className="hover:text-blue-300">About Us</a></li>
            <li><a href="/terms" className="hover:text-blue-300">Terms of Service</a></li>
            <li><a href="/privacy" className="hover:text-blue-300">Privacy Policy</a></li>
            <li><a href="/contact" className="hover:text-blue-300">Contact Us</a></li>
          </ul>
        </div>

        {/* Social Media & Copyright */}
        <div className="flex flex-col items-center md:items-start">
          <h4 className="text-lg font-semibold mb-2">Follow Us</h4>
          <div className="flex gap-4 mb-4">



            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
            <img src={yt} className="aspect-square h-10 hover:bg-blue-500 rounded-md transition-colors p-1" />
                </a>


            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <img src={ig} className="aspect-square h-10 hover:bg-blue-500 rounded-md transition-colors p-1" />
                </a>


            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <img src={fb} className="aspect-square h-10 hover:bg-blue-500 rounded-md transition-colors p-1" />
            </a>

           <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
           <img src={Xlogo} className="aspect-square h-10 hover:bg-blue-500 rounded-md transition-colors p-1" />
            </a>

            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <img src={Linkedin} className="aspect-square h-10 hover:bg-blue-500 rounded-md transition-colors p-1" />
            </a> 


 
          </div>
          <p className="text-xs mt-2">Created by Virendra Chavan</p>
          <p className="mt-2 text-xs">&copy; {new Date().getFullYear()} Phoenix Exam Portal. All rights reserved.</p>
        </div>

      </div>
    </footer>
    </div>
  );
};

export default Home;

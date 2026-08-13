import React from 'react';
import { Mail, Phone, MapPin, Globe, Link as LinkIcon, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-[#0b120f] text-[#8e9894] py-16 px-6 md:px-12 relative overflow-hidden mt-auto">
      {/* Top Border Glow / Subtlety (Optional, from design) */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#2a3f33] to-transparent opacity-50"></div>
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 relative z-10 mb-16">
        
        {/* Left Column: Brand */}
        <div className="md:col-span-5 space-y-6">
          <div className="flex items-center gap-2">
            <span className="text-[#a3b8aa] text-2xl">♥</span>
            <h2 className="text-3xl font-bold text-white tracking-tight">AyurWell</h2>
          </div>
          <p className="text-sm leading-relaxed text-[#7e8c85]">
            AyurWell is an advanced Ayurvedic medical AI assistant designed to harmonize traditional knowledge with modern technology. Our intelligent chatbot is trained on extensive traditional knowledge bases to provide personalized natural health insights, remedy recommendations, and real-time guidance tailored to your unique wellness journey.
          </p>
        </div>

        {/* Middle Column: Developed By */}
        <div className="md:col-span-4 space-y-6">
          <h3 className="text-lg font-semibold text-white tracking-wide">Developed By:</h3>
          <ul className="space-y-4">
            <li>
              <a 
                href="https://github.com/Vernit185" 
                target="_blank" 
                rel="noreferrer"
                className="text-[#98a8a0] hover:text-white transition-colors duration-200"
              >
                Vernit Garg
              </a>
            </li>
          </ul>
        </div>

        {/* Right Column: Contact Me */}
        <div className="md:col-span-3 space-y-6">
          <h3 className="text-lg font-semibold text-white tracking-wide">Contact Me</h3>
          <ul className="space-y-4">
            <li>
              <a href="mailto:vernitg185@gmail.com" className="flex items-center gap-3 text-sm hover:text-white transition-colors duration-200">
                <Mail className="w-4 h-4 text-[#687a71]" />
                vernitg185@gmail.com
              </a>
            </li>
            <li>
              <a href="tel:+919823596186" className="flex items-center gap-3 text-sm hover:text-white transition-colors duration-200">
                <Phone className="w-4 h-4 text-[#687a71]" />
                +91 9823596186
              </a>
            </li>
            <li className="flex items-center gap-3 text-sm">
              <MapPin className="w-4 h-4 text-[#687a71]" />
              Pune, India
            </li>
          </ul>
        </div>
      </div>

      {/* Middle Divider & Icons */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between border-t border-[#1e2e25] pt-8 pb-12 relative z-10">
        <div className="flex gap-4 mb-4 md:mb-0">
          <Globe className="w-5 h-5 text-[#485950] hover:text-white cursor-pointer transition-colors" />
          <LinkIcon className="w-5 h-5 text-[#485950] hover:text-white cursor-pointer transition-colors" />
          <MessageCircle className="w-5 h-5 text-[#485950] hover:text-white cursor-pointer transition-colors" />
          <Globe className="w-5 h-5 text-[#485950] hover:text-white cursor-pointer transition-colors" />
        </div>
        <p className="text-xs text-[#586960]">
          © 2026 AyurWell. All rights reserved.
        </p>
      </div>

      {/* HUGE Outline Text at Bottom */}
      <div className="relative w-full flex justify-center items-end overflow-hidden mt-8 select-none pointer-events-none">
        <h1 
          className="text-[12vw] font-black tracking-widest leading-none text-transparent"
          style={{ WebkitTextStroke: '2px #2a3f33' }}
        >
          AYURWELL
        </h1>
      </div>
    </footer>
  );
}

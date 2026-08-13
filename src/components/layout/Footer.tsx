import React from 'react';
import { Mail, Phone, MapPin, Globe, Link as LinkIcon, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-primary text-white py-16 px-6 md:px-12 relative overflow-hidden mt-auto">
      {/* Top Border */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-white/20"></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 relative z-10 mb-16">

        {/* Left Column: Brand */}
        <div className="md:col-span-5 space-y-6">
          <div className="flex items-center gap-2">
            <span className="text-secondary-bg text-2xl">🌿</span>
            <h2 className="text-3xl font-bold text-white tracking-tight">AyurWell</h2>
          </div>
          <p className="text-sm leading-relaxed text-white/80">
            AyurWell is an advanced Ayurvedic medical AI assistant designed to harmonize traditional knowledge with modern technology. Our intelligent chatbot is trained on extensive traditional knowledge bases to provide personalized natural health insights, remedy recommendations, and real-time guidance tailored to your unique wellness journey.
          </p>
        </div>

        {/* Middle Column: Developed By */}
        <div className="md:col-span-4 space-y-6">
          <h3 className="text-lg font-semibold text-white tracking-wide">Developed By:</h3>
          <ul className="space-y-4">
            <li>
              <a href="https://github.com/Vernit185" target="_blank" rel="noreferrer" className="text-white/80 hover:text-white transition-colors duration-200 flex items-center gap-2">
                <LinkIcon className="w-4 h-4" />
                Chinmay Jain
              </a>
            </li>
            <li>
              <a href="#" target="_blank" rel="noreferrer" className="text-white/80 hover:text-white transition-colors duration-200 flex items-center gap-2">
                <LinkIcon className="w-4 h-4" />
                Saksham Jagtap
              </a>
            </li>
            <li>
              <a href="https://github.com/Vernit185" target="_blank" rel="noreferrer" className="text-white/80 hover:text-white transition-colors duration-200 flex items-center gap-2">
                <LinkIcon className="w-4 h-4" />
                Vernit Garg
              </a>
            </li>
            <li>
              <a href="#" target="_blank" rel="noreferrer" className="text-white/80 hover:text-white transition-colors duration-200 flex items-center gap-2">
                <LinkIcon className="w-4 h-4" />
                Tanmay Joshi
              </a>
            </li>
          </ul>
        </div>

        {/* Right Column: Contact Me */}
        <div className="md:col-span-3 space-y-6">
          <h3 className="text-lg font-semibold text-white tracking-wide">Contact Me</h3>
          <ul className="space-y-4">
            <li>
              <a href="mailto:vernitg185@gmail.com" className="flex items-center gap-3 text-sm hover:text-white text-white/80 transition-colors duration-200">
                <Mail className="w-4 h-4" />
                vernit.gerg25@pccoepune.org
              </a>
            </li>
            <li>
              <a href="tel:+919823596186" className="flex items-center gap-3 text-sm hover:text-white text-white/80 transition-colors duration-200">
                <Phone className="w-4 h-4" />
                PHONE NOs
              </a>
            </li>
            <li className="flex items-center gap-3 text-sm text-white/80">
              <MapPin className="w-4 h-4" />
              Pune, India
            </li>
          </ul>
        </div>
      </div>

      {/* Middle Divider & Icons */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between border-t border-white/20 pt-8 pb-12 relative z-10">
        <div className="flex gap-4 mb-4 md:mb-0">
          <a href="#" className="text-white/80 hover:text-white cursor-pointer transition-colors"><Globe className="w-5 h-5" /></a>
          <a href="#" className="text-white/80 hover:text-white cursor-pointer transition-colors"><MessageCircle className="w-5 h-5" /></a>
        </div>
        <p className="text-xs text-white/80">
          © 2026 AyurWell. All rights reserved.
        </p>
      </div>

      {/* HUGE Outline Text at Bottom */}
      <div className="relative w-full flex justify-center items-end overflow-hidden mt-8 select-none pointer-events-none opacity-20">
        <h1
          className="text-[12vw] font-black tracking-widest leading-none text-transparent"
          style={{ WebkitTextStroke: '2px #FFFFFF' }}
        >
          AYURWELL
        </h1>
      </div>
    </footer>
  );
}

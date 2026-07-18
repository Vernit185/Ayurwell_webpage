"use client";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Link,
  MessageCircle,
} from "lucide-react";
import { FooterBackgroundGradient } from "@/components/ui/hover-footer";
import { TextHoverEffect } from "@/components/ui/hover-footer";

function HoverFooter() {
  // Footer link data
  const footerLinks = [
    {
      title: "Developed By:",
      links: [
        { label: "Vernit Garg", href: "https://github.com/Vernit185" },
      ],
    },
  ];

  // Contact info data
  const contactInfo = [
    {
      icon: <Mail size={18} className="text-ayur-300" />,
      text: "vernitg185@gmail.com",
      href: "mailto:vernitg185@gmail.com",
    },
    {
      icon: <Phone size={18} className="text-ayur-300" />,
      text: "+91 9823596186",
      href: "tel:+919823596186",
    },
    {
      icon: <MapPin size={18} className="text-ayur-300" />,
      text: "Pune, India",
    },
  ];

  // Social media icons
  const socialLinks = [
    { icon: <Globe size={20} />, label: "Facebook", href: "#" },
    { icon: <Link size={20} />, label: "Instagram", href: "#" },
    { icon: <MessageCircle size={20} />, label: "Twitter", href: "#" },
    { icon: <Globe size={20} />, label: "Globe", href: "#" },
  ];

  return (
    <footer className="bg-ayur-950/80 backdrop-blur-xl border border-ayur-800 shadow-premium-dark relative h-fit rounded-3xl overflow-hidden m-8">
      <div className="max-w-7xl mx-auto p-14 z-40 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-16 pb-12">
          {/* Brand section */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-ayur-300 text-3xl font-extrabold">
                &hearts;
              </span>
              <span className="text-white text-3xl font-bold font-heading">AyurWell</span>
            </div>
            <p className="text-sm text-ayur-400 leading-relaxed">
              AyurWell is an advanced Ayurvedic medical AI assistant designed to harmonize traditional knowledge with modern technology. Our intelligent chatbot is trained on extensive traditional knowledge bases to provide personalized natural health insights, remedy recommendations, and real-time guidance tailored to your unique wellness journey.
            </p>
          </div>

          {/* Footer link sections */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="text-white text-lg font-semibold mb-6">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label} className="relative w-fit">
                    <a
                      href={link.href}
                      className="text-ayur-400 hover:text-ayur-300 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact section */}
          <div className="md:justify-self-end">
            <h4 className="text-white text-lg font-semibold mb-6">
              Contact Me
            </h4>
            <ul className="space-y-4">
              {contactInfo.map((item, i) => (
                <li key={i} className="flex items-center space-x-3 text-ayur-400">
                  {item.icon}
                  {item.href ? (
                    <a
                      href={item.href}
                      className="hover:text-ayur-300 transition-colors"
                    >
                      {item.text}
                    </a>
                  ) : (
                    <span className="hover:text-ayur-300 transition-colors">
                      {item.text}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm space-y-4 md:space-y-0 pb-4">
          {/* Social icons */}
          <div className="flex space-x-6 text-ayur-500">
            {socialLinks.map(({ icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="hover:text-ayur-300 transition-colors z-50 relative"
              >
                {icon}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-center md:text-left text-ayur-500 z-50 relative">
            &copy; {new Date().getFullYear()} AyurWell. All rights reserved.
          </p>
        </div>

        <hr className="border-t border-ayur-800 mb-8 mt-4 relative z-50" />
      </div>

      {/* Text hover effect */}
      <div className="lg:flex hidden h-[30rem] -mt-52 -mb-36">
        <TextHoverEffect text="AyurWell" className="z-50" />
      </div>

      <FooterBackgroundGradient />
    </footer>
  );
}

export default HoverFooter;

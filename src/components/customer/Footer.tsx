import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

const Footer = () => {
  const footerlinks = [
    {
      title: "Services",
      links: ["Consulting", "Support", "Solutions", "Training"],
    },
    {
      title: "Support",
      links: ["Help Center", "Contact Us", "FAQs", "Documentation"],
    },
    {
      title: "Legal",
      links: [
        "Privacy Policy",
        "Terms of Service",
        "Cookie Policy",
        "Compliance",
      ],
    },
    {
      title: "Company",
      links: ["About Us", "Blog", "Careers", "Press Kit"],
    },
  ];

  const socialMedia = [
    {
      icon: Facebook,
      platform: "Facebook",
      url: "https://facebook.com",
      color: "hover:text-blue-200",
    },
    {
      icon: Twitter,
      platform: "Twitter",
      url: "https://twitter.com",
      color: "hover:text-blue-200",
    },
    {
      icon: Linkedin,
      platform: "LinkedIn",
      url: "https://linkedin.com",
      color: "hover:text-blue-200",
    },
    {
      icon: Instagram,
      platform: "Instagram",
      url: "https://instagram.com",
      color: "hover:text-blue-200",
    },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Newsletter Section */}
      <div className="border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-white mb-2">
                Stay Updated
              </h3>
              <p className="text-gray-400 text-sm sm:text-base">
                Subscribe to our newsletter for latest updates and exclusive
                offers.
              </p>
            </div>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 sm:px-6 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors text-sm sm:text-base"
              />
              <button className="px-4 sm:px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all flex items-center gap-2">
                <span className="hidden sm:inline">Subscribe</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Grid Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-6 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {/* Logo & Description */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-2 mb-6 sm:mb-0">
            <div className="mb-4">
              <h2 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                HSM
              </h2>
              <p className="text-gray-400 text-sm sm:text-base mt-2 leading-relaxed">
                Building innovative solutions to transform your business and
                deliver exceptional results.
              </p>
            </div>

            {/* Social Media - Desktop */}
            <div className="hidden sm:flex items-center gap-4 mt-6">
              {socialMedia.map((social) => (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center transition-all hover:bg-blue-600 ${social.color}`}
                  aria-label={social.platform}>
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerlinks.map((section) => (
            <div key={section.title} className="col-span-1">
              <h4 className="text-white font-black text-sm sm:text-base mb-4 uppercase tracking-wider">
                {section.title}
              </h4>
              <ul className="space-y-2 sm:space-y-3">
                {section.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-gray-400 text-xs sm:text-sm hover:text-blue-400 transition-colors flex items-center gap-2 group">
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Mobile Social Media */}
        <div className="sm:hidden mb-12">
          <h4 className="text-white font-black text-sm mb-4 uppercase tracking-wider">
            Follow Us
          </h4>
          <div className="flex items-center gap-4">
            {socialMedia.map((social) => (
              <a
                key={social.platform}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center transition-all ${social.color}`}
                aria-label={social.platform}>
                <social.icon className="w-6 h-6" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            {/* Copyright */}
            <p className="text-gray-500 text-xs sm:text-sm">
              &copy; {currentYear} HSM Inc. All rights reserved.
            </p>

            {/* Bottom Links */}
            <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm flex-wrap justify-center">
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors">
                Privacy Policy
              </a>
              <span className="text-gray-600">•</span>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors">
                Terms of Service
              </a>
              <span className="text-gray-600">•</span>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors">
                Cookie Settings
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

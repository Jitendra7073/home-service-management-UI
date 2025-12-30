import React from "react";
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/* 
   TYPES
 */

type FooterOption = {
  label: string;
  endPoint: string;
  tooltips?: string; 
};

type FooterSection = {
  title: string;
  options: FooterOption[];
};

type SocialMedia = {
  icon: React.ElementType;
  platform: string;
  url: string;
  color: string;
};

const Footer: React.FC = () => {
  const BASE_URL = process.env.NEXT_PUBLIC_FRONTEND_URL;

  const footerlinks: FooterSection[] = [
    {
      title: "Bookings",
      options: [
        {
          label: "Pending",
          endPoint: `${BASE_URL}/customer/booking?status=pending`,
        },
        {
          label: "Confirmed",
          endPoint: `${BASE_URL}/customer/booking?status=confirmed`,
        },
        {
          label: "Completed",
          endPoint: `${BASE_URL}/customer/booking?status=completed`,
        },
        {
          label: "Cancelled",
          endPoint: `${BASE_URL}/customer/booking?status=cancelled`,
        },
      ],
    },
    {
      title: "Legal",
      options: [
        {
          label: "Privacy Policy",
          endPoint: "",
          tooltips: "Not yet created!",
        },
        {
          label: "Terms of Service",
          endPoint: "",
          tooltips: "Not yet created!",
        },
        {
          label: "Cookie Policy",
          endPoint: "",
          tooltips: "Not yet created!",
        },
        {
          label: "Compliance",
          endPoint: "",
          tooltips: "Not yet created!",
        },
      ],
    },
    {
      title: "Company",
      options: [
        {
          label: "Explore",
          endPoint: `${BASE_URL}/customer/explore`,
        },
        {
          label: "Booking",
          endPoint: `${BASE_URL}/customer/booking`,
        },
        {
          label: "Cart",
          endPoint: `${BASE_URL}/customer/cart`,
        },
        {
          label: "Profile",
          endPoint: `${BASE_URL}/customer/profile`,
        },
      ],
    },
  ];

  const socialMedia: SocialMedia[] = [
    {
      icon: Facebook,
      platform: "Facebook",
      url: "https://facebook.com",
      color: "hover:text-blue-400",
    },
    {
      icon: Twitter,
      platform: "Twitter",
      url: "https://twitter.com",
      color: "hover:text-sky-400",
    },
    {
      icon: Linkedin,
      platform: "LinkedIn",
      url: "https://linkedin.com",
      color: "hover:text-blue-500",
    },
    {
      icon: Instagram,
      platform: "Instagram",
      url: "https://instagram.com",
      color: "hover:text-pink-400",
    },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-8 mb-16">
          {/* Brand */}
          <div className="col-span-2">
            <h2 className="text-3xl font-black text-blue-500">HSM</h2>
            <p className="text-gray-400 mt-3">
              Building innovative solutions to transform your business.
            </p>

            <div className="hidden sm:flex gap-4 mt-6">
              {socialMedia.map((social) => (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center transition ${social.color}`}
                  aria-label={social.platform}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {footerlinks.map((section) => (
            <div key={section.title}>
              <h4 className="text-white font-black mb-4 uppercase text-sm">
                {section.title}
              </h4>

              <ul className="space-y-3">
                {section.options.map((item, index) => (
                  <li key={index}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <a
                          href={item.endPoint}
                          target="_blank"
                          className="text-gray-400 hover:text-blue-400 flex items-center gap-2 group text-sm"
                        >
                          <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition" />
                          {item.label}
                        </a>
                      </TooltipTrigger>

                      {item.tooltips && (
                        <TooltipContent>
                          <p>{item.tooltips}</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Mobile Social */}
        <div className="sm:hidden mb-12">
          <h4 className="text-white font-black mb-4 uppercase text-sm">
            Follow Us
          </h4>
          <div className="flex gap-4">
            {socialMedia.map((social) => (
              <a
                key={social.platform}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center ${social.color}`}
              >
                <social.icon className="w-6 h-6" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 py-6 text-center text-gray-500 text-sm">
        © {currentYear} HSM Inc. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

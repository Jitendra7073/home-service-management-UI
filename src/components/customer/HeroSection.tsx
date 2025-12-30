import {
  Star,
  Shield,
  ArrowRight,
  Sparkles,
  Calendar,
  MapPin,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const HeroSection = () => {
  const features = [
    { icon: Shield, text: "Background-verified professionals" },
    { icon: Star, text: "Quality service guarantee" },
    { icon: Calendar, text: "Flexible scheduling options" },
    { icon: MapPin, text: "Serve your local area" },
  ];

  return (
    <div className="relative overflow-hidden py-10 md:py-20">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 backdrop-blur-sm rounded-full shadow-sm border">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">
                Trusted by 10,000+ customers
              </span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Your Home,
                <br />
                <span className="relative inline-block">
                  <span className="relative z-10 bg-gradient-to-r from-muted-foreground to-foreground bg-clip-text text-transparent">
                    Our Priority
                  </span>
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    height="12"
                    viewBox="0 0 200 12"
                    fill="none">
                    <path
                      d="M2 10C50 5 150 5 198 10"
                      stroke="url(#gradient)"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient
                        id="gradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%">
                        <stop offset="0%" stopColor="#9CA3AF" />
                        <stop offset="100%" stopColor="#111827" />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
              </h1>
              <p className="text-md sm:text-xl text-muted-foreground leading-relaxed max-w-xl">
                Connect with skilled, verified home service professionals in
                minutes. From plumbing to painting, we've got you covered.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 md:pt-4">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3 ">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                    <feature.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href={`/customer/explore`}
                className="flex items-center gap-2 px-8 py-3  bg-gray-800 text-white rounded-xl font-semibold hover:shadow-2xl transition-all ">
                Book a Service
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
          {/* right Image */}
          <div className="relative animate-fade-in-right">
            <div className="flex flex-col gap-5 overflow-hidden group">
              <Image
                src="/images/home-renovation.jpg"
                alt="Home Renovation"
                width={1200}
                height={600}
                className="rounded-md"
                priority
              />

              <div className="bg-card/95 rounded-md p-5 z-20 border border-border/50 animate-slide-up">
                <div className="flex items-center justify-between">
                  {/* Left Content */}
                  <div>
                    <p className=" text-md font-semibold">
                      Seamless Service Experience
                    </p>
                    <p className="text-sm">
                      Easy booking, clear pricing, and reliable professionals
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

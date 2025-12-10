"use client";
import { useState } from "react";
import {
  CheckCircle,
  Search,
  Calendar,
  Check,
  Star,
  ChevronDown,
} from "lucide-react";

export default function StepsLayout() {
  const [activeStep, setActiveStep] = useState(0);
  const [expandedMobile, setExpandedMobile] = useState(false);

  const steps = [
    {
      id: 1,
      title: "Search",
      shortDesc: "Find what you need",
      description:
        "Start by exploring and discovering the perfect solution for your needs. Use our advanced search features to find exactly what you're looking for.",
      features: ["Explore services", "query filters", "Real-time results"],
      icon: Search,
      color: "from-blue-400 to-blue-600",
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      id: 2,
      title: "Schedule",
      shortDesc: "Plan your timeline",
      description:
        "Organize your time effectively with our scheduling tools. Plan ahead and manage your timeline with ease.",
      features: [
        "slots integration",
        "Reminder notifications",
        "Flexible slots",
      ],
      icon: Calendar,
      color: "from-purple-400 to-purple-600",
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      id: 3,
      title: "Verify",
      shortDesc: "Confirm details",
      description:
        "Double-check all information to ensure accuracy. Our verification process ensures everything is correct before you proceed.",
      features: ["Quality checks", "Data validation", "Secure confirmation"],
      icon: Check,
      color: "from-green-400 to-green-600",
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      id: 4,
      title: "Complete",
      shortDesc: "Finish successfully",
      description:
        "Finalize and complete your process. You're all set and ready to enjoy the benefits of your selection.",
      features: [
        "Instant activation",
        "Success notification",
        "Full access granted",
      ],
      icon: Star,
      color: "from-amber-400 to-amber-600",
      bgColor: "bg-amber-100",
      iconColor: "text-amber-600",
    },
  ];

  return (
    <div className="relative overflow-hidden py-10 md:py-20">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-center sm:justify-between mb-5">
          <h2 className="text-2xl sm:text-4xl font-black text-gray-900 mb-4">
            Our Process
            <svg height="9" viewBox="0 0 200 12" fill="none">
              <path
                d="M2 10C50 5 150 5 198 10"
                stroke="url(#gradient)"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#9CA3AF" />
                  <stop offset="100%" stopColor="#111827" />
                </linearGradient>
              </defs>
            </svg>
          </h2>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex gap-8 xl:gap-12">
          {/* Left Side - Steps */}
          <div className="flex-shrink-0 w-80 xl:w-96">
            <div className="space-y-4">
              {steps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(index)}
                  className={`w-full text-left p-5 rounded-md  transform  ${
                    index === activeStep
                      ? `bg-gradient-to-br ${step.color}  text-white`
                      : "bg-white border-2 border-gray-200 "
                  }`}>
                  <div className="flex items-start gap-4">
                    {/* Step Circle */}
                    <div
                      className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center transition-all font-bold text-lg ${
                        index === activeStep ? "bg-white " : "bg-gray-100"
                      }`}>
                      <step.icon
                        className={`w-7 h-7 ${
                          index === activeStep
                            ? step.iconColor
                            : "text-gray-400"
                        }`}
                      />
                    </div>

                    {/* Step Info */}
                    <div className="flex-1 min-w-0">
                      <div
                        className={`text-xs font-bold transition-colors mb-1 ${
                          index === activeStep
                            ? "text-white/80"
                            : "text-gray-500"
                        }`}>
                        STEP {step.id}
                      </div>
                      <h3
                        className={`text-lg font-black transition-colors line-clamp-2 ${
                          index === activeStep ? "text-white" : "text-gray-900"
                        }`}>
                        {step.title}
                      </h3>
                      <p
                        className={`text-sm transition-colors line-clamp-2 ${
                          index === activeStep
                            ? "text-white/80"
                            : "text-gray-500"
                        }`}>
                        {step.shortDesc}
                      </p>
                    </div>

                    {/* Active Indicator */}
                    {index === activeStep && (
                      <div className="flex-shrink-0">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Side - Active Step Details */}
          <div className="flex-1">
            <div className="bg-white rounded-md overflow-hidden border-2 border-gray-200 animate-fade-in h-full">
              <div
                className={`h-3 bg-gradient-to-r ${steps[activeStep].color}`}></div>

              <div className="p-8 xl:p-12">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                  <div
                    className={`p-4 ${steps[activeStep].bgColor} rounded-xl flex-shrink-0`}>
                    {(() => {
                      const Icon = steps[activeStep].icon;
                      return (
                        <Icon
                          className={`w-8 h-8 ${steps[activeStep].iconColor}`}
                        />
                      );
                    })()}
                  </div>
                  <h2 className="text-3xl xl:text-4xl font-black text-gray-900">
                    {steps[activeStep].title}
                  </h2>
                </div>

                {/* Description */}
                <p className="text-lg text-gray-600 leading-relaxed mb-8">
                  {steps[activeStep].description}
                </p>

                {/* Features */}
                <div className="space-y-4 mb-12">
                  <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wide">
                    Key Features
                  </h4>
                  {steps[activeStep].features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 font-medium">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tablet Layout */}
        <div className="hidden md:block lg:hidden">
          {/* Steps Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(index)}
                className={`p-5 rounded-md transition-all duration-300 ${
                  index === activeStep
                    ? `bg-gradient-to-br ${step.color}  text-white`
                    : "bg-white border-2 border-gray-200 hover:"
                }`}>
                <div className="flex flex-col items-center text-center gap-2">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      index === activeStep ? "bg-white " : "bg-gray-100"
                    }`}>
                    <step.icon
                      className={`w-6 h-6 ${
                        index === activeStep ? step.iconColor : "text-gray-400"
                      }`}
                    />
                  </div>
                  <h3
                    className={`font-black text-base ${
                      index === activeStep ? "text-white" : "text-gray-900"
                    }`}>
                    {step.title}
                  </h3>
                  <p
                    className={`text-xs line-clamp-2 ${
                      index === activeStep ? "text-white/80" : "text-gray-500"
                    }`}>
                    {step.shortDesc}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Details Card */}
          <div className="bg-white rounded-md shadow-2xl overflow-hidden border-2 border-gray-100 animate-fade-in">
            <div
              className={`h-3 bg-gradient-to-r ${steps[activeStep].color}`}></div>

            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div
                  className={`p-3 ${steps[activeStep].bgColor} rounded-lg flex-shrink-0`}>
                  {(() => {
                    const Icon = steps[activeStep].icon;
                    return (
                      <Icon
                        className={`w-7 h-7 ${steps[activeStep].iconColor}`}
                      />
                    );
                  })()}
                </div>
                <h2 className="text-2xl font-black text-gray-900">
                  {steps[activeStep].title}
                </h2>
              </div>

              <p className="text-base text-gray-600 leading-relaxed mb-6">
                {steps[activeStep].description}
              </p>

              <div className="space-y-3 mb-8">
                <h4 className="text-xs font-bold text-gray-500 uppercase">
                  Key Features
                </h4>
                {steps[activeStep].features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 font-medium text-sm">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden space-y-3">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="rounded-md overflow-hidden border-2 border-gray-200">
              {/* Step Header */}
              <button
                onClick={() => {
                  setActiveStep(index);
                  setExpandedMobile(expandedMobile === index ? null : index);
                }}
                className={`w-full p-4 flex items-center justify-between transition-all ${
                  index === activeStep
                    ? `bg-gradient-to-r ${step.color} text-white`
                    : "bg-white hover:bg-gray-50"
                }`}>
                <div className="flex items-center gap-4 text-left flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                      index === activeStep ? "bg-white " : "bg-gray-100"
                    }`}>
                    <step.icon
                      className={`w-6 h-6 ${
                        index === activeStep ? step.iconColor : "text-gray-400"
                      }`}
                    />
                  </div>
                  <div>
                    <div
                      className={`text-xs font-bold ${
                        index === activeStep ? "text-white/80" : "text-gray-500"
                      }`}>
                      STEP {step.id}
                    </div>
                    <h3
                      className={`font-black text-base ${
                        index === activeStep ? "text-white" : "text-gray-900"
                      }`}>
                      {step.title}
                    </h3>
                  </div>
                </div>

                <ChevronDown
                  className={`w-6 h-6 flex-shrink-0 transition-transform ${
                    expandedMobile === index ? "rotate-180" : ""
                  } ${index === activeStep ? "text-white" : "text-gray-400"}`}
                />
              </button>

              {/* Step Details - Collapsible */}
              {expandedMobile === index && (
                <div
                  className={`p-6 bg-white border-t-2 ${
                    step.color.split(" ")[0] === "from-blue-400"
                      ? "border-blue-200"
                      : step.color.split(" ")[0] === "from-purple-400"
                      ? "border-purple-200"
                      : step.color.split(" ")[0] === "from-green-400"
                      ? "border-green-200"
                      : "border-amber-200"
                  } animate-fade-in`}>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {step.description}
                  </p>

                  <div className="space-y-3 mb-6">
                    <h4 className="text-xs font-bold text-gray-500 uppercase">
                      Key Features
                    </h4>
                    {step.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700 font-medium text-sm">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

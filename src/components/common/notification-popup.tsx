"use client";

import React, { useEffect, useState } from "react";
import { Bell, X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface NotificationData {
  id: string;
  title: string;
  body: string;
  type?: string;
  clickAction?: string;
  timestamp?: number;
}

interface NotificationPopupProps {
  notification: NotificationData;
  onClose: () => void;
  onClick?: () => void;
}

const NotificationPopup = ({
  notification,
  onClose,
  onClick,
}: NotificationPopupProps) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    // Auto-close after 5 seconds
    const duration = 5000;
    const interval = 50;
    const step = 100 / (duration / interval);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= step) {
          onClose();
          return 0;
        }
        return prev - step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [onClose]);

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 400, y: 0 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, x: 400, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="relative mb-3 overflow-hidden rounded-sm shadow-2xl"
    >
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200">
        <motion.div
          className="h-full bg-blue-600"
          style={{ width: `${progress}%` }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.05 }}
        />
      </div>

      {/* Notification Card */}
      <div
        onClick={handleClick}
        className="bg-white border border-gray-200 rounded-sm p-4 cursor-pointer hover:shadow-lg hover:border-blue-300 transition-all min-w-[380px] max-w-[420px]"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          {/* Icon & Title */}
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="flex-shrink-0 mt-0.5">
              <div className="w-10 h-10 rounded-sm bg-blue-100 flex items-center justify-center">
                <Bell className="w-5 h-5 text-blue-600" />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1">
                {notification.title}
              </h4>
              <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                {notification.body}
              </p>

              {/* Type Badge */}
              {notification.type && (
                <span className="inline-block mt-2 px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-medium rounded-sm uppercase tracking-wide">
                  {notification.type.replace(/_/g, " ")}
                </span>
              )}
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="flex-shrink-0 p-1 hover:bg-gray-100 rounded-sm transition-colors"
          >
            <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
          </button>
        </div>

        {/* Click Indicator */}
        {notification.clickAction && (
          <div className="flex items-center justify-end mt-2 text-xs text-blue-600 font-medium">
            <span>View details</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        )}

        {/* Timestamp */}
        {notification.timestamp && (
          <div className="mt-2 text-[10px] text-gray-400">
            {new Date(notification.timestamp).toLocaleTimeString()}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default NotificationPopup;

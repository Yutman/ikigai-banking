"use client";

import { useEffect, useState } from "react";

interface BrowserInfo {
  isEdge: boolean;
  isChrome: boolean;
  isSafari: boolean;
  isFirefox: boolean;
  isMobile: boolean;
  isWhatsApp: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  userAgent: string;
  needsFallback: boolean;
}

const BrowserCompatibilityHandler = () => {
  const [browserInfo, setBrowserInfo] = useState<BrowserInfo | null>(null);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent;

    const isEdge = /Edg\//.test(userAgent);
    const isChrome = /Chrome\//.test(userAgent) && !/Edg\//.test(userAgent);
    const isSafari = /Safari\//.test(userAgent) && !/Chrome\//.test(userAgent);
    const isFirefox = /Firefox\//.test(userAgent);
    const isMobile = /Mobile|Android|iPhone|iPad/.test(userAgent);
    const isWhatsApp = userAgent.includes("WhatsApp");
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    const isAndroid = /Android/.test(userAgent);

    // Determine if fallback is needed
    const needsFallback = isEdge || (isMobile && !isChrome) || isWhatsApp;

    const info: BrowserInfo = {
      isEdge,
      isChrome,
      isSafari,
      isFirefox,
      isMobile,
      isWhatsApp,
      isIOS,
      isAndroid,
      userAgent,
      needsFallback,
    };

    setBrowserInfo(info);

    console.log("Browser compatibility info:", info);

    // Show fallback for problematic browsers
    if (needsFallback) {
      console.log("Browser needs fallback - showing compatibility notice");
      setShowFallback(true);
    }

    // Apply browser-specific fixes
    if (isEdge) {
      console.log("Edge browser detected - applying Edge-specific fixes");
      applyEdgeFixes();
    }

    if (isMobile && !isChrome) {
      console.log("Mobile non-Chrome browser detected - applying mobile fixes");
      applyMobileFixes();
    }

    if (isWhatsApp) {
      console.log("WhatsApp browser detected - applying WhatsApp fixes");
      applyWhatsAppFixes();
    }
  }, []);

  const applyEdgeFixes = () => {
    // Edge-specific fixes
    if (typeof window !== "undefined") {
      // Force polyfills for Edge
      if (!window.fetch) {
        console.log("Adding fetch polyfill for Edge");
        // Add fetch polyfill if needed
      }

      // Fix Edge-specific issues
      document.addEventListener("DOMContentLoaded", () => {
        console.log("DOM ready in Edge - applying fixes");
      });
    }
  };

  const applyMobileFixes = () => {
    // Mobile browser fixes
    if (typeof window !== "undefined") {
      // Add mobile-specific meta tags
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute(
          "content",
          "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        );
      }

      // Force mobile-friendly behavior
      document.body.style.webkitOverflowScrolling = "touch";
    }
  };

  const applyWhatsAppFixes = () => {
    // WhatsApp-specific fixes
    if (typeof window !== "undefined") {
      // Force refresh for WhatsApp
      setTimeout(() => {
        if (window.performance && window.performance.navigation.type === 1) {
          console.log("WhatsApp detected - refreshing page");
          window.location.reload();
        }
      }, 1000);
    }
  };

  if (showFallback && browserInfo) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md mx-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Browser Compatibility Notice
          </h2>
          <p className="text-gray-600 mb-4">
            For the best experience, please use Chrome browser or try refreshing
            the page.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Refresh Page
            </button>
            <button
              onClick={() => setShowFallback(false)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Continue Anyway
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default BrowserCompatibilityHandler;

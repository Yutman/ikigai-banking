"use client";

import { useEffect } from "react";

const SocialMediaHandler = () => {
  useEffect(() => {
    // Detect if coming from social media or messaging apps
    const userAgent = navigator.userAgent;
    const referrer = document.referrer;

    // Enhanced iOS detection
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    const isIOSWhatsApp = userAgent.includes("WhatsApp") && isIOS;
    const isIOSSafari =
      userAgent.includes("Safari") && isIOS && !userAgent.includes("Chrome");

    const isFromSocialMedia =
      referrer.includes("whatsapp") ||
      referrer.includes("telegram") ||
      referrer.includes("facebook") ||
      referrer.includes("twitter") ||
      referrer.includes("instagram") ||
      referrer.includes("linkedin") ||
      userAgent.includes("WhatsApp") ||
      userAgent.includes("Telegram");

    console.log("Device and browser detection:", {
      userAgent,
      referrer,
      isIOS,
      isIOSWhatsApp,
      isIOSSafari,
      isFromSocialMedia,
      timestamp: new Date().toISOString(),
    });

    if (isFromSocialMedia) {
      console.log("User coming from social media:", {
        userAgent,
        referrer,
        timestamp: new Date().toISOString(),
      });

      // iOS-specific handling
      if (isIOS) {
        console.log("iOS device detected - applying iOS-specific fixes");

        // Force DOM ready state for iOS
        if (document.readyState !== "complete") {
          document.addEventListener("DOMContentLoaded", () => {
            console.log("DOM ready on iOS");
          });
        }

        // iOS-specific timeout and refresh logic
        setTimeout(() => {
          // More aggressive refresh for iOS
          if (window.performance && window.performance.navigation.type === 1) {
            console.log(
              "Refreshing page to clear iOS social media cache issues"
            );
            window.location.reload();
          }
        }, 2000); // Longer timeout for iOS
      } else {
        // Android/other devices
        setTimeout(() => {
          if (window.performance && window.performance.navigation.type === 1) {
            console.log("Refreshing page to clear social media cache issues");
            window.location.reload();
          }
        }, 1000);
      }
    }

    // Handle URL parameters that might be added by social media
    const urlParams = new URLSearchParams(window.location.search);
    const hasSocialParams =
      urlParams.has("utm_source") ||
      urlParams.has("utm_medium") ||
      urlParams.has("utm_campaign") ||
      urlParams.has("ref") ||
      urlParams.has("source");

    if (hasSocialParams) {
      console.log(
        "Social media parameters detected:",
        Object.fromEntries(urlParams)
      );
    }
  }, []);

  return null; // This component doesn't render anything
};

export default SocialMediaHandler;

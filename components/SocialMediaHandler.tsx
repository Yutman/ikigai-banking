"use client";

import { useEffect } from "react";

const SocialMediaHandler = () => {
  useEffect(() => {
    // Detect if coming from social media or messaging apps
    const userAgent = navigator.userAgent;
    const referrer = document.referrer;

    const isFromSocialMedia =
      referrer.includes("whatsapp") ||
      referrer.includes("telegram") ||
      referrer.includes("facebook") ||
      referrer.includes("twitter") ||
      referrer.includes("instagram") ||
      referrer.includes("linkedin") ||
      userAgent.includes("WhatsApp") ||
      userAgent.includes("Telegram");

    if (isFromSocialMedia) {
      console.log("User coming from social media:", {
        userAgent,
        referrer,
        timestamp: new Date().toISOString(),
      });

      // Add a small delay to ensure proper initialization
      setTimeout(() => {
        // Force a page refresh to clear any cached issues
        if (window.performance && window.performance.navigation.type === 1) {
          // Only refresh if it's a fresh navigation
          console.log("Refreshing page to clear social media cache issues");
          window.location.reload();
        }
      }, 1000);
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

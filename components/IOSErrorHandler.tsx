"use client";

import { useEffect } from "react";

const IOSErrorHandler = () => {
  useEffect(() => {
    const userAgent = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    const isIOSWhatsApp = userAgent.includes("WhatsApp") && isIOS;

    if (isIOSWhatsApp) {
      console.log(
        "iOS WhatsApp detected - applying iOS-specific error handling"
      );

      // Override global error handlers for iOS
      const originalErrorHandler = window.onerror;
      const originalUnhandledRejection = window.onunhandledrejection;

      window.onerror = (message, source, lineno, colno, error) => {
        console.error("iOS Error caught:", {
          message,
          source,
          lineno,
          colno,
          error,
          userAgent,
          timestamp: new Date().toISOString(),
        });

        // Try to recover from common iOS errors
        if (
          message.includes("Server Components render") ||
          message.includes("Server Action Exception")
        ) {
          console.log("Attempting iOS error recovery...");

          // Force a page refresh to clear any cached issues
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }

        // Call original handler if it exists
        if (originalErrorHandler) {
          return originalErrorHandler(message, source, lineno, colno, error);
        }
        return false;
      };

      window.onunhandledrejection = (event) => {
        console.error("iOS Unhandled Promise Rejection:", {
          reason: event.reason,
          promise: event.promise,
          userAgent,
          timestamp: new Date().toISOString(),
        });

        // Try to recover from promise rejections
        if (
          event.reason &&
          (event.reason.message?.includes("Server Components render") ||
            event.reason.message?.includes("Server Action Exception"))
        ) {
          console.log("Attempting iOS promise rejection recovery...");

          // Prevent the default behavior
          event.preventDefault();

          // Force a page refresh
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }

        // Call original handler if it exists
        if (originalUnhandledRejection) {
          originalUnhandledRejection(event);
        }
      };

      // Cleanup function
      return () => {
        window.onerror = originalErrorHandler;
        window.onunhandledrejection = originalUnhandledRejection;
      };
    }
  }, []);

  return null;
};

export default IOSErrorHandler;

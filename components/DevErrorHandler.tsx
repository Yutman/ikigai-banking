"use client";

import React from "react";

interface DevErrorHandlerProps {
  children: React.ReactNode;
}

const DevErrorHandler: React.FC<DevErrorHandlerProps> = ({ children }) => {
  React.useEffect(() => {
    // Only in development
    if (process.env.NODE_ENV === "development") {
      const handleError = (event: ErrorEvent) => {
        console.error("Global error caught:", {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          error: event.error,
        });
      };

      const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
        console.error("Unhandled promise rejection:", {
          reason: event.reason,
          promise: event.promise,
        });
      };

      window.addEventListener("error", handleError);
      window.addEventListener("unhandledrejection", handleUnhandledRejection);

      return () => {
        window.removeEventListener("error", handleError);
        window.removeEventListener(
          "unhandledrejection",
          handleUnhandledRejection
        );
      };
    }
  }, []);

  return <>{children}</>;
};

export default DevErrorHandler;

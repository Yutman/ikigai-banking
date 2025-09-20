"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface LoadingContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  loadingMessage: string;
  setLoadingMessage: (message: string) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Loading...");
  const router = useRouter();

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  // Auto-hide loading when route changes
  useEffect(() => {
    const handleRouteChange = () => {
      setIsLoading(false);
    };

    // Listen for route changes
    const originalPush = router.push;
    router.push = (...args) => {
      handleRouteChange();
      return originalPush.apply(router, args);
    };

    return () => {
      router.push = originalPush;
    };
  }, [router]);

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        setLoading,
        loadingMessage,
        setLoadingMessage,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};

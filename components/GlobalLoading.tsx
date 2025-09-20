"use client";

import React from "react";
import { useLoading } from "@/lib/contexts/LoadingContext";
import LoadingSpinner from "./LoadingSpinner";

const GlobalLoading = () => {
  const { isLoading, loadingMessage } = useLoading();

  if (!isLoading) return null;

  return <LoadingSpinner message={loadingMessage} size="lg" />;
};

export default GlobalLoading;

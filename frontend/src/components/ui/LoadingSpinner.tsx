"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  fullScreen?: boolean;
}

export default function LoadingSpinner({ size = "md", className, fullScreen = false }: LoadingSpinnerProps) {
  const sizes = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const spinner = (
    <div className={cn("flex items-center justify-center", fullScreen && "min-h-[60vh]", className)}>
      <div
        className={cn(
          "border-2 border-gray-200 dark:border-gray-700 border-t-primary rounded-full animate-spin",
          sizes[size]
        )}
      />
    </div>
  );

  return spinner;
}

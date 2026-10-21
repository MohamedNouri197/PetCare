"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "primary" | "accent";
  size?: "sm" | "md";
  className?: string;
}

export default function Badge({ children, variant = "default", size = "sm", className }: BadgeProps) {
  const variants = {
    default: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    danger: "bg-danger/10 text-danger",
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/10 text-accent",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}

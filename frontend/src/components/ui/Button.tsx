"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "danger" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  fullWidth = false,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95";

  const variants = {
    primary: "bg-primary text-white hover:bg-primary-dark focus:ring-primary shadow-sm hover:shadow-md",
    secondary: "bg-secondary text-white hover:bg-secondary-dark focus:ring-secondary shadow-sm hover:shadow-md",
    accent: "bg-accent text-white hover:bg-accent-dark focus:ring-accent shadow-sm hover:shadow-md",
    danger: "bg-danger text-white hover:opacity-90 focus:ring-danger shadow-sm",
    ghost: "text-textColor dark:text-textColor-dark hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-gray-300",
    outline:
      "border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary dark:border-primary-light dark:text-primary-light",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3.5 text-base",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], fullWidth && "w-full", className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}

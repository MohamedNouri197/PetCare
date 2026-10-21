"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, icon, className, ...props }, ref) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-textColor dark:text-textColor-dark">{label}</label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-textColor-light dark:text-textColor-dark-light">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-surface dark:bg-surface-dark",
            "px-4 py-2.5 text-sm text-textColor dark:text-textColor-dark",
            "placeholder:text-textColor-light dark:placeholder:text-textColor-dark-light",
            "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
            "transition-all duration-200",
            icon && "pl-10",
            error && "border-danger focus:ring-danger/50 focus:border-danger",
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-danger mt-1">{error}</p>}
    </div>
  );
});

Input.displayName = "Input";

export default Input;

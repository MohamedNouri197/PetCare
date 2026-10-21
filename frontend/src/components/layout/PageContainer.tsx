"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export default function PageContainer({ children, className, title, subtitle, action }: PageContainerProps) {
  return (
    <div className={cn("max-w-5xl mx-auto px-4 py-6 pb-24 lg:pb-6 animate-fade-in", className)}>
      {(title || action) && (
        <div className="flex items-start justify-between mb-6">
          <div>
            {title && (
              <h1 className="text-2xl font-bold text-textColor dark:text-textColor-dark">{title}</h1>
            )}
            {subtitle && (
              <p className="text-sm text-textColor-light dark:text-textColor-dark-light mt-1">{subtitle}</p>
            )}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

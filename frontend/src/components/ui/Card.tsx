"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

export default function Card({ children, className, onClick, hoverable = false, padding = "md" }: CardProps) {
  const paddings = {
    none: "",
    sm: "p-3",
    md: "p-4 sm:p-5",
    lg: "p-6 sm:p-8",
  };

  return (
    <div
      className={cn(
        "bg-surface dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50",
        paddings[padding],
        hoverable && "cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex items-center justify-between mb-4", className)}>{children}</div>;
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={cn("text-lg font-semibold text-textColor dark:text-textColor-dark", className)}>{children}</h3>
  );
}

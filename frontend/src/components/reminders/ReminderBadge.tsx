"use client";

import React from "react";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReminderBadgeProps {
  count: number;
  className?: string;
}

export default function ReminderBadge({ count, className }: ReminderBadgeProps) {
  if (count <= 0) return null;

  return (
    <div className={cn("relative inline-flex", className)}>
      <Bell className="w-5 h-5 text-textColor-light dark:text-textColor-dark-light" />
      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-danger text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
        {count > 9 ? "9+" : count}
      </span>
    </div>
  );
}

"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PawPrint, Calendar, Bell, Bot, Stethoscope, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const ownerItems = [
  { href: "/dashboard", label: "Accueil", icon: Home },
  { href: "/animals", label: "Animaux", icon: PawPrint },
  { href: "/tracking", label: "Suivi", icon: Activity },
  { href: "/appointments", label: "RDV", icon: Calendar },
  { href: "/assistant", label: "Assistant", icon: Bot },
];

const vetItems = [
  { href: "/dashboard", label: "Accueil", icon: Home },
  { href: "/vet/schedule", label: "Calendrier", icon: Stethoscope },
  { href: "/appointments", label: "RDV", icon: Calendar },
  { href: "/animals", label: "Animaux", icon: PawPrint },
  { href: "/assistant", label: "Assistant", icon: Bot },
];

export default function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuth();

  const navItems = useMemo(
    () => (user?.role === "veterinarian" ? vetItems : ownerItems),
    [user?.role]
  );

  if (!isAuthenticated) return null;

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-14 bottom-0 w-64 bg-surface dark:bg-surface-dark border-r border-gray-100 dark:border-gray-700/50 flex-col py-6 px-3 z-30">
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary dark:bg-primary/20"
                    : "text-textColor-light dark:text-textColor-dark-light hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-textColor dark:hover:text-textColor-dark"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/90 dark:bg-surface-dark/90 backdrop-blur-lg border-t border-gray-100 dark:border-gray-700/50 safe-area-bottom">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 min-w-[3.5rem] py-1 rounded-xl transition-all duration-200",
                  isActive ? "text-primary" : "text-textColor-light dark:text-textColor-dark-light"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive && "scale-110")} />
                <span className="text-[10px] font-medium">{item.label}</span>
                {isActive && <div className="w-1 h-1 rounded-full bg-primary mt-0.5" />}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

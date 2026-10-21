"use client";

import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { Moon, Sun, LogOut, User, Stethoscope, PawPrint } from "lucide-react";
import Link from "next/link";

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    const savedTheme = localStorage.getItem("petcare_theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const dark = savedTheme === "dark" || (!savedTheme && prefersDark);
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    document.documentElement.classList.toggle("dark", newDark);
    localStorage.setItem("petcare_theme", newDark ? "dark" : "light");
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-surface-dark/80 backdrop-blur-lg border-b border-gray-100 dark:border-gray-700/50">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <PawPrint className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-lg text-primary hidden sm:block tracking-tight">
            PetCare
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-textColor-light" />
            )}
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl ${
                user?.role === "veterinarian"
                  ? "bg-accent/10 dark:bg-accent/20"
                  : "bg-primary/5 dark:bg-primary/10"
              }`}>
                {user?.role === "veterinarian" ? (
                  <Stethoscope className="w-4 h-4 text-accent" />
                ) : (
                  <User className="w-4 h-4 text-primary" />
                )}
                <span className="text-sm font-medium text-textColor dark:text-textColor-dark">
                  {user?.firstName}
                </span>
                {user?.role === "veterinarian" && (
                  <span className="text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-md bg-accent/20 text-accent">
                    Vet
                  </span>
                )}
              </div>
              <button
                onClick={logout}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-textColor-light dark:text-textColor-dark-light"
                aria-label="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/pricing"
                className="px-4 py-2 text-sm font-medium text-textColor dark:text-textColor-dark hover:text-primary transition-colors hidden sm:block"
              >
                Tarifs
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-textColor dark:text-textColor-dark hover:text-primary transition-colors hidden sm:block"
              >
                Se connecter
              </Link>
              <Link
                href="/register"
                className="px-5 py-2 text-sm font-semibold text-white bg-primary rounded-full hover:bg-primary-dark transition-colors"
              >
                Commencer
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

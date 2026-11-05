"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  PawPrint,
  Calendar,
  Bell,
  Bot,
  Stethoscope,
  Activity,
  MoreHorizontal,
  X,
  Camera,
  Search,
  MessageSquare,
  Users,
  BarChart3,
  ShoppingBag,
  MapPin,
  Scan,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const ownerMainItems = [
  { href: "/dashboard", label: "Accueil", icon: Home },
  { href: "/animals", label: "Animaux", icon: PawPrint },
  { href: "/tracking", label: "Suivi", icon: Activity },
  { href: "/appointments", label: "RDV", icon: Calendar },
  { href: "/assistant", label: "IA", icon: Bot },
];

const ownerMoreItems = [
  { href: "/ai/diagnostic", label: "Diagnostic IA", icon: Camera, section: "Intelligence artificielle" },
  { href: "/ai/breed", label: "Identifier race", icon: Scan, section: "Intelligence artificielle" },
  { href: "/chat", label: "Messagerie", icon: MessageSquare, section: "Communication" },
  { href: "/community", label: "Communaute", icon: Users, section: "Communication" },
  { href: "/reminders", label: "Rappels", icon: Bell, section: "Outils" },
  { href: "/analytics", label: "Statistiques", icon: BarChart3, section: "Outils" },
  { href: "/marketplace", label: "Boutique", icon: ShoppingBag, section: "Services" },
  { href: "/map", label: "Carte", icon: MapPin, section: "Services" },
];

const vetMainItems = [
  { href: "/dashboard", label: "Accueil", icon: Home },
  { href: "/vet/schedule", label: "Planning", icon: Stethoscope },
  { href: "/appointments", label: "RDV", icon: Calendar },
  { href: "/animals", label: "Animaux", icon: PawPrint },
  { href: "/assistant", label: "IA", icon: Bot },
];

const vetMoreItems = [
  { href: "/chat", label: "Messagerie", icon: MessageSquare, section: "Communication" },
  { href: "/community", label: "Communaute", icon: Users, section: "Communication" },
  { href: "/analytics", label: "Statistiques", icon: BarChart3, section: "Outils" },
  { href: "/ai/diagnostic", label: "Diagnostic IA", icon: Camera, section: "Intelligence artificielle" },
  { href: "/ai/breed", label: "Identifier race", icon: Scan, section: "Intelligence artificielle" },
  { href: "/marketplace", label: "Boutique", icon: ShoppingBag, section: "Services" },
  { href: "/map", label: "Carte", icon: MapPin, section: "Services" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuth();
  const [showMore, setShowMore] = useState(false);

  const isVet = user?.role === "veterinarian";
  const mainItems = useMemo(() => (isVet ? vetMainItems : ownerMainItems), [isVet]);
  const moreItems = useMemo(() => (isVet ? vetMoreItems : ownerMoreItems), [isVet]);
  const allSidebarItems = useMemo(() => [...mainItems, ...moreItems], [mainItems, moreItems]);

  const sections = useMemo(() => {
    const map = new Map<string, typeof moreItems>();
    for (const item of moreItems) {
      const s = item.section;
      if (!map.has(s)) map.set(s, []);
      map.get(s)!.push(item);
    }
    return map;
  }, [moreItems]);

  if (!isAuthenticated) return null;

  const isMoreActive = moreItems.some(
    (item) => pathname === item.href || pathname.startsWith(item.href + "/")
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-14 bottom-0 w-64 bg-surface dark:bg-surface-dark border-r border-gray-100 dark:border-gray-700/50 flex-col py-4 px-3 z-30 overflow-y-auto">
        <nav className="flex flex-col gap-0.5">
          <p className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-textColor-light/60 dark:text-textColor-dark-light/60">
            Principal
          </p>
          {mainItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
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

          {Array.from(sections.entries()).map(([section, items]) => (
            <React.Fragment key={section}>
              <p className="px-4 pt-4 pb-2 text-[10px] font-bold uppercase tracking-wider text-textColor-light/60 dark:text-textColor-dark-light/60">
                {section}
              </p>
              {items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary/10 text-primary dark:bg-primary/20"
                        : "text-textColor-light dark:text-textColor-dark-light hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-textColor dark:hover:text-textColor-dark"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </React.Fragment>
          ))}
        </nav>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/90 dark:bg-surface-dark/90 backdrop-blur-lg border-t border-gray-100 dark:border-gray-700/50 safe-area-bottom">
        <div className="flex items-center justify-around h-16 px-2">
          {mainItems.slice(0, 4).map((item) => {
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
          <button
            onClick={() => setShowMore(true)}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 min-w-[3.5rem] py-1 rounded-xl transition-all duration-200",
              isMoreActive ? "text-primary" : "text-textColor-light dark:text-textColor-dark-light"
            )}
          >
            <MoreHorizontal className="w-5 h-5" />
            <span className="text-[10px] font-medium">Plus</span>
            {isMoreActive && <div className="w-1 h-1 rounded-full bg-primary mt-0.5" />}
          </button>
        </div>
      </nav>

      {/* Mobile "More" overlay */}
      {showMore && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowMore(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-surface dark:bg-surface-dark rounded-t-3xl max-h-[80vh] overflow-y-auto safe-area-bottom animate-slide-up">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700/50">
              <h3 className="text-base font-semibold text-textColor dark:text-textColor-dark">
                Plus de fonctionnalites
              </h3>
              <button
                onClick={() => setShowMore(false)}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
              >
                <X className="w-4 h-4 text-textColor-light dark:text-textColor-dark-light" />
              </button>
            </div>
            <div className="px-4 py-3">
              {/* IA item from main nav */}
              {(() => {
                const IAIcon = mainItems[4].icon;
                return (
                  <Link
                    href={mainItems[4].href}
                    onClick={() => setShowMore(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-textColor-light dark:text-textColor-dark-light hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <IAIcon className="w-5 h-5" />
                    {mainItems[4].label === "IA" ? "Assistant IA" : mainItems[4].label}
                  </Link>
                );
              })()}

              {Array.from(sections.entries()).map(([section, items]) => (
                <React.Fragment key={section}>
                  <p className="px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-textColor-light/60 dark:text-textColor-dark-light/60">
                    {section}
                  </p>
                  {items.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setShowMore(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-textColor-light dark:text-textColor-dark-light hover:bg-gray-50 dark:hover:bg-gray-800"
                        )}
                      >
                        <item.icon className="w-5 h-5" />
                        {item.label}
                      </Link>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
            <div className="h-4" />
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
}

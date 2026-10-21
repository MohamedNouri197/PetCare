"use client";

import React from "react";
import { Dog, Cat, Bird, Rabbit, Fish, Bug, HelpCircle } from "lucide-react";
import type { Species } from "@/types";
import { cn } from "@/lib/utils";

const speciesIcons: Record<Species, React.ComponentType<{ className?: string }>> = {
  dog: Dog,
  cat: Cat,
  bird: Bird,
  rabbit: Rabbit,
  hamster: Bug,
  fish: Fish,
  reptile: Bug,
  other: HelpCircle,
};

const speciesColors: Record<Species, string> = {
  dog: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
  cat: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
  bird: "bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400",
  rabbit: "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400",
  hamster: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
  fish: "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400",
  reptile: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  other: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400",
};

interface SpeciesIconProps {
  species: Species;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function SpeciesIcon({ species, size = "md", className }: SpeciesIconProps) {
  const Icon = speciesIcons[species] || speciesIcons.other;
  const colors = speciesColors[species] || speciesColors.other;

  const sizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div className={cn("rounded-full flex items-center justify-center", sizes[size], colors, className)}>
      <Icon className={iconSizes[size]} />
    </div>
  );
}

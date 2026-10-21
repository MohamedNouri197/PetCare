"use client";

import React from "react";
import Link from "next/link";
import type { Animal } from "@/types";
import { calculateAge, getSpeciesLabel, formatWeight } from "@/lib/utils";
import SpeciesIcon from "./SpeciesIcon";
import Card from "@/components/ui/Card";
import {
  Stethoscope,
  Syringe,
  UtensilsCrossed,
  Weight,
  Calendar,
  ChevronRight,
} from "lucide-react";

const profileLinks = [
  { href: "medical", label: "Dossier medical", icon: Stethoscope, color: "text-primary" },
  { href: "vaccinations", label: "Vaccinations", icon: Syringe, color: "text-success" },
  { href: "nutrition", label: "Nutrition", icon: UtensilsCrossed, color: "text-secondary" },
  { href: "weight", label: "Suivi du poids", icon: Weight, color: "text-accent" },
  { href: "appointments", label: "Rendez-vous", icon: Calendar, color: "text-warning" },
];

interface AnimalProfileProps {
  animal: Animal;
}

export default function AnimalProfile({ animal }: AnimalProfileProps) {
  return (
    <div className="space-y-6">
      {/* Hero section */}
      <Card className="!p-0 overflow-hidden">
        <div className="bg-gradient-to-br from-primary/10 to-accent/10 dark:from-primary/20 dark:to-accent/20 p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
          {animal.photoUrl ? (
            <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-white dark:ring-gray-700 shadow-lg flex-shrink-0">
              <img src={animal.photoUrl} alt={animal.name} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="ring-4 ring-white dark:ring-gray-700 rounded-full shadow-lg">
              <SpeciesIcon species={animal.species} size="lg" />
            </div>
          )}

          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold text-textColor dark:text-textColor-dark">{animal.name}</h1>
            <p className="text-textColor-light dark:text-textColor-dark-light mt-1">
              {getSpeciesLabel(animal.species)} {animal.breed && `- ${animal.breed}`}
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-3 text-sm text-textColor-light dark:text-textColor-dark-light">
              <span>{calculateAge(animal.birthDate)}</span>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <span>{formatWeight(animal.weight)}</span>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <span>{animal.gender === "male" ? "Male" : "Femelle"}</span>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <span>{animal.color}</span>
            </div>
            {animal.microchipNumber && (
              <p className="text-xs text-textColor-light dark:text-textColor-dark-light mt-2">
                Puce: {animal.microchipNumber}
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Navigation links */}
      <Card padding="none">
        <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
          {profileLinks.map((link) => (
            <Link
              key={link.href}
              href={`/animals/${animal.id}/${link.href}`}
              className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <link.icon className={`w-5 h-5 ${link.color}`} />
              <span className="flex-1 text-sm font-medium text-textColor dark:text-textColor-dark">
                {link.label}
              </span>
              <ChevronRight className="w-4 h-4 text-textColor-light dark:text-textColor-dark-light" />
            </Link>
          ))}
        </div>
      </Card>

      {/* Notes */}
      {animal.notes && (
        <Card>
          <h3 className="text-sm font-semibold text-textColor dark:text-textColor-dark mb-2">Notes</h3>
          <p className="text-sm text-textColor-light dark:text-textColor-dark-light">{animal.notes}</p>
        </Card>
      )}
    </div>
  );
}

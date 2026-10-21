"use client";

import React from "react";
import Link from "next/link";
import type { Animal } from "@/types";
import { calculateAge, getSpeciesLabel, formatWeight } from "@/lib/utils";
import SpeciesIcon from "./SpeciesIcon";
import Card from "@/components/ui/Card";

interface AnimalCardProps {
  animal: Animal;
  compact?: boolean;
}

export default function AnimalCard({ animal, compact = false }: AnimalCardProps) {
  return (
    <Link href={`/animals/${animal.id}`}>
      <Card hoverable className={compact ? "!p-3" : ""}>
        <div className={compact ? "flex items-center gap-3" : "flex flex-col items-center text-center gap-3"}>
          {animal.photoUrl ? (
            <div
              className={`${compact ? "w-12 h-12" : "w-20 h-20"} rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden flex-shrink-0`}
            >
              <img
                src={animal.photoUrl}
                alt={animal.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <SpeciesIcon species={animal.species} size={compact ? "sm" : "lg"} />
          )}

          <div className={compact ? "flex-1 min-w-0" : ""}>
            <h3 className="font-semibold text-textColor dark:text-textColor-dark truncate">{animal.name}</h3>
            <p className="text-xs text-textColor-light dark:text-textColor-dark-light">
              {getSpeciesLabel(animal.species)} {animal.breed && `- ${animal.breed}`}
            </p>
            {!compact && (
              <div className="flex items-center justify-center gap-3 mt-2 text-xs text-textColor-light dark:text-textColor-dark-light">
                <span>{calculateAge(animal.birthDate)}</span>
                <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                <span>{formatWeight(animal.weight)}</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}

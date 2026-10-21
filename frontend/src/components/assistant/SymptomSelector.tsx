"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const SYMPTOMS = [
  { id: "vomiting", label: "Vomissements" },
  { id: "diarrhea", label: "Diarrhee" },
  { id: "loss_appetite", label: "Perte d'appetit" },
  { id: "lethargy", label: "Lethargie" },
  { id: "coughing", label: "Toux" },
  { id: "sneezing", label: "Eternuements" },
  { id: "itching", label: "Demangeaisons" },
  { id: "limping", label: "Boiterie" },
  { id: "excessive_thirst", label: "Soif excessive" },
  { id: "weight_loss", label: "Perte de poids" },
  { id: "hair_loss", label: "Perte de poils" },
  { id: "eye_discharge", label: "Ecoulement oculaire" },
  { id: "bad_breath", label: "Mauvaise haleine" },
  { id: "behavioral_change", label: "Changement de comportement" },
  { id: "difficulty_breathing", label: "Difficulte a respirer" },
  { id: "swelling", label: "Gonflement" },
];

interface SymptomSelectorProps {
  selected: string[];
  onChange: (symptoms: string[]) => void;
}

export default function SymptomSelector({ selected, onChange }: SymptomSelectorProps) {
  const toggle = (symptomId: string) => {
    if (selected.includes(symptomId)) {
      onChange(selected.filter((s) => s !== symptomId));
    } else {
      onChange([...selected, symptomId]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-textColor dark:text-textColor-dark">
        Symptomes observes
      </label>
      <div className="flex flex-wrap gap-2">
        {SYMPTOMS.map((symptom) => {
          const isSelected = selected.includes(symptom.id);
          return (
            <button
              key={symptom.id}
              type="button"
              onClick={() => toggle(symptom.id)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border",
                isSelected
                  ? "bg-primary text-white border-primary"
                  : "bg-surface dark:bg-surface-dark text-textColor-light dark:text-textColor-dark-light border-gray-200 dark:border-gray-600 hover:border-primary hover:text-primary"
              )}
            >
              {isSelected && <Check className="w-3 h-3" />}
              {symptom.label}
            </button>
          );
        })}
      </div>
      {selected.length > 0 && (
        <p className="text-xs text-textColor-light dark:text-textColor-dark-light">
          {selected.length} symptome{selected.length > 1 ? "s" : ""} selectionne{selected.length > 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}

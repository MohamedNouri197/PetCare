"use client";

import React from "react";
import type { Meal } from "@/types";
import { formatTime, getMealTypeLabel } from "@/lib/utils";
import Card from "@/components/ui/Card";
import { UtensilsCrossed, Clock, Trash2 } from "lucide-react";

interface MealCardProps {
  meal: Meal;
  onDelete?: (id: string) => void;
}

export default function MealCard({ meal, onDelete }: MealCardProps) {
  const mealColors: Record<string, string> = {
    breakfast: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
    lunch: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
    dinner: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
    snack: "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400",
  };

  return (
    <Card>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${mealColors[meal.type] || mealColors.snack}`}>
          <UtensilsCrossed className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm text-textColor dark:text-textColor-dark">{meal.foodName}</h3>
            <span className="text-xs text-textColor-light dark:text-textColor-dark-light">
              ({getMealTypeLabel(meal.type)})
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs text-textColor-light dark:text-textColor-dark-light">
            <span>{meal.quantity} {meal.unit}</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatTime(meal.time)}
            </span>
          </div>
        </div>
        {onDelete && (
          <button
            onClick={() => onDelete(meal.id)}
            className="p-2 rounded-lg hover:bg-danger/10 text-textColor-light hover:text-danger transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </Card>
  );
}

"use client";

import React from "react";
import type { Meal } from "@/types";
import MealCard from "./MealCard";
import { getMealTypeLabel } from "@/lib/utils";

interface MealScheduleProps {
  meals: Meal[];
  onDelete?: (id: string) => void;
}

export default function MealSchedule({ meals, onDelete }: MealScheduleProps) {
  const grouped = meals.reduce(
    (acc, meal) => {
      if (!acc[meal.type]) acc[meal.type] = [];
      acc[meal.type].push(meal);
      return acc;
    },
    {} as Record<string, Meal[]>
  );

  const mealOrder = ["breakfast", "lunch", "dinner", "snack"];

  return (
    <div className="space-y-6">
      {mealOrder
        .filter((type) => grouped[type]?.length)
        .map((type) => (
          <div key={type}>
            <h3 className="text-sm font-semibold text-textColor dark:text-textColor-dark mb-3">
              {getMealTypeLabel(type)}
            </h3>
            <div className="space-y-2">
              {grouped[type].map((meal) => (
                <MealCard key={meal.id} meal={meal} onDelete={onDelete} />
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}

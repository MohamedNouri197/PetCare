"use client";

import React from "react";
import type { WeightEntry } from "@/types";
import { formatDateShort, formatWeight } from "@/lib/utils";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";

interface WeightChartProps {
  entries: WeightEntry[];
}

export default function WeightChart({ entries }: WeightChartProps) {
  if (entries.length === 0) return null;

  const sorted = [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const maxWeight = Math.max(...sorted.map((e) => e.weight));
  const minWeight = Math.min(...sorted.map((e) => e.weight));
  const range = maxWeight - minWeight || 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolution du poids</CardTitle>
        <span className="text-sm text-textColor-light dark:text-textColor-dark-light">
          {sorted.length} mesure{sorted.length > 1 ? "s" : ""}
        </span>
      </CardHeader>

      <div className="flex items-end gap-1 sm:gap-2 h-40 mt-4 px-2">
        {sorted.slice(-12).map((entry, i) => {
          const height = ((entry.weight - minWeight) / range) * 80 + 20;
          return (
            <div key={entry.id || i} className="flex-1 flex flex-col items-center gap-1 group">
              <div className="text-[10px] text-textColor-light dark:text-textColor-dark-light opacity-0 group-hover:opacity-100 transition-opacity">
                {formatWeight(entry.weight, entry.unit)}
              </div>
              <div
                className="w-full rounded-t-md bg-gradient-to-t from-primary to-primary-light dark:from-primary-dark dark:to-primary transition-all duration-300 hover:opacity-80 min-w-[8px]"
                style={{ height: `${height}%` }}
                title={`${formatWeight(entry.weight, entry.unit)} - ${formatDateShort(entry.date)}`}
              />
              <div className="text-[9px] text-textColor-light dark:text-textColor-dark-light truncate w-full text-center">
                {formatDateShort(entry.date).slice(0, 5)}
              </div>
            </div>
          );
        })}
      </div>

      {sorted.length >= 2 && (
        <div className="mt-4 flex items-center justify-between text-xs text-textColor-light dark:text-textColor-dark-light">
          <span>Min: {formatWeight(minWeight)}</span>
          <span>
            Variation:{" "}
            {(sorted[sorted.length - 1].weight - sorted[0].weight) > 0 ? "+" : ""}
            {(sorted[sorted.length - 1].weight - sorted[0].weight).toFixed(1)} kg
          </span>
          <span>Max: {formatWeight(maxWeight)}</span>
        </div>
      )}
    </Card>
  );
}

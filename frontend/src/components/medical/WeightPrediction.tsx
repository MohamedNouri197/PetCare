"use client";

import React, { useMemo } from "react";
import type { WeightEntry } from "@/types";
import Card from "@/components/ui/Card";
import { trainWeightModel } from "@/lib/weight-regression";
import { Brain, TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function WeightPrediction({ entries }: { entries: WeightEntry[] }) {
  const model = useMemo(() => trainWeightModel(entries), [entries]);

  if (!model) {
    return (
      <Card className="mb-6">
        <div className="flex items-center gap-2 text-sm font-semibold text-textColor dark:text-textColor-dark">
          <Brain className="w-4 h-4 text-primary" /> Prediction du poids (regression lineaire)
        </div>
        <p className="text-xs text-textColor-light dark:text-textColor-dark-light mt-2">
          Ajoutez au moins 3 pesees a des dates differentes pour entrainer le modele.
        </p>
      </Card>
    );
  }

  const in30 = model.predictInDays(30);
  const in90 = model.predictInDays(90);
  const perWeek = model.slope * 7;
  const Icon = model.trend === "up" ? TrendingUp : model.trend === "down" ? TrendingDown : Minus;
  const trendColor = model.trend === "up" ? "text-warning" : model.trend === "down" ? "text-success" : "text-textColor-light";
  const trendLabel =
    model.trend === "up" ? "Tendance a la prise de poids" : model.trend === "down" ? "Tendance a la perte de poids" : "Poids stable";
  const reliability = model.r2 >= 0.8 ? "elevee" : model.r2 >= 0.5 ? "moyenne" : "faible";

  // Mini graphique SVG : points reels + droite de regression prolongee de 30 jours
  const W = 320, H = 120, P = 16;
  const maxDay = model.lastDay + 30;
  const ys = [...model.points.map((p) => p.weight), model.predict(0), model.predict(maxDay)];
  const minY = Math.min(...ys) - 0.5, maxY = Math.max(...ys) + 0.5;
  const sx = (d: number) => P + (d / (maxDay || 1)) * (W - 2 * P);
  const sy = (w: number) => H - P - ((w - minY) / (maxY - minY || 1)) * (H - 2 * P);

  return (
    <Card className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-textColor dark:text-textColor-dark">
          <Brain className="w-4 h-4 text-primary" /> Prediction du poids (regression lineaire)
        </div>
        <span className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}>
          <Icon className="w-4 h-4" /> {trendLabel}
        </span>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-28 mb-3">
        <line x1={sx(0)} y1={sy(model.predict(0))} x2={sx(model.lastDay)} y2={sy(model.predict(model.lastDay))} stroke="currentColor" className="text-primary" strokeWidth="2" />
        <line x1={sx(model.lastDay)} y1={sy(model.predict(model.lastDay))} x2={sx(maxDay)} y2={sy(model.predict(maxDay))} stroke="currentColor" className="text-primary" strokeWidth="2" strokeDasharray="5 4" />
        {model.points.map((p, i) => (
          <circle key={i} cx={sx(p.day)} cy={sy(p.weight)} r="4" className="fill-accent" />
        ))}
      </svg>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div>
          <div className="text-lg font-bold text-primary">{in30.toFixed(1)} kg</div>
          <div className="text-[11px] text-textColor-light dark:text-textColor-dark-light">Dans 30 jours</div>
        </div>
        <div>
          <div className="text-lg font-bold text-primary">{in90.toFixed(1)} kg</div>
          <div className="text-[11px] text-textColor-light dark:text-textColor-dark-light">Dans 90 jours</div>
        </div>
        <div>
          <div className={`text-lg font-bold ${trendColor}`}>{perWeek > 0 ? "+" : ""}{perWeek.toFixed(2)} kg</div>
          <div className="text-[11px] text-textColor-light dark:text-textColor-dark-light">Par semaine</div>
        </div>
      </div>

      <p className="text-[11px] text-textColor-light dark:text-textColor-dark-light mt-3 leading-relaxed">
        Modele : poids = {model.slope.toFixed(3)} × jours + {model.intercept.toFixed(2)} • R² = {model.r2.toFixed(2)} (fiabilite {reliability}) •
        entraine sur {model.points.length} pesees. Indicatif, ne remplace pas l&apos;avis du veterinaire.
      </p>
    </Card>
  );
}

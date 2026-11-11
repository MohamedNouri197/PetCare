import type { WeightEntry } from "@/types";

/**
 * Regression lineaire simple (moindres carres ordinaires) :  poids = a * jours + b
 * Vrai algorithme de machine learning supervise (apprentissage sur les pesees de l'animal).
 *
 *   a = Σ(x - x̄)(y - ȳ) / Σ(x - x̄)²        (pente, en kg/jour)
 *   b = ȳ - a * x̄                            (ordonnee a l'origine)
 *   R² = 1 - SS_res / SS_tot                 (qualite de l'ajustement, entre 0 et 1)
 */

const LBS_TO_KG = 0.45359237;
const DAY_MS = 1000 * 60 * 60 * 24;

export interface WeightPoint {
  day: number; // jours depuis la 1re pesee
  weight: number; // en kg
}

export interface WeightModel {
  slope: number; // kg/jour
  intercept: number;
  r2: number;
  points: WeightPoint[];
  firstDate: Date;
  lastDay: number;
  predict: (daysFromFirst: number) => number;
  predictInDays: (daysAfterLast: number) => number;
  trend: "up" | "down" | "stable";
}

export function toKg(entry: WeightEntry): number {
  return entry.unit === "lbs" ? entry.weight * LBS_TO_KG : entry.weight;
}

export function trainWeightModel(entries: WeightEntry[]): WeightModel | null {
  if (entries.length < 3) return null;

  const sorted = [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const firstDate = new Date(sorted[0].date);
  const points: WeightPoint[] = sorted.map((e) => ({
    day: (new Date(e.date).getTime() - firstDate.getTime()) / DAY_MS,
    weight: toKg(e),
  }));

  const n = points.length;
  const meanX = points.reduce((s, p) => s + p.day, 0) / n;
  const meanY = points.reduce((s, p) => s + p.weight, 0) / n;
  const sxx = points.reduce((s, p) => s + (p.day - meanX) ** 2, 0);
  if (sxx === 0) return null; // toutes les pesees le meme jour : pas de tendance calculable

  const sxy = points.reduce((s, p) => s + (p.day - meanX) * (p.weight - meanY), 0);
  const slope = sxy / sxx;
  const intercept = meanY - slope * meanX;

  const ssTot = points.reduce((s, p) => s + (p.weight - meanY) ** 2, 0);
  const ssRes = points.reduce((s, p) => s + (p.weight - (slope * p.day + intercept)) ** 2, 0);
  const r2 = ssTot === 0 ? 1 : Math.max(0, 1 - ssRes / ssTot);

  const lastDay = points[points.length - 1].day;
  const predict = (d: number) => slope * d + intercept;
  const perMonth = slope * 30;
  const trend: WeightModel["trend"] = perMonth > 0.1 ? "up" : perMonth < -0.1 ? "down" : "stable";

  return {
    slope,
    intercept,
    r2,
    points,
    firstDate,
    lastDay,
    predict,
    predictInDays: (d) => predict(lastDay + d),
    trend,
  };
}

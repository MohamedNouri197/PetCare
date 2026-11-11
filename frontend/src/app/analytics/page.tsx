"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useAnimals } from "@/hooks/useAnimals";
import type { Animal, MedicalRecord, Vaccination, Meal, WeightEntry, Reminder, Appointment } from "@/types";
import { formatDate, cn, getSpeciesLabel, daysUntil } from "@/lib/utils";
import {
  mockGetMedicalRecords,
  mockGetVaccinations,
  mockGetMeals,
  mockGetWeightEntries,
  mockGetReminders,
  mockGetAppointments,
} from "@/lib/mock-store";
import { api } from "@/lib/api";
import PageContainer from "@/components/layout/PageContainer";
import Card from "@/components/ui/Card";
import Select from "@/components/ui/Select";
import Badge from "@/components/ui/Badge";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  BarChart3,
  PawPrint,
  Stethoscope,
  Syringe,
  Bell,
  TrendingUp,
  TrendingDown,
  Activity,
  Calendar,
  ShieldCheck,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AnimalHealthScore {
  animalId: string;
  animalName: string;
  species: string;
  score: number; // 0-100
  vaccinationScore: number;
  weightScore: number;
  checkupScore: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function shortMonth(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR", { month: "short" });
}

function last6Months(): string[] {
  const months: string[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(d.toISOString().split("T")[0].slice(0, 7)); // "YYYY-MM"
  }
  return months;
}

function computeHealthScore(
  animal: Animal,
  vaccinations: Vaccination[],
  weightEntries: WeightEntry[],
  medicalRecords: MedicalRecord[]
): AnimalHealthScore {
  // Vaccination score (40% weight)
  const totalVacc = vaccinations.length || 1;
  const upToDate = vaccinations.filter((v) => v.status === "up_to_date").length;
  const vaccinationScore = Math.round((upToDate / totalVacc) * 100);

  // Weight stability score (30% weight) - low variance = good
  let weightScore = 100;
  if (weightEntries.length >= 2) {
    const sorted = [...weightEntries].sort((a, b) => a.date.localeCompare(b.date));
    const weights = sorted.map((w) => w.weight);
    const avg = weights.reduce((s, w) => s + w, 0) / weights.length;
    const variance = weights.reduce((s, w) => s + Math.pow(w - avg, 2), 0) / weights.length;
    const cv = avg > 0 ? Math.sqrt(variance) / avg : 0; // coefficient of variation
    // CV < 5% is excellent, > 20% is concerning
    weightScore = Math.max(0, Math.min(100, Math.round(100 - cv * 500)));
  }

  // Recent checkup score (30% weight)
  let checkupScore = 0;
  if (medicalRecords.length > 0) {
    const sorted = [...medicalRecords].sort((a, b) => b.date.localeCompare(a.date));
    const lastCheckup = sorted[0];
    const daysSince = daysUntil(lastCheckup.date) * -1;
    // Within 30 days = 100, within 90 = 80, within 180 = 50, older = 20
    if (daysSince <= 30) checkupScore = 100;
    else if (daysSince <= 90) checkupScore = 80;
    else if (daysSince <= 180) checkupScore = 50;
    else checkupScore = 20;
  }

  const score = Math.round(vaccinationScore * 0.4 + weightScore * 0.3 + checkupScore * 0.3);

  return {
    animalId: animal.id,
    animalName: animal.name,
    species: animal.species,
    score,
    vaccinationScore,
    weightScore,
    checkupScore,
  };
}

// ---------------------------------------------------------------------------
// SVG Chart Components
// ---------------------------------------------------------------------------

function WeightChart({ entries }: { entries: WeightEntry[] }) {
  if (entries.length < 2) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-textColor-light dark:text-textColor-dark-light">
        Pas assez de donnees pour afficher le graphique
      </div>
    );
  }

  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  const weights = sorted.map((e) => e.weight);
  const minW = Math.min(...weights);
  const maxW = Math.max(...weights);
  const rangeW = maxW - minW || 1;

  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  const width = 500;
  const height = 200;
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const points = sorted.map((e, i) => ({
    x: padding.left + (i / (sorted.length - 1)) * chartW,
    y: padding.top + chartH - ((e.weight - minW) / rangeW) * chartH,
    weight: e.weight,
    date: e.date,
    unit: e.unit,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + chartH} L ${points[0].x} ${padding.top + chartH} Z`;

  // Y-axis labels
  const ySteps = 4;
  const yLabels = Array.from({ length: ySteps + 1 }, (_, i) => {
    const val = minW + (rangeW * i) / ySteps;
    return {
      val: val.toFixed(1),
      y: padding.top + chartH - (i / ySteps) * chartH,
    };
  });

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
      {/* Grid lines */}
      {yLabels.map((yl, i) => (
        <line
          key={i}
          x1={padding.left}
          y1={yl.y}
          x2={width - padding.right}
          y2={yl.y}
          className="stroke-gray-200 dark:stroke-gray-700"
          strokeWidth="0.5"
          strokeDasharray="4 2"
        />
      ))}

      {/* Y-axis labels */}
      {yLabels.map((yl, i) => (
        <text
          key={i}
          x={padding.left - 8}
          y={yl.y + 4}
          textAnchor="end"
          className="fill-textColor-light dark:fill-gray-400 text-[10px]"
        >
          {yl.val}
        </text>
      ))}

      {/* Area fill */}
      <path d={areaPath} className="fill-primary/10" />

      {/* Line */}
      <path d={linePath} fill="none" className="stroke-primary" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Dots and labels */}
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4" className="fill-primary stroke-white dark:stroke-surface-dark" strokeWidth="2" />
          <text
            x={p.x}
            y={p.y - 10}
            textAnchor="middle"
            className="fill-textColor dark:fill-textColor-dark text-[9px] font-semibold"
          >
            {p.weight} {p.unit}
          </text>
          {/* X-axis date label */}
          <text
            x={p.x}
            y={height - 8}
            textAnchor="middle"
            className="fill-textColor-light dark:fill-gray-400 text-[9px]"
          >
            {shortMonth(p.date)}
          </text>
        </g>
      ))}
    </svg>
  );
}

function MonthlyActivityChart({
  consultations,
  vaccinations,
  meals,
}: {
  consultations: Record<string, number>;
  vaccinations: Record<string, number>;
  meals: Record<string, number>;
}) {
  const months = last6Months();
  const maxVal = Math.max(
    1,
    ...months.map((m) => (consultations[m] || 0) + (vaccinations[m] || 0) + (meals[m] || 0))
  );

  const padding = { top: 10, right: 10, bottom: 40, left: 35 };
  const width = 500;
  const height = 200;
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;
  const barGroupWidth = chartW / months.length;
  const barWidth = barGroupWidth * 0.22;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
      {/* Horizontal grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((frac, i) => {
        const y = padding.top + chartH * (1 - frac);
        return (
          <g key={i}>
            <line
              x1={padding.left}
              y1={y}
              x2={width - padding.right}
              y2={y}
              className="stroke-gray-200 dark:stroke-gray-700"
              strokeWidth="0.5"
              strokeDasharray="4 2"
            />
            <text
              x={padding.left - 6}
              y={y + 4}
              textAnchor="end"
              className="fill-textColor-light dark:fill-gray-400 text-[9px]"
            >
              {Math.round(maxVal * frac)}
            </text>
          </g>
        );
      })}

      {months.map((month, mi) => {
        const cx = padding.left + barGroupWidth * mi + barGroupWidth / 2;
        const cVal = consultations[month] || 0;
        const vVal = vaccinations[month] || 0;
        const mVal = meals[month] || 0;

        const barH = (val: number) => (val / maxVal) * chartH;

        return (
          <g key={month}>
            {/* Consultations bar */}
            <rect
              x={cx - barWidth * 1.6}
              y={padding.top + chartH - barH(cVal)}
              width={barWidth}
              height={Math.max(barH(cVal), 0)}
              rx="2"
              className="fill-primary"
            />
            {/* Vaccinations bar */}
            <rect
              x={cx - barWidth * 0.5}
              y={padding.top + chartH - barH(vVal)}
              width={barWidth}
              height={Math.max(barH(vVal), 0)}
              rx="2"
              className="fill-accent"
            />
            {/* Meals bar */}
            <rect
              x={cx + barWidth * 0.6}
              y={padding.top + chartH - barH(mVal)}
              width={barWidth}
              height={Math.max(barH(mVal), 0)}
              rx="2"
              className="fill-warning"
            />
            {/* Month label */}
            <text
              x={cx}
              y={height - 10}
              textAnchor="middle"
              className="fill-textColor-light dark:fill-gray-400 text-[10px]"
            >
              {new Date(month + "-01").toLocaleDateString("fr-FR", { month: "short" })}
            </text>
          </g>
        );
      })}

      {/* Legend */}
      <circle cx={padding.left + 5} cy={height - 2} r="3" className="fill-primary" />
      <text x={padding.left + 12} y={height} className="fill-textColor-light dark:fill-gray-400 text-[8px]">Consult.</text>
      <circle cx={padding.left + 60} cy={height - 2} r="3" className="fill-accent" />
      <text x={padding.left + 67} y={height} className="fill-textColor-light dark:fill-gray-400 text-[8px]">Vaccins</text>
      <circle cx={padding.left + 115} cy={height - 2} r="3" className="fill-warning" />
      <text x={padding.left + 122} y={height} className="fill-textColor-light dark:fill-gray-400 text-[8px]">Repas</text>
    </svg>
  );
}

function DonutChart({ percentage, label, size = 120 }: { percentage: number; label: string; size?: number }) {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const center = size / 2;

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          className="stroke-gray-200 dark:stroke-gray-700"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          className={cn(
            percentage >= 75 ? "stroke-success" : percentage >= 50 ? "stroke-warning" : "stroke-danger"
          )}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
          style={{ transition: "stroke-dashoffset 0.8s ease-in-out" }}
        />
        {/* Percentage text */}
        <text
          x={center}
          y={center - 4}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-textColor dark:fill-textColor-dark text-lg font-bold"
          style={{ fontSize: "20px", fontWeight: 700 }}
        >
          {percentage}%
        </text>
        <text
          x={center}
          y={center + 14}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-textColor-light dark:fill-gray-400"
          style={{ fontSize: "10px" }}
        >
          {label}
        </text>
      </svg>
    </div>
  );
}

function SpeciesDistributionChart({ distribution }: { distribution: { species: string; count: number; label: string }[] }) {
  const total = distribution.reduce((s, d) => s + d.count, 0) || 1;
  const colors = [
    "fill-primary", "fill-accent", "fill-warning", "fill-danger",
    "fill-success", "fill-secondary",
  ];
  const strokeColors = [
    "stroke-primary", "stroke-accent", "stroke-warning", "stroke-danger",
    "stroke-success", "stroke-secondary",
  ];
  const size = 140;
  const center = size / 2;
  const radius = 50;
  const innerRadius = 30;

  // Calculate arcs
  let currentAngle = -90; // start at top
  const slices = distribution.map((d, i) => {
    const angle = (d.count / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1Outer = center + radius * Math.cos(startRad);
    const y1Outer = center + radius * Math.sin(startRad);
    const x2Outer = center + radius * Math.cos(endRad);
    const y2Outer = center + radius * Math.sin(endRad);

    const x1Inner = center + innerRadius * Math.cos(endRad);
    const y1Inner = center + innerRadius * Math.sin(endRad);
    const x2Inner = center + innerRadius * Math.cos(startRad);
    const y2Inner = center + innerRadius * Math.sin(startRad);

    const largeArcFlag = angle > 180 ? 1 : 0;

    const path = [
      `M ${x1Outer} ${y1Outer}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2Outer} ${y2Outer}`,
      `L ${x1Inner} ${y1Inner}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x2Inner} ${y2Inner}`,
      "Z",
    ].join(" ");

    return { path, color: colors[i % colors.length], strokeColor: strokeColors[i % strokeColors.length], ...d };
  });

  return (
    <div className="flex items-center gap-4">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {slices.map((slice, i) => (
          <path
            key={i}
            d={slice.path}
            className={cn(slice.color, "opacity-80 hover:opacity-100 transition-opacity")}
            stroke="white"
            strokeWidth="1.5"
          />
        ))}
        <text
          x={center}
          y={center - 2}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-textColor dark:fill-textColor-dark font-bold"
          style={{ fontSize: "18px" }}
        >
          {total}
        </text>
        <text
          x={center}
          y={center + 12}
          textAnchor="middle"
          className="fill-textColor-light dark:fill-gray-400"
          style={{ fontSize: "9px" }}
        >
          animaux
        </text>
      </svg>
      <div className="flex flex-col gap-1.5">
        {slices.map((slice, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={cn("w-2.5 h-2.5 rounded-full", slice.color.replace("fill-", "bg-"))} />
            <span className="text-xs text-textColor dark:text-textColor-dark">
              {slice.label}
            </span>
            <span className="text-xs text-textColor-light dark:text-textColor-dark-light ml-auto">
              {slice.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HealthScoreGauge({ score }: { score: number }) {
  const color = score >= 75 ? "text-success" : score >= 50 ? "text-warning" : "text-danger";
  const bgColor = score >= 75 ? "bg-success" : score >= 50 ? "bg-warning" : "bg-danger";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-700", bgColor)}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={cn("text-sm font-bold tabular-nums", color)}>{score}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function AnalyticsPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { animals, isLoading: animalsLoading } = useAnimals();
  const router = useRouter();

  const [selectedAnimalId, setSelectedAnimalId] = useState<string>("all");
  const [allMedicalRecords, setAllMedicalRecords] = useState<MedicalRecord[]>([]);
  const [allVaccinations, setAllVaccinations] = useState<Vaccination[]>([]);
  const [allMeals, setAllMeals] = useState<Meal[]>([]);
  const [allWeightEntries, setAllWeightEntries] = useState<WeightEntry[]>([]);
  const [allReminders, setAllReminders] = useState<Reminder[]>([]);
  const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/login");
  }, [isAuthenticated, authLoading, router]);

  // Load all data when animals are available
  useEffect(() => {
    if (animals.length === 0) return;

    const loadAll = async () => {
      let records: MedicalRecord[] = [];
      let vaccs: Vaccination[] = [];
      let meals: Meal[] = [];
      let weights: WeightEntry[] = [];

      await Promise.all(
        animals.map(async (animal) => {
          try {
            const [r, v, m, w] = await Promise.all([
              api.getMedicalRecords(animal.id),
              api.getVaccinations(animal.id),
              api.getMeals(animal.id),
              api.getWeightEntries(animal.id),
            ]);
            records = records.concat(r);
            vaccs = vaccs.concat(v);
            meals = meals.concat(m);
            weights = weights.concat(w);
          } catch {
            records = records.concat(mockGetMedicalRecords(animal.id));
            vaccs = vaccs.concat(mockGetVaccinations(animal.id));
            meals = meals.concat(mockGetMeals(animal.id));
            weights = weights.concat(mockGetWeightEntries(animal.id));
          }
        })
      );

      setAllMedicalRecords(records);
      setAllVaccinations(vaccs);
      setAllMeals(meals);
      setAllWeightEntries(weights);

      try {
        setAllReminders(await api.getReminders());
      } catch {
        setAllReminders(mockGetReminders(user?.id));
      }
      try {
        setAllAppointments(await api.getAppointments());
      } catch {
        setAllAppointments(mockGetAppointments(user?.id));
      }
    };
    loadAll();
  }, [animals, user]);

  // ---------------------------------------------------------------------------
  // Computed data
  // ---------------------------------------------------------------------------

  const filteredAnimals = useMemo(() => {
    if (selectedAnimalId === "all") return animals;
    return animals.filter((a) => a.id === selectedAnimalId);
  }, [animals, selectedAnimalId]);

  const filteredAnimalIds = useMemo(() => new Set(filteredAnimals.map((a) => a.id)), [filteredAnimals]);

  const medicalRecords = useMemo(
    () => allMedicalRecords.filter((r) => filteredAnimalIds.has(r.animalId)),
    [allMedicalRecords, filteredAnimalIds]
  );

  const vaccinations = useMemo(
    () => allVaccinations.filter((v) => filteredAnimalIds.has(v.animalId)),
    [allVaccinations, filteredAnimalIds]
  );

  const meals = useMemo(
    () => allMeals.filter((m) => filteredAnimalIds.has(m.animalId)),
    [allMeals, filteredAnimalIds]
  );

  const weightEntries = useMemo(
    () => allWeightEntries.filter((w) => filteredAnimalIds.has(w.animalId)),
    [allWeightEntries, filteredAnimalIds]
  );

  const reminders = useMemo(
    () =>
      allReminders.filter(
        (r) => r.isActive && (!r.animalId || filteredAnimalIds.has(r.animalId))
      ),
    [allReminders, filteredAnimalIds]
  );

  const appointments = useMemo(
    () => allAppointments.filter((a) => filteredAnimalIds.has(a.animalId)),
    [allAppointments, filteredAnimalIds]
  );

  // --- Summary Cards ---
  const totalAnimals = filteredAnimals.length;
  const totalConsultations = medicalRecords.length;
  const vaccinationsUpToDate = vaccinations.filter((v) => v.status === "up_to_date").length;
  const activeReminders = reminders.length;

  // Trend: compare current month vs previous month consultations
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevMonth = `${prevMonthDate.getFullYear()}-${String(prevMonthDate.getMonth() + 1).padStart(2, "0")}`;

  const currentMonthConsultations = medicalRecords.filter((r) => r.date.startsWith(currentMonth)).length;
  const prevMonthConsultations = medicalRecords.filter((r) => r.date.startsWith(prevMonth)).length;
  const consultationTrend = currentMonthConsultations - prevMonthConsultations;

  // --- Vaccination coverage ---
  const totalVaccinations = vaccinations.length || 1;
  const vaccinationCoverage = Math.round((vaccinationsUpToDate / totalVaccinations) * 100);

  // --- Monthly activity data ---
  const monthlyConsultations = useMemo(() => {
    const map: Record<string, number> = {};
    medicalRecords.forEach((r) => {
      const m = r.date.slice(0, 7);
      map[m] = (map[m] || 0) + 1;
    });
    return map;
  }, [medicalRecords]);

  const monthlyVaccinations = useMemo(() => {
    const map: Record<string, number> = {};
    vaccinations.forEach((v) => {
      const m = v.date.slice(0, 7);
      map[m] = (map[m] || 0) + 1;
    });
    return map;
  }, [vaccinations]);

  const monthlyMeals = useMemo(() => {
    const map: Record<string, number> = {};
    meals.forEach((meal) => {
      const m = meal.createdAt.slice(0, 7);
      map[m] = (map[m] || 0) + 1;
    });
    return map;
  }, [meals]);

  // --- Species distribution ---
  const speciesDistribution = useMemo(() => {
    const map: Record<string, number> = {};
    filteredAnimals.forEach((a) => {
      map[a.species] = (map[a.species] || 0) + 1;
    });
    return Object.entries(map).map(([species, count]) => ({
      species,
      count,
      label: getSpeciesLabel(species),
    }));
  }, [filteredAnimals]);

  // --- Upcoming events ---
  const upcomingEvents = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const events: { id: string; title: string; animalName: string; date: string; time?: string; type: string; daysLeft: number }[] = [];

    // Upcoming appointments
    appointments
      .filter((a) => a.status === "scheduled" && a.date >= today)
      .forEach((a) => {
        events.push({
          id: `appt-${a.id}`,
          title: a.title,
          animalName: a.animalName || "",
          date: a.date,
          time: a.time,
          type: "appointment",
          daysLeft: daysUntil(a.date),
        });
      });

    // Active reminders in the future
    reminders
      .filter((r) => r.date >= today)
      .forEach((r) => {
        events.push({
          id: `rem-${r.id}`,
          title: r.title,
          animalName: r.animalName || "",
          date: r.date,
          time: r.time,
          type: r.type,
          daysLeft: daysUntil(r.date),
        });
      });

    return events.sort((a, b) => a.date.localeCompare(b.date)).slice(0, 8);
  }, [appointments, reminders]);

  // --- Health scores ---
  const healthScores = useMemo(() => {
    return filteredAnimals.map((animal) => {
      const animalVaccs = allVaccinations.filter((v) => v.animalId === animal.id);
      const animalWeights = allWeightEntries.filter((w) => w.animalId === animal.id);
      const animalRecords = allMedicalRecords.filter((r) => r.animalId === animal.id);
      return computeHealthScore(animal, animalVaccs, animalWeights, animalRecords);
    });
  }, [filteredAnimals, allVaccinations, allWeightEntries, allMedicalRecords]);

  // --- Weight chart entries for selected animal(s) ---
  const weightChartEntries = useMemo(() => {
    if (selectedAnimalId !== "all") {
      return allWeightEntries
        .filter((w) => w.animalId === selectedAnimalId)
        .sort((a, b) => a.date.localeCompare(b.date));
    }
    // If "all", show the first animal that has weight data
    for (const animal of animals) {
      const entries = allWeightEntries
        .filter((w) => w.animalId === animal.id)
        .sort((a, b) => a.date.localeCompare(b.date));
      if (entries.length >= 2) return entries;
    }
    return [];
  }, [selectedAnimalId, allWeightEntries, animals]);

  const weightChartAnimalName = useMemo(() => {
    if (weightChartEntries.length === 0) return "";
    const animalId = weightChartEntries[0].animalId;
    return animals.find((a) => a.id === animalId)?.name || "";
  }, [weightChartEntries, animals]);

  // --- Animal selector options ---
  const animalOptions = useMemo(
    () => [
      { value: "all", label: "Tous les animaux" },
      ...animals.map((a) => ({ value: a.id, label: a.name })),
    ],
    [animals]
  );

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  if (authLoading || animalsLoading) return <LoadingSpinner fullScreen />;
  if (!isAuthenticated) return null;

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-textColor dark:text-textColor-dark flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-primary" />
            Tableau de bord
          </h1>
          <p className="text-sm text-textColor-light dark:text-textColor-dark-light mt-0.5">
            Vue d&apos;ensemble de la sante de vos animaux
          </p>
        </div>
        <div className="w-full sm:w-56">
          <Select
            options={animalOptions}
            value={selectedAnimalId}
            onChange={(e) => setSelectedAnimalId(e.target.value)}
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          {
            label: "Animaux",
            value: totalAnimals,
            icon: PawPrint,
            color: "bg-primary/10 text-primary",
            trend: null,
          },
          {
            label: "Consultations",
            value: totalConsultations,
            icon: Stethoscope,
            color: "bg-accent/10 text-accent",
            trend: consultationTrend,
          },
          {
            label: "Vaccins a jour",
            value: vaccinationsUpToDate,
            icon: Syringe,
            color: "bg-success/10 text-success",
            trend: null,
          },
          {
            label: "Rappels actifs",
            value: activeReminders,
            icon: Bell,
            color: "bg-warning/10 text-warning",
            trend: null,
          },
        ].map((card) => (
          <Card key={card.label} className="relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", card.color)}>
                <card.icon className="w-5 h-5" />
              </div>
              {card.trend !== null && (
                <div
                  className={cn(
                    "flex items-center gap-0.5 text-xs font-medium",
                    card.trend >= 0 ? "text-success" : "text-danger"
                  )}
                >
                  {card.trend >= 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {card.trend >= 0 ? "+" : ""}
                  {card.trend}
                </div>
              )}
            </div>
            <p className="text-2xl font-bold text-textColor dark:text-textColor-dark mt-3">{card.value}</p>
            <p className="text-xs text-textColor-light dark:text-textColor-dark-light mt-0.5">{card.label}</p>
          </Card>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Weight Evolution */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-textColor dark:text-textColor-dark">
                Evolution du poids
              </h3>
              {weightChartAnimalName && (
                <p className="text-xs text-textColor-light dark:text-textColor-dark-light mt-0.5">
                  {weightChartAnimalName}
                </p>
              )}
            </div>
            <Activity className="w-4 h-4 text-primary" />
          </div>
          <WeightChart entries={weightChartEntries} />
        </Card>

        {/* Monthly Activity */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-textColor dark:text-textColor-dark">
                Activite mensuelle
              </h3>
              <p className="text-xs text-textColor-light dark:text-textColor-dark-light mt-0.5">
                6 derniers mois
              </p>
            </div>
            <BarChart3 className="w-4 h-4 text-accent" />
          </div>
          <MonthlyActivityChart
            consultations={monthlyConsultations}
            vaccinations={monthlyVaccinations}
            meals={monthlyMeals}
          />
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {/* Vaccination Coverage */}
        <Card>
          <h3 className="text-sm font-semibold text-textColor dark:text-textColor-dark mb-4">
            Couverture vaccinale
          </h3>
          <div className="flex justify-center">
            <DonutChart percentage={vaccinationCoverage} label="a jour" />
          </div>
          <div className="mt-3 flex items-center justify-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <Badge variant="success" size="sm">A jour</Badge>
              <span className="text-textColor-light dark:text-textColor-dark-light">{vaccinationsUpToDate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Badge variant="warning" size="sm">Bientot</Badge>
              <span className="text-textColor-light dark:text-textColor-dark-light">
                {vaccinations.filter((v) => v.status === "due_soon").length}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Badge variant="danger" size="sm">En retard</Badge>
              <span className="text-textColor-light dark:text-textColor-dark-light">
                {vaccinations.filter((v) => v.status === "overdue").length}
              </span>
            </div>
          </div>
        </Card>

        {/* Species Distribution */}
        <Card>
          <h3 className="text-sm font-semibold text-textColor dark:text-textColor-dark mb-4">
            Repartition par espece
          </h3>
          {speciesDistribution.length > 0 ? (
            <SpeciesDistributionChart distribution={speciesDistribution} />
          ) : (
            <div className="flex items-center justify-center h-32 text-sm text-textColor-light dark:text-textColor-dark-light">
              Aucun animal enregistre
            </div>
          )}
        </Card>

        {/* Upcoming Events */}
        <Card className="sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-textColor dark:text-textColor-dark">
              Prochains evenements
            </h3>
            <Calendar className="w-4 h-4 text-primary" />
          </div>
          {upcomingEvents.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-sm text-textColor-light dark:text-textColor-dark-light">
              Aucun evenement a venir
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-2.5 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50"
                >
                  {/* Timeline dot */}
                  <div className="mt-1.5 flex flex-col items-center">
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full",
                        event.type === "appointment"
                          ? "bg-primary"
                          : event.type === "vaccination"
                          ? "bg-accent"
                          : "bg-warning"
                      )}
                    />
                    <div className="w-px h-full bg-gray-200 dark:bg-gray-700 mt-1" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-textColor dark:text-textColor-dark truncate">
                      {event.title}
                    </p>
                    <p className="text-[10px] text-textColor-light dark:text-textColor-dark-light mt-0.5">
                      {event.animalName && `${event.animalName} - `}
                      {formatDate(event.date)}
                      {event.time && ` a ${event.time}`}
                    </p>
                  </div>
                  <Badge
                    variant={event.daysLeft === 0 ? "danger" : event.daysLeft <= 3 ? "warning" : "primary"}
                    size="sm"
                  >
                    {event.daysLeft === 0
                      ? "Aujourd'hui"
                      : event.daysLeft === 1
                      ? "Demain"
                      : `J-${event.daysLeft}`}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Health Scores */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-textColor dark:text-textColor-dark">
              Score de sante
            </h3>
            <p className="text-xs text-textColor-light dark:text-textColor-dark-light mt-0.5">
              Base sur les vaccinations, la stabilite du poids et les bilans recents
            </p>
          </div>
          <ShieldCheck className="w-4 h-4 text-success" />
        </div>
        {healthScores.length === 0 ? (
          <div className="flex items-center justify-center h-24 text-sm text-textColor-light dark:text-textColor-dark-light">
            Aucun animal enregistre
          </div>
        ) : (
          <div className="space-y-4">
            {healthScores.map((hs) => (
              <div key={hs.animalId}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary text-xs font-bold">
                        {hs.animalName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-textColor dark:text-textColor-dark">
                        {hs.animalName}
                      </p>
                      <p className="text-[10px] text-textColor-light dark:text-textColor-dark-light">
                        {getSpeciesLabel(hs.species)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={hs.vaccinationScore >= 75 ? "success" : hs.vaccinationScore >= 50 ? "warning" : "danger"} size="sm">
                      Vaccins {hs.vaccinationScore}%
                    </Badge>
                    <Badge variant={hs.checkupScore >= 75 ? "success" : hs.checkupScore >= 50 ? "warning" : "danger"} size="sm">
                      Bilans {hs.checkupScore}%
                    </Badge>
                  </div>
                </div>
                <HealthScoreGauge score={hs.score} />
              </div>
            ))}
          </div>
        )}
      </Card>
    </PageContainer>
  );
}

"use client";

import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { VetSlot } from "@/types";

interface AppointmentCalendarProps {
  slots: VetSlot[];
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}

const DAYS_FR = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const MONTHS_FR = [
  "Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre",
];

export default function AppointmentCalendar({ slots, selectedDate, onSelectDate }: AppointmentCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  const slotsByDate = useMemo(() => {
    const map: Record<string, { total: number; available: number }> = {};
    slots.forEach((s) => {
      if (!map[s.date]) map[s.date] = { total: 0, available: 0 };
      map[s.date].total++;
      if (!s.isBooked) map[s.date].available++;
    });
    return map;
  }, [slots]);

  const days = useMemo(() => {
    const { year, month } = currentMonth;
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    let startDow = firstDay.getDay() - 1;
    if (startDow < 0) startDow = 6;

    const result: { date: Date; isCurrentMonth: boolean; dateStr: string }[] = [];

    for (let i = startDow - 1; i >= 0; i--) {
      const d = new Date(year, month, -i);
      result.push({ date: d, isCurrentMonth: false, dateStr: d.toISOString().split("T")[0] });
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      const d = new Date(year, month, i);
      result.push({ date: d, isCurrentMonth: true, dateStr: d.toISOString().split("T")[0] });
    }

    const remaining = 42 - result.length;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i);
      result.push({ date: d, isCurrentMonth: false, dateStr: d.toISOString().split("T")[0] });
    }

    return result;
  }, [currentMonth]);

  const today = new Date().toISOString().split("T")[0];

  const prevMonth = () => {
    setCurrentMonth((prev) => {
      if (prev.month === 0) return { year: prev.year - 1, month: 11 };
      return { ...prev, month: prev.month - 1 };
    });
  };

  const nextMonth = () => {
    setCurrentMonth((prev) => {
      if (prev.month === 11) return { year: prev.year + 1, month: 0 };
      return { ...prev, month: prev.month + 1 };
    });
  };

  return (
    <div className="bg-surface dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10">
        <button
          onClick={prevMonth}
          className="p-2 rounded-xl hover:bg-white/60 dark:hover:bg-gray-700 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-textColor dark:text-textColor-dark" />
        </button>
        <h3 className="text-base font-bold text-textColor dark:text-textColor-dark">
          {MONTHS_FR[currentMonth.month]} {currentMonth.year}
        </h3>
        <button
          onClick={nextMonth}
          className="p-2 rounded-xl hover:bg-white/60 dark:hover:bg-gray-700 transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-textColor dark:text-textColor-dark" />
        </button>
      </div>

      {/* Days header */}
      <div className="grid grid-cols-7 px-3 py-2 border-b border-gray-100 dark:border-gray-700/50">
        {DAYS_FR.map((day) => (
          <div key={day} className="text-center text-xs font-semibold text-textColor-light dark:text-textColor-dark-light py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 px-3 py-2 gap-y-1">
        {days.map(({ date, isCurrentMonth, dateStr }, idx) => {
          const info = slotsByDate[dateStr];
          const isPast = dateStr < today;
          const isSelected = dateStr === selectedDate;
          const isToday = dateStr === today;
          const hasSlots = info && info.available > 0;

          return (
            <button
              key={idx}
              onClick={() => {
                if (!isPast && isCurrentMonth) onSelectDate(dateStr);
              }}
              disabled={isPast || !isCurrentMonth}
              className={cn(
                "relative flex flex-col items-center justify-center py-2 rounded-xl transition-all duration-200 text-sm",
                !isCurrentMonth && "opacity-30",
                isPast && isCurrentMonth && "opacity-40 cursor-not-allowed",
                isSelected && "bg-primary text-white shadow-md scale-105",
                !isSelected && isToday && "bg-primary/10 text-primary font-bold",
                !isSelected && !isToday && isCurrentMonth && !isPast && "hover:bg-gray-100 dark:hover:bg-gray-800 text-textColor dark:text-textColor-dark",
              )}
            >
              <span className={cn("text-sm", isSelected ? "font-bold" : "font-medium")}>
                {date.getDate()}
              </span>
              {hasSlots && !isPast && (
                <span
                  className={cn(
                    "w-1.5 h-1.5 rounded-full mt-0.5",
                    isSelected ? "bg-white" : "bg-success"
                  )}
                />
              )}
              {info && info.total > 0 && info.available === 0 && !isPast && (
                <span
                  className={cn(
                    "w-1.5 h-1.5 rounded-full mt-0.5",
                    isSelected ? "bg-white/50" : "bg-danger/50"
                  )}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 px-4 py-3 border-t border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/30">
        <div className="flex items-center gap-1.5 text-xs text-textColor-light dark:text-textColor-dark-light">
          <span className="w-2 h-2 rounded-full bg-success" />
          Disponible
        </div>
        <div className="flex items-center gap-1.5 text-xs text-textColor-light dark:text-textColor-dark-light">
          <span className="w-2 h-2 rounded-full bg-danger/50" />
          Complet
        </div>
      </div>
    </div>
  );
}

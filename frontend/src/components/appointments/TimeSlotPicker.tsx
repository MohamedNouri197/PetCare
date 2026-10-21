"use client";

import React from "react";
import { cn, formatDate } from "@/lib/utils";
import type { VetSlot } from "@/types";
import { Clock, Check } from "lucide-react";

interface TimeSlotPickerProps {
  date: string;
  slots: VetSlot[];
  selectedSlot: VetSlot | null;
  onSelectSlot: (slot: VetSlot) => void;
}

export default function TimeSlotPicker({ date, slots, selectedSlot, onSelectSlot }: TimeSlotPickerProps) {
  const available = slots.filter((s) => !s.isBooked);
  const morningSlots = available.filter((s) => parseInt(s.startTime) < 12);
  const afternoonSlots = available.filter((s) => parseInt(s.startTime) >= 12);

  if (available.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
          <Clock className="w-7 h-7 text-textColor-light dark:text-textColor-dark-light" />
        </div>
        <p className="text-sm font-medium text-textColor dark:text-textColor-dark">Aucun creneau disponible</p>
        <p className="text-xs text-textColor-light dark:text-textColor-dark-light mt-1">
          Essayez une autre date
        </p>
      </div>
    );
  }

  const renderSlotGroup = (title: string, groupSlots: VetSlot[]) => {
    if (groupSlots.length === 0) return null;
    return (
      <div>
        <p className="text-xs font-semibold text-textColor-light dark:text-textColor-dark-light uppercase tracking-wide mb-2">
          {title}
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {groupSlots.map((slot) => {
            const isSelected = selectedSlot?.id === slot.id;
            return (
              <button
                key={slot.id}
                onClick={() => onSelectSlot(slot)}
                className={cn(
                  "relative flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-sm font-medium transition-all duration-200",
                  isSelected
                    ? "bg-primary text-white shadow-md ring-2 ring-primary/30 scale-[1.02]"
                    : "bg-gray-50 dark:bg-gray-800 text-textColor dark:text-textColor-dark hover:bg-primary/10 hover:text-primary border border-gray-100 dark:border-gray-700"
                )}
              >
                {isSelected && <Check className="w-3.5 h-3.5" />}
                {slot.startTime}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-textColor dark:text-textColor-dark">
          {formatDate(date)}
        </h4>
        <span className="text-xs text-success font-medium bg-success/10 px-2.5 py-1 rounded-full">
          {available.length} creneau{available.length > 1 ? "x" : ""}
        </span>
      </div>
      <div className="space-y-4">
        {renderSlotGroup("Matin", morningSlots)}
        {renderSlotGroup("Apres-midi", afternoonSlots)}
      </div>
    </div>
  );
}

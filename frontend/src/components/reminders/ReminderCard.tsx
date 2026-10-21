"use client";

import React from "react";
import type { Reminder } from "@/types";
import { formatDate, getReminderTypeLabel, daysUntil } from "@/lib/utils";
import Card from "@/components/ui/Card";
import { Bell, BellOff, Trash2 } from "lucide-react";

interface ReminderCardProps {
  reminder: Reminder;
  onToggle?: (id: string, isActive: boolean) => void;
  onDelete?: (id: string) => void;
}

export default function ReminderCard({ reminder, onToggle, onDelete }: ReminderCardProps) {
  const days = daysUntil(reminder.date);

  return (
    <Card className={!reminder.isActive ? "opacity-60" : ""}>
      <div className="flex items-start gap-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
            reminder.isActive
              ? "bg-primary/10 dark:bg-primary/20 text-primary"
              : "bg-gray-100 dark:bg-gray-700 text-textColor-light dark:text-textColor-dark-light"
          }`}
        >
          {reminder.isActive ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-sm text-textColor dark:text-textColor-dark">{reminder.title}</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
              {getReminderTypeLabel(reminder.type)}
            </span>
          </div>
          {reminder.animalName && (
            <p className="text-xs text-primary font-medium mt-0.5">{reminder.animalName}</p>
          )}
          {reminder.description && (
            <p className="text-xs text-textColor-light dark:text-textColor-dark-light mt-1 line-clamp-2">
              {reminder.description}
            </p>
          )}
          <div className="flex items-center gap-3 mt-2 text-xs text-textColor-light dark:text-textColor-dark-light">
            <span>{formatDate(reminder.date)}</span>
            {reminder.time && <span>{reminder.time}</span>}
            {days >= 0 && (
              <span className={days <= 3 ? "text-danger font-medium" : ""}>
                {days === 0 ? "Aujourd'hui" : `Dans ${days} jour${days > 1 ? "s" : ""}`}
              </span>
            )}
            {reminder.recurrence && reminder.recurrence !== "none" && (
              <span className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                {reminder.recurrence === "daily" && "Quotidien"}
                {reminder.recurrence === "weekly" && "Hebdomadaire"}
                {reminder.recurrence === "monthly" && "Mensuel"}
                {reminder.recurrence === "yearly" && "Annuel"}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {onToggle && (
            <button
              onClick={() => onToggle(reminder.id, !reminder.isActive)}
              className={`relative w-10 h-6 rounded-full transition-colors ${
                reminder.isActive ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                  reminder.isActive ? "left-5" : "left-1"
                }`}
              />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(reminder.id)}
              className="p-1.5 rounded-lg hover:bg-danger/10 text-textColor-light hover:text-danger transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}

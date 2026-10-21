"use client";

import React from "react";
import type { Vaccination } from "@/types";
import { formatDate, getVaccinationStatusBadge, daysUntil } from "@/lib/utils";
import Card from "@/components/ui/Card";
import { Syringe, Clock } from "lucide-react";

interface VaccinationCardProps {
  vaccination: Vaccination;
}

export default function VaccinationCard({ vaccination }: VaccinationCardProps) {
  const badge = getVaccinationStatusBadge(vaccination.status);
  const daysLeft = daysUntil(vaccination.nextDueDate);

  return (
    <Card hoverable>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-success/10 dark:bg-success/20 flex items-center justify-center flex-shrink-0">
          <Syringe className="w-5 h-5 text-success" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-sm text-textColor dark:text-textColor-dark">{vaccination.name}</h3>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
              {badge.label}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-2 text-xs text-textColor-light dark:text-textColor-dark-light">
            <span>Fait le: {formatDate(vaccination.date)}</span>
          </div>
          <div className="flex items-center gap-1.5 mt-1.5 text-xs">
            <Clock className="w-3 h-3" />
            <span
              className={
                daysLeft < 0
                  ? "text-danger font-medium"
                  : daysLeft <= 30
                    ? "text-warning font-medium"
                    : "text-textColor-light dark:text-textColor-dark-light"
              }
            >
              {daysLeft < 0
                ? `En retard de ${Math.abs(daysLeft)} jours`
                : daysLeft === 0
                  ? "A faire aujourd'hui"
                  : `Prochain dans ${daysLeft} jours (${formatDate(vaccination.nextDueDate)})`}
            </span>
          </div>
          {vaccination.veterinarian && (
            <p className="text-xs text-textColor-light dark:text-textColor-dark-light mt-1">
              Dr. {vaccination.veterinarian}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}

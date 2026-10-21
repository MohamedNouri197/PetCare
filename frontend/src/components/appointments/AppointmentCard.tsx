"use client";

import React from "react";
import type { Appointment } from "@/types";
import { formatDate, formatTime, getAppointmentStatusBadge } from "@/lib/utils";
import Card from "@/components/ui/Card";
import { Calendar, Clock, MapPin, User } from "lucide-react";

interface AppointmentCardProps {
  appointment: Appointment;
  showAnimalName?: boolean;
}

export default function AppointmentCard({ appointment, showAnimalName = false }: AppointmentCardProps) {
  const badge = getAppointmentStatusBadge(appointment.status);

  return (
    <Card hoverable>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-warning/10 dark:bg-warning/20 flex items-center justify-center flex-shrink-0">
          <Calendar className="w-5 h-5 text-warning" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-sm text-textColor dark:text-textColor-dark">{appointment.title}</h3>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
              {badge.label}
            </span>
          </div>
          {showAnimalName && appointment.animalName && (
            <p className="text-xs text-primary font-medium mt-0.5">{appointment.animalName}</p>
          )}
          {appointment.description && (
            <p className="text-xs text-textColor-light dark:text-textColor-dark-light mt-1 line-clamp-2">
              {appointment.description}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-textColor-light dark:text-textColor-dark-light">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(appointment.date)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatTime(appointment.time)}
            </span>
            {appointment.veterinarian && (
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" />
                Dr. {appointment.veterinarian}
              </span>
            )}
            {appointment.clinic && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {appointment.clinic}
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

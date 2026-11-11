"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { Reminder } from "@/types";

type Permission = "default" | "granted" | "denied";

export function useNotifications(reminders: Reminder[]) {
  const [permission, setPermission] = useState<Permission>("default");
  const notifiedIds = useRef<Set<string>>(new Set());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission as Permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!("Notification" in window)) return;
    const result = await Notification.requestPermission();
    setPermission(result as Permission);
  }, []);

  const sendNotification = useCallback((reminder: Reminder) => {
    if (permission !== "granted") return;
    if (notifiedIds.current.has(reminder.id)) return;
    notifiedIds.current.add(reminder.id);

    const typeLabels: Record<string, string> = {
      vaccination: "Vaccination",
      appointment: "Rendez-vous",
      medication: "Medicament",
      grooming: "Toilettage",
      feeding: "Alimentation",
      other: "Rappel",
    };

    new Notification(`🐾 ${reminder.title}`, {
      body: reminder.description || `${typeLabels[reminder.type] || "Rappel"} - ${reminder.animalName || ""}`,
      icon: "/icons/icon-192x192.png",
      tag: reminder.id,
    });
  }, [permission]);

  useEffect(() => {
    if (permission !== "granted") return;
    if (reminders.length === 0) return;

    const checkDueReminders = () => {
      const now = new Date();
      reminders
        .filter((r) => r.isActive)
        .forEach((r) => {
          const reminderDate = r.date && r.time
            ? new Date(`${r.date}T${r.time}`)
            : r.date
              ? new Date(r.date)
              : null;
          if (!reminderDate) return;
          if (reminderDate <= now) {
            sendNotification(r);
          }
        });
    };

    checkDueReminders();
    intervalRef.current = setInterval(checkDueReminders, 60_000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [reminders, permission, sendNotification]);

  return { permission, requestPermission };
}

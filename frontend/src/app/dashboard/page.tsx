"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useAnimals } from "@/hooks/useAnimals";
import { api } from "@/lib/api";
import type { Appointment, Reminder } from "@/types";
import { formatDate, formatTime, daysUntil } from "@/lib/utils";
import PageContainer from "@/components/layout/PageContainer";
import AnimalCard from "@/components/animals/AnimalCard";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { PawPrint, Calendar, Bell, AlertTriangle, Plus, ChevronRight, Syringe, Clock, Stethoscope } from "lucide-react";

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { animals, isLoading: animalsLoading } = useAnimals();
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      Promise.all([
        api.getAppointments().catch(() => [] as Appointment[]),
        api.getReminders().catch(() => [] as Reminder[]),
      ]).then(([appts, rems]) => {
        setAppointments(appts);
        setReminders(rems);
      }).finally(() => {
        setLoading(false);
      });
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [isAuthenticated, authLoading]);

  if (authLoading || animalsLoading || loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!isAuthenticated) return null;

  const upcomingAppointments = appointments
    .filter((a) => a.status === "scheduled" && daysUntil(a.date) >= 0)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const urgentReminders = reminders
    .filter((r) => r.isActive && daysUntil(r.date) >= 0 && daysUntil(r.date) <= 7)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <PageContainer>
      {/* Greeting */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-textColor dark:text-textColor-dark">
            Bonjour{user?.firstName ? `, Dr. ${user.firstName}` : user?.firstName ? `, ${user.firstName}` : ""} !
          </h1>
          {user?.role === "veterinarian" && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-accent/10 text-accent text-xs font-bold uppercase tracking-wide">
              <Stethoscope className="w-3.5 h-3.5" />
              Veterinaire
            </span>
          )}
        </div>
        {animals.length > 0 && user?.role !== "veterinarian" && (
          <p className="text-textColor-light dark:text-textColor-dark-light mt-1">
            Comment va {animals[0].name} aujourd&apos;hui ?
          </p>
        )}
        {user?.role === "veterinarian" && (
          <p className="text-textColor-light dark:text-textColor-dark-light mt-1">
            Bienvenue dans votre espace veterinaire.
          </p>
        )}
      </div>

      {/* Urgent Reminders */}
      {urgentReminders.length > 0 && (
        <Card className="mb-6 !border-warning/30 !bg-warning/5 dark:!bg-warning/10">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-warning/20 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-warning" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm text-textColor dark:text-textColor-dark">
                Rappels urgents ({urgentReminders.length})
              </h3>
              <div className="mt-2 space-y-2">
                {urgentReminders.slice(0, 3).map((r) => (
                  <div key={r.id} className="flex items-center gap-2 text-sm">
                    <Syringe className="w-3.5 h-3.5 text-warning flex-shrink-0" />
                    <span className="text-textColor dark:text-textColor-dark">{r.title}</span>
                    {r.animalName && (
                      <span className="text-xs text-primary font-medium">({r.animalName})</span>
                    )}
                    <span className="text-xs text-textColor-light dark:text-textColor-dark-light ml-auto">
                      {daysUntil(r.date) === 0 ? "Aujourd'hui" : `Dans ${daysUntil(r.date)}j`}
                    </span>
                  </div>
                ))}
              </div>
              <Link href="/reminders" className="inline-flex items-center gap-1 text-xs text-warning font-medium mt-3 hover:underline">
                Voir tous les rappels <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </Card>
      )}

      {/* Animals Carousel */}
      <div className="mb-8">
        <CardHeader>
          <CardTitle>Mes animaux</CardTitle>
          <Link href="/animals/new">
            <Button variant="ghost" size="sm">
              <Plus className="w-4 h-4 mr-1" /> Ajouter
            </Button>
          </Link>
        </CardHeader>

        {animals.length === 0 ? (
          <EmptyState
            icon={<PawPrint className="w-8 h-8" />}
            title="Aucun animal"
            description="Ajoutez votre premier animal de compagnie pour commencer."
            action={
              <Link href="/animals/new">
                <Button>Ajouter un animal</Button>
              </Link>
            }
          />
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory scrollbar-none">
            {animals.map((animal) => (
              <div key={animal.id} className="snap-start flex-shrink-0 w-44">
                <AnimalCard animal={animal} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Appointments */}
      <div className="mb-8">
        <CardHeader>
          <CardTitle>Prochains rendez-vous</CardTitle>
          <Link href="/appointments" className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
            Tout voir <ChevronRight className="w-4 h-4" />
          </Link>
        </CardHeader>

        {upcomingAppointments.length === 0 ? (
          <Card>
            <div className="flex items-center gap-3 text-sm text-textColor-light dark:text-textColor-dark-light">
              <Calendar className="w-5 h-5" />
              <span>Aucun rendez-vous a venir</span>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {upcomingAppointments.map((appt) => (
              <Card key={appt.id} hoverable>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-textColor dark:text-textColor-dark truncate">
                      {appt.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-textColor-light dark:text-textColor-dark-light mt-0.5">
                      <span>{formatDate(appt.date)}</span>
                      <Clock className="w-3 h-3" />
                      <span>{formatTime(appt.time)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-medium text-primary">
                      {daysUntil(appt.date) === 0 ? "Aujourd'hui" : `J-${daysUntil(appt.date)}`}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="text-center">
          <div className="text-2xl font-bold text-primary">{animals.length}</div>
          <div className="text-xs text-textColor-light dark:text-textColor-dark-light mt-1">Animaux</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-warning">
            {appointments.filter((a) => a.status === "scheduled").length}
          </div>
          <div className="text-xs text-textColor-light dark:text-textColor-dark-light mt-1">RDV planifies</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-danger">{urgentReminders.length}</div>
          <div className="text-xs text-textColor-light dark:text-textColor-dark-light mt-1">Rappels urgents</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-success">
            {reminders.filter((r) => r.isActive).length}
          </div>
          <div className="text-xs text-textColor-light dark:text-textColor-dark-light mt-1">Rappels actifs</div>
        </Card>
      </div>
    </PageContainer>
  );
}

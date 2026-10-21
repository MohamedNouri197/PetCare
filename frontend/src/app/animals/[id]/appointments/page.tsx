"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useAnimals } from "@/hooks/useAnimals";
import { api } from "@/lib/api";
import { mockGetAnimal, mockGetAppointments } from "@/lib/mock-store";
import type { Animal, Appointment } from "@/types";
import PageContainer from "@/components/layout/PageContainer";
import AppointmentCard from "@/components/appointments/AppointmentCard";
import AppointmentForm from "@/components/appointments/AppointmentForm";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { ArrowLeft, Plus, Calendar } from "lucide-react";
import Link from "next/link";

export default function AnimalAppointmentsPage() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { animals } = useAnimals();
  const router = useRouter();
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/login");
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated && id) {
      Promise.all([api.getAnimal(id), api.getAppointments(id)])
        .then(([a, appts]) => { setAnimal(a); setAppointments(appts); })
        .catch(() => {
          try { setAnimal(mockGetAnimal(id)); } catch { /* */ }
          try { setAppointments(mockGetAppointments().filter((a) => a.animalId === id)); } catch { /* */ }
        })
        .finally(() => setLoading(false));
    }
  }, [isAuthenticated, id]);

  const onSubmit = async (data: Record<string, unknown>) => {
    try {
      setSubmitting(true);
      const newAppt = await api.createAppointment({ ...data, animalId: id } as Partial<Appointment>);
      setAppointments((prev) => [newAppt, ...prev]);
      setShowModal(false);
    } catch {
      // silently handled
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) return <LoadingSpinner fullScreen />;
  if (!isAuthenticated) return null;

  return (
    <PageContainer
      title={`Rendez-vous${animal ? ` - ${animal.name}` : ""}`}
      action={
        <Button size="sm" onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4 mr-1" /> Ajouter
        </Button>
      }
    >
      <Link
        href={`/animals/${id}`}
        className="inline-flex items-center gap-2 text-sm text-textColor-light dark:text-textColor-dark-light hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Retour au profil
      </Link>

      {appointments.length === 0 ? (
        <EmptyState
          icon={<Calendar className="w-8 h-8" />}
          title="Aucun rendez-vous"
          description="Planifiez un rendez-vous pour votre animal."
          action={<Button onClick={() => setShowModal(true)}>Planifier un rendez-vous</Button>}
        />
      ) : (
        <div className="space-y-3">
          {appointments.map((appt) => (
            <AppointmentCard key={appt.id} appointment={appt} />
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Nouveau rendez-vous" size="lg">
        <AppointmentForm
          animals={animals}
          onSubmit={onSubmit}
          isLoading={submitting}
          fixedAnimalId={id}
        />
      </Modal>
    </PageContainer>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import type { Animal, Vaccination } from "@/types";
import PageContainer from "@/components/layout/PageContainer";
import VaccinationCard from "@/components/medical/VaccinationCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import { ArrowLeft, Plus, Syringe } from "lucide-react";
import Link from "next/link";

const vaccinationSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  date: z.string().min(1, "La date est requise"),
  nextDueDate: z.string().min(1, "La prochaine date est requise"),
  veterinarian: z.string().min(1, "Le veterinaire est requis"),
  batchNumber: z.string().optional(),
  notes: z.string().optional(),
});

type VaccinationFormData = z.infer<typeof vaccinationSchema>;

export default function VaccinationsPage() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<VaccinationFormData>({
    resolver: zodResolver(vaccinationSchema),
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/login");
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated && id) {
      Promise.all([api.getAnimal(id), api.getVaccinations(id)])
        .then(([a, v]) => { setAnimal(a); setVaccinations(v); })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [isAuthenticated, id]);

  const onSubmit = async (data: VaccinationFormData) => {
    try {
      setSubmitting(true);
      const newVacc = await api.createVaccination(id, data);
      setVaccinations((prev) => [newVacc, ...prev]);
      setShowModal(false);
      reset();
    } catch {
      // silently handled
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) return <LoadingSpinner fullScreen />;
  if (!isAuthenticated) return null;

  const upToDate = vaccinations.filter((v) => v.status === "up_to_date");
  const dueSoon = vaccinations.filter((v) => v.status === "due_soon");
  const overdue = vaccinations.filter((v) => v.status === "overdue");

  return (
    <PageContainer
      title={`Vaccinations${animal ? ` - ${animal.name}` : ""}`}
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

      {/* Stats */}
      {vaccinations.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-success/10 rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-success">{upToDate.length}</div>
            <div className="text-xs text-success">A jour</div>
          </div>
          <div className="bg-warning/10 rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-warning">{dueSoon.length}</div>
            <div className="text-xs text-warning">Bientot</div>
          </div>
          <div className="bg-danger/10 rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-danger">{overdue.length}</div>
            <div className="text-xs text-danger">En retard</div>
          </div>
        </div>
      )}

      {vaccinations.length === 0 ? (
        <EmptyState
          icon={<Syringe className="w-8 h-8" />}
          title="Aucune vaccination"
          description="Ajoutez la premiere vaccination de votre animal."
          action={<Button onClick={() => setShowModal(true)}>Ajouter une vaccination</Button>}
        />
      ) : (
        <div className="space-y-3">
          {overdue.map((v) => <VaccinationCard key={v.id} vaccination={v} />)}
          {dueSoon.map((v) => <VaccinationCard key={v.id} vaccination={v} />)}
          {upToDate.map((v) => <VaccinationCard key={v.id} vaccination={v} />)}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Nouvelle vaccination">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Nom du vaccin" placeholder="Ex: Rage" error={errors.name?.message} {...register("name")} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Date d'administration" type="date" error={errors.date?.message} {...register("date")} />
            <Input label="Prochain rappel" type="date" error={errors.nextDueDate?.message} {...register("nextDueDate")} />
          </div>
          <Input label="Veterinaire" placeholder="Nom du veterinaire" error={errors.veterinarian?.message} {...register("veterinarian")} />
          <Input label="Numero de lot (optionnel)" placeholder="Ex: AB1234" {...register("batchNumber")} />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-textColor dark:text-textColor-dark">Notes (optionnel)</label>
            <textarea
              className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-surface dark:bg-surface-dark px-4 py-2.5 text-sm text-textColor dark:text-textColor-dark focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 min-h-[60px] resize-y"
              {...register("notes")}
            />
          </div>
          <Button type="submit" fullWidth isLoading={submitting}>Enregistrer</Button>
        </form>
      </Modal>
    </PageContainer>
  );
}

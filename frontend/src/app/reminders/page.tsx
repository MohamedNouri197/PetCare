"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { useAnimals } from "@/hooks/useAnimals";
import { api } from "@/lib/api";
import type { Reminder } from "@/types";
import PageContainer from "@/components/layout/PageContainer";
import ReminderCard from "@/components/reminders/ReminderCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { Plus, Bell } from "lucide-react";

const reminderSchema = z.object({
  animalId: z.string().optional(),
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().optional(),
  type: z.enum(["vaccination", "appointment", "medication", "grooming", "feeding", "other"]),
  date: z.string().min(1, "La date est requise"),
  time: z.string().optional(),
  recurrence: z.enum(["none", "daily", "weekly", "monthly", "yearly"]),
});

type ReminderFormData = z.infer<typeof reminderSchema>;

export default function RemindersPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { animals } = useAnimals();
  const router = useRouter();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ReminderFormData>({
    resolver: zodResolver(reminderSchema),
    defaultValues: { type: "other", recurrence: "none" },
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/login");
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      api
        .getReminders()
        .then(setReminders)
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [isAuthenticated]);

  const onSubmit = async (data: ReminderFormData) => {
    try {
      setSubmitting(true);
      const newReminder = await api.createReminder({ ...data, isActive: true });
      setReminders((prev) => [newReminder, ...prev]);
      setShowModal(false);
      reset();
    } catch {
      // silently handled
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (id: string, isActive: boolean) => {
    try {
      await api.updateReminder(id, { isActive });
      setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, isActive } : r)));
    } catch {
      // silently handled
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Supprimer ce rappel ?")) return;
    try {
      await api.deleteReminder(id);
      setReminders((prev) => prev.filter((r) => r.id !== id));
    } catch {
      // silently handled
    }
  };

  if (authLoading || loading) return <LoadingSpinner fullScreen />;
  if (!isAuthenticated) return null;

  const activeReminders = reminders.filter((r) => r.isActive);
  const inactiveReminders = reminders.filter((r) => !r.isActive);

  return (
    <PageContainer
      title="Rappels"
      subtitle={`${activeReminders.length} rappel${activeReminders.length !== 1 ? "s" : ""} actif${activeReminders.length !== 1 ? "s" : ""}`}
      action={
        <Button size="sm" onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4 mr-1" /> Nouveau
        </Button>
      }
    >
      {reminders.length === 0 ? (
        <EmptyState
          icon={<Bell className="w-8 h-8" />}
          title="Aucun rappel"
          description="Creez des rappels pour ne jamais oublier les soins de vos animaux."
          action={<Button onClick={() => setShowModal(true)}>Creer un rappel</Button>}
        />
      ) : (
        <div className="space-y-8">
          {activeReminders.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-textColor dark:text-textColor-dark mb-3">Actifs</h3>
              <div className="space-y-3">
                {activeReminders.map((r) => (
                  <ReminderCard key={r.id} reminder={r} onToggle={handleToggle} onDelete={handleDelete} />
                ))}
              </div>
            </div>
          )}

          {inactiveReminders.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-textColor-light dark:text-textColor-dark-light mb-3">
                Desactives
              </h3>
              <div className="space-y-3">
                {inactiveReminders.map((r) => (
                  <ReminderCard key={r.id} reminder={r} onToggle={handleToggle} onDelete={handleDelete} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Nouveau rappel">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Titre" placeholder="Ex: Rappel vaccination" error={errors.title?.message} {...register("title")} />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-textColor dark:text-textColor-dark">Description (optionnel)</label>
            <textarea
              className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-surface dark:bg-surface-dark px-4 py-2.5 text-sm text-textColor dark:text-textColor-dark focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 min-h-[60px] resize-y"
              {...register("description")}
            />
          </div>
          <Select
            label="Animal (optionnel)"
            placeholder="Choisir un animal"
            options={[
              { value: "", label: "Aucun (general)" },
              ...animals.map((a) => ({ value: a.id, label: a.name })),
            ]}
            {...register("animalId")}
          />
          <Select
            label="Type"
            error={errors.type?.message}
            options={[
              { value: "vaccination", label: "Vaccination" },
              { value: "appointment", label: "Rendez-vous" },
              { value: "medication", label: "Medicament" },
              { value: "grooming", label: "Toilettage" },
              { value: "feeding", label: "Alimentation" },
              { value: "other", label: "Autre" },
            ]}
            {...register("type")}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Date" type="date" error={errors.date?.message} {...register("date")} />
            <Input label="Heure (optionnel)" type="time" {...register("time")} />
          </div>
          <Select
            label="Recurrence"
            error={errors.recurrence?.message}
            options={[
              { value: "none", label: "Aucune" },
              { value: "daily", label: "Quotidien" },
              { value: "weekly", label: "Hebdomadaire" },
              { value: "monthly", label: "Mensuel" },
              { value: "yearly", label: "Annuel" },
            ]}
            {...register("recurrence")}
          />
          <Button type="submit" fullWidth isLoading={submitting}>Creer le rappel</Button>
        </form>
      </Modal>
    </PageContainer>
  );
}

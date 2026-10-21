"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import type { Animal, WeightEntry } from "@/types";
import PageContainer from "@/components/layout/PageContainer";
import WeightChart from "@/components/medical/WeightChart";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Card from "@/components/ui/Card";
import { ArrowLeft, Plus, Weight, TrendingUp, TrendingDown } from "lucide-react";
import { formatDate, formatWeight } from "@/lib/utils";
import Link from "next/link";

const weightSchema = z.object({
  weight: z.coerce.number().positive("Le poids doit etre positif"),
  unit: z.enum(["kg", "lbs"]),
  date: z.string().min(1, "La date est requise"),
  notes: z.string().optional(),
});

type WeightFormData = z.infer<typeof weightSchema>;

export default function WeightPage() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [entries, setEntries] = useState<WeightEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<WeightFormData>({
    resolver: zodResolver(weightSchema),
    defaultValues: { unit: "kg" },
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/login");
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated && id) {
      Promise.all([api.getAnimal(id), api.getWeightEntries(id)])
        .then(([a, w]) => { setAnimal(a); setEntries(w); })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [isAuthenticated, id]);

  const onSubmit = async (data: WeightFormData) => {
    try {
      setSubmitting(true);
      const newEntry = await api.createWeightEntry(id, data);
      setEntries((prev) => [...prev, newEntry]);
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

  const sorted = [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const latestWeight = sorted.length > 0 ? sorted[sorted.length - 1] : null;
  const previousWeight = sorted.length > 1 ? sorted[sorted.length - 2] : null;
  const weightDiff = latestWeight && previousWeight ? latestWeight.weight - previousWeight.weight : 0;

  return (
    <PageContainer
      title={`Suivi du poids${animal ? ` - ${animal.name}` : ""}`}
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

      {/* Current weight summary */}
      {latestWeight && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="text-center">
            <div className="text-2xl font-bold text-primary">{formatWeight(latestWeight.weight, latestWeight.unit)}</div>
            <div className="text-xs text-textColor-light dark:text-textColor-dark-light mt-1">Poids actuel</div>
          </Card>
          <Card className="text-center">
            <div className="flex items-center justify-center gap-1">
              {weightDiff > 0 ? (
                <TrendingUp className="w-5 h-5 text-warning" />
              ) : weightDiff < 0 ? (
                <TrendingDown className="w-5 h-5 text-success" />
              ) : null}
              <span className={`text-2xl font-bold ${weightDiff > 0 ? "text-warning" : weightDiff < 0 ? "text-success" : "text-textColor-light"}`}>
                {weightDiff > 0 ? "+" : ""}{weightDiff.toFixed(1)} kg
              </span>
            </div>
            <div className="text-xs text-textColor-light dark:text-textColor-dark-light mt-1">Variation</div>
          </Card>
        </div>
      )}

      {entries.length === 0 ? (
        <EmptyState
          icon={<Weight className="w-8 h-8" />}
          title="Aucune mesure"
          description="Commencez a suivre le poids de votre animal."
          action={<Button onClick={() => setShowModal(true)}>Ajouter une mesure</Button>}
        />
      ) : (
        <>
          <WeightChart entries={entries} />

          <h3 className="text-sm font-semibold text-textColor dark:text-textColor-dark mt-8 mb-4">Historique</h3>
          <div className="space-y-2">
            {sorted.reverse().map((entry) => (
              <Card key={entry.id}>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-sm text-textColor dark:text-textColor-dark">
                      {formatWeight(entry.weight, entry.unit)}
                    </span>
                    {entry.notes && (
                      <p className="text-xs text-textColor-light dark:text-textColor-dark-light mt-0.5">{entry.notes}</p>
                    )}
                  </div>
                  <span className="text-xs text-textColor-light dark:text-textColor-dark-light">{formatDate(entry.date)}</span>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Ajouter une mesure de poids">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Poids" type="number" step="0.1" placeholder="Ex: 12.5" error={errors.weight?.message} {...register("weight")} />
            <Select
              label="Unite"
              error={errors.unit?.message}
              options={[
                { value: "kg", label: "Kilogrammes (kg)" },
                { value: "lbs", label: "Livres (lbs)" },
              ]}
              {...register("unit")}
            />
          </div>
          <Input label="Date" type="date" error={errors.date?.message} {...register("date")} />
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

"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { mockGetAnimal, mockGetMeals, mockCreateMeal, mockDeleteMeal } from "@/lib/mock-store";
import type { Animal, Meal } from "@/types";
import PageContainer from "@/components/layout/PageContainer";
import MealSchedule from "@/components/nutrition/MealSchedule";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { ArrowLeft, Plus, UtensilsCrossed } from "lucide-react";
import Link from "next/link";

const mealSchema = z.object({
  type: z.enum(["breakfast", "lunch", "dinner", "snack"]),
  foodName: z.string().min(1, "Le nom de l'aliment est requis"),
  quantity: z.string().min(1, "La quantite est requise"),
  unit: z.string().min(1, "L'unite est requise"),
  time: z.string().min(1, "L'heure est requise"),
  notes: z.string().optional(),
});

type MealFormData = z.infer<typeof mealSchema>;

export default function NutritionPage() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<MealFormData>({
    resolver: zodResolver(mealSchema),
    defaultValues: { type: "breakfast", unit: "g" },
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/login");
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated && id) {
      Promise.all([api.getAnimal(id), api.getMeals(id)])
        .then(([a, m]) => { setAnimal(a); setMeals(m); })
        .catch(() => {
          try { setAnimal(mockGetAnimal(id)); } catch { /* */ }
          try { setMeals(mockGetMeals(id)); } catch { /* */ }
        })
        .finally(() => setLoading(false));
    }
  }, [isAuthenticated, id]);

  const onSubmit = async (data: MealFormData) => {
    try {
      setSubmitting(true);
      let newMeal: Meal;
      try {
        newMeal = await api.createMeal(id, data);
      } catch {
        newMeal = mockCreateMeal(id, data);
      }
      setMeals((prev) => [...prev, newMeal]);
      setShowModal(false);
      reset();
    } catch {
      // silently handled
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (mealId: string) => {
    try {
      await api.deleteMeal(id, mealId);
    } catch {
      mockDeleteMeal(id, mealId);
    }
    setMeals((prev) => prev.filter((m) => m.id !== mealId));
  };

  if (authLoading || loading) return <LoadingSpinner fullScreen />;
  if (!isAuthenticated) return null;

  return (
    <PageContainer
      title={`Nutrition${animal ? ` - ${animal.name}` : ""}`}
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

      {meals.length === 0 ? (
        <EmptyState
          icon={<UtensilsCrossed className="w-8 h-8" />}
          title="Aucun repas"
          description="Ajoutez le planning nutritionnel de votre animal."
          action={<Button onClick={() => setShowModal(true)}>Ajouter un repas</Button>}
        />
      ) : (
        <MealSchedule meals={meals} onDelete={handleDelete} />
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Ajouter un repas">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Select
            label="Type de repas"
            error={errors.type?.message}
            options={[
              { value: "breakfast", label: "Petit-dejeuner" },
              { value: "lunch", label: "Dejeuner" },
              { value: "dinner", label: "Diner" },
              { value: "snack", label: "Gouter" },
            ]}
            {...register("type")}
          />
          <Input label="Aliment" placeholder="Ex: Croquettes premium" error={errors.foodName?.message} {...register("foodName")} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Quantite" placeholder="Ex: 200" error={errors.quantity?.message} {...register("quantity")} />
            <Select
              label="Unite"
              error={errors.unit?.message}
              options={[
                { value: "g", label: "Grammes (g)" },
                { value: "ml", label: "Millilitres (ml)" },
                { value: "cup", label: "Tasse" },
                { value: "piece", label: "Piece" },
              ]}
              {...register("unit")}
            />
          </div>
          <Input label="Heure" type="time" error={errors.time?.message} {...register("time")} />
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

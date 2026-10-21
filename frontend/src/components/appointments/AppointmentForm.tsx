"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import type { Animal } from "@/types";

const appointmentSchema = z.object({
  animalId: z.string().min(1, "Veuillez selectionner un animal"),
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().optional(),
  veterinarian: z.string().min(1, "Le veterinaire est requis"),
  clinic: z.string().min(1, "La clinique est requise"),
  date: z.string().min(1, "La date est requise"),
  time: z.string().min(1, "L'heure est requise"),
  status: z.enum(["scheduled", "completed", "cancelled"]),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

interface AppointmentFormProps {
  animals: Animal[];
  onSubmit: (data: AppointmentFormData) => Promise<void>;
  isLoading?: boolean;
  defaultValues?: Partial<AppointmentFormData>;
  fixedAnimalId?: string;
}

export default function AppointmentForm({
  animals,
  onSubmit,
  isLoading = false,
  defaultValues,
  fixedAnimalId,
}: AppointmentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      status: "scheduled",
      animalId: fixedAnimalId,
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {!fixedAnimalId && (
        <Select
          label="Animal"
          placeholder="Choisir un animal"
          error={errors.animalId?.message}
          options={animals.map((a) => ({ value: a.id, label: a.name }))}
          {...register("animalId")}
        />
      )}

      <Input label="Titre" placeholder="Ex: Visite annuelle" error={errors.title?.message} {...register("title")} />

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-textColor dark:text-textColor-dark">
          Description (optionnel)
        </label>
        <textarea
          className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-surface dark:bg-surface-dark px-4 py-2.5 text-sm text-textColor dark:text-textColor-dark focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 min-h-[60px] resize-y"
          placeholder="Details du rendez-vous..."
          {...register("description")}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Veterinaire"
          placeholder="Nom du veterinaire"
          error={errors.veterinarian?.message}
          {...register("veterinarian")}
        />
        <Input label="Clinique" placeholder="Nom de la clinique" error={errors.clinic?.message} {...register("clinic")} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Date" type="date" error={errors.date?.message} {...register("date")} />
        <Input label="Heure" type="time" error={errors.time?.message} {...register("time")} />
      </div>

      <Select
        label="Statut"
        error={errors.status?.message}
        options={[
          { value: "scheduled", label: "Planifie" },
          { value: "completed", label: "Termine" },
          { value: "cancelled", label: "Annule" },
        ]}
        {...register("status")}
      />

      <Button type="submit" fullWidth isLoading={isLoading}>
        Enregistrer
      </Button>
    </form>
  );
}

"use client";

import React, { useState, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { Camera, X, ImageIcon } from "lucide-react";

const animalSchema = z.object({
  name: z.string().min(1, "Le nom est requis").max(50, "50 caracteres maximum"),
  species: z.enum(["dog", "cat", "bird", "rabbit", "hamster", "fish", "reptile", "other"], {
    required_error: "L'espece est requise",
  }),
  breed: z.string().min(1, "La race est requise"),
  birthDate: z.string().min(1, "La date de naissance est requise"),
  gender: z.enum(["male", "female"], { required_error: "Le genre est requis" }),
  color: z.string().min(1, "La couleur est requise"),
  weight: z.coerce.number().positive("Le poids doit etre positif"),
  microchipNumber: z.string().optional(),
  notes: z.string().optional(),
});

type AnimalFormData = z.infer<typeof animalSchema>;

interface AnimalFormProps {
  onSubmit: (data: AnimalFormData & { photoUrl?: string }) => Promise<void>;
  isLoading?: boolean;
  defaultValues?: Partial<AnimalFormData> & { photoUrl?: string };
}

export default function AnimalForm({ onSubmit, isLoading = false, defaultValues }: AnimalFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AnimalFormData>({
    resolver: zodResolver(animalSchema),
    defaultValues,
  });

  const [photoPreview, setPhotoPreview] = useState<string | null>(defaultValues?.photoUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("L'image ne doit pas depasser 2 Mo");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const removePhoto = useCallback(() => {
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const handleFormSubmit = (data: AnimalFormData) => {
    return onSubmit({ ...data, photoUrl: photoPreview || undefined });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Photo Upload */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-textColor dark:text-textColor-dark">
          Photo (optionnel)
        </label>
        <div className="flex items-center gap-4">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative w-24 h-24 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-600 hover:border-primary dark:hover:border-primary flex items-center justify-center cursor-pointer overflow-hidden transition-colors group"
          >
            {photoPreview ? (
              <>
                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-1 text-textColor-light dark:text-textColor-dark-light group-hover:text-primary transition-colors">
                <ImageIcon className="w-8 h-8" />
                <span className="text-[10px] font-medium">Ajouter</span>
              </div>
            )}
          </div>
          {photoPreview && (
            <button
              type="button"
              onClick={removePhoto}
              className="flex items-center gap-1.5 text-xs text-danger hover:text-danger/80 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Supprimer
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
      </div>

      <Input label="Nom" placeholder="Ex: Luna" error={errors.name?.message} {...register("name")} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Espece"
          placeholder="Choisir une espece"
          error={errors.species?.message}
          options={[
            { value: "dog", label: "Chien" },
            { value: "cat", label: "Chat" },
            { value: "bird", label: "Oiseau" },
            { value: "rabbit", label: "Lapin" },
            { value: "hamster", label: "Hamster" },
            { value: "fish", label: "Poisson" },
            { value: "reptile", label: "Reptile" },
            { value: "other", label: "Autre" },
          ]}
          {...register("species")}
        />
        <Input label="Race" placeholder="Ex: Labrador" error={errors.breed?.message} {...register("breed")} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Date de naissance"
          type="date"
          error={errors.birthDate?.message}
          {...register("birthDate")}
        />
        <Select
          label="Genre"
          placeholder="Choisir le genre"
          error={errors.gender?.message}
          options={[
            { value: "male", label: "Male" },
            { value: "female", label: "Femelle" },
          ]}
          {...register("gender")}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Couleur" placeholder="Ex: Noir et blanc" error={errors.color?.message} {...register("color")} />
        <Input
          label="Poids (kg)"
          type="number"
          step="0.1"
          placeholder="Ex: 12.5"
          error={errors.weight?.message}
          {...register("weight")}
        />
      </div>

      <Input
        label="Numero de puce (optionnel)"
        placeholder="Ex: 250269..."
        error={errors.microchipNumber?.message}
        {...register("microchipNumber")}
      />

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-textColor dark:text-textColor-dark">
          Notes (optionnel)
        </label>
        <textarea
          className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-surface dark:bg-surface-dark px-4 py-2.5 text-sm text-textColor dark:text-textColor-dark placeholder:text-textColor-light focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 min-h-[80px] resize-y"
          placeholder="Informations supplementaires..."
          {...register("notes")}
        />
      </div>

      <Button type="submit" fullWidth isLoading={isLoading}>
        Enregistrer
      </Button>
    </form>
  );
}

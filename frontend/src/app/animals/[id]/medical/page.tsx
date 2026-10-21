"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import type { Animal, MedicalRecord } from "@/types";
import PageContainer from "@/components/layout/PageContainer";
import MedicalRecordCard from "@/components/medical/MedicalRecordCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { ArrowLeft, Plus, Stethoscope } from "lucide-react";
import Link from "next/link";

const medicalSchema = z.object({
  type: z.enum(["consultation", "surgery", "exam", "treatment", "emergency"]),
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().min(1, "La description est requise"),
  veterinarian: z.string().min(1, "Le veterinaire est requis"),
  clinic: z.string().optional().default(""),
  date: z.string().min(1, "La date est requise"),
  notes: z.string().optional(),
});

type MedicalFormData = z.infer<typeof medicalSchema>;

export default function MedicalPage() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<MedicalFormData>({
    resolver: zodResolver(medicalSchema),
    defaultValues: { type: "consultation" },
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/login");
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated && id) {
      Promise.all([api.getAnimal(id), api.getMedicalRecords(id)])
        .then(([a, r]) => { setAnimal(a); setRecords(r); })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [isAuthenticated, id]);

  const onSubmit = async (data: MedicalFormData) => {
    try {
      setSubmitting(true);
      const newRecord = await api.createMedicalRecord(id, data);
      setRecords((prev) => [newRecord, ...prev]);
      setShowModal(false);
      reset();
    } catch {
      // error handled silently
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) return <LoadingSpinner fullScreen />;
  if (!isAuthenticated) return null;

  return (
    <PageContainer
      title={`Dossier medical${animal ? ` - ${animal.name}` : ""}`}
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

      {records.length === 0 ? (
        <EmptyState
          icon={<Stethoscope className="w-8 h-8" />}
          title="Aucun dossier medical"
          description="Ajoutez le premier enregistrement medical de votre animal."
          action={<Button onClick={() => setShowModal(true)}>Ajouter un dossier</Button>}
        />
      ) : (
        <div className="space-y-3">
          {records.map((record) => (
            <MedicalRecordCard key={record.id} record={record} />
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Nouveau dossier medical">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Select
            label="Type"
            error={errors.type?.message}
            options={[
              { value: "consultation", label: "Consultation" },
              { value: "surgery", label: "Chirurgie" },
              { value: "exam", label: "Examen" },
              { value: "treatment", label: "Traitement" },
              { value: "emergency", label: "Urgence" },
            ]}
            {...register("type")}
          />
          <Input label="Titre" placeholder="Ex: Visite de controle" error={errors.title?.message} {...register("title")} />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-textColor dark:text-textColor-dark">Description</label>
            <textarea
              className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-surface dark:bg-surface-dark px-4 py-2.5 text-sm text-textColor dark:text-textColor-dark focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 min-h-[80px] resize-y"
              placeholder="Details de la consultation..."
              {...register("description")}
            />
            {errors.description && <p className="text-xs text-danger">{errors.description.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Veterinaire" placeholder="Nom" error={errors.veterinarian?.message} {...register("veterinarian")} />
            <Input label="Clinique" placeholder="Nom de la clinique" {...register("clinic")} />
          </div>
          <Input label="Date" type="date" error={errors.date?.message} {...register("date")} />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-textColor dark:text-textColor-dark">Notes (optionnel)</label>
            <textarea
              className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-surface dark:bg-surface-dark px-4 py-2.5 text-sm text-textColor dark:text-textColor-dark focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 min-h-[60px] resize-y"
              placeholder="Notes supplementaires..."
              {...register("notes")}
            />
          </div>
          <Button type="submit" fullWidth isLoading={submitting}>Enregistrer</Button>
        </form>
      </Modal>
    </PageContainer>
  );
}

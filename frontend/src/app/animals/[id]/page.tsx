"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { mockGetAnimal, mockUpdateAnimal, mockDeleteAnimal, mockGetMedicalRecords, mockGetVaccinations, mockGetWeightEntries } from "@/lib/mock-store";
import type { Animal, MedicalRecord, Vaccination, WeightEntry } from "@/types";
import { exportAnimalPDF } from "@/lib/pdf-export";
import QRCodeCard from "@/components/animals/QRCodeCard";
import { getSpeciesLabel, calculateAge, formatWeight } from "@/lib/utils";
import PageContainer from "@/components/layout/PageContainer";
import AnimalForm from "@/components/animals/AnimalForm";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  ArrowLeft,
  Trash2,
  Edit3,
  Stethoscope,
  Syringe,
  Utensils,
  Scale,
  Calendar,
  PawPrint,
  ChevronRight,
  FileText,
  QrCode,
} from "lucide-react";
import Link from "next/link";

export default function AnimalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/login");
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated && id) {
      api
        .getAnimal(id)
        .then(setAnimal)
        .catch(() => {
          try {
            const local = mockGetAnimal(id);
            setAnimal(local);
          } catch {
            setError("Animal introuvable");
          }
        })
        .finally(() => setLoading(false));
    }
  }, [isAuthenticated, id]);

  const handleDelete = async () => {
    if (!animal) return;
    if (!window.confirm(`Supprimer ${animal.name} ? Cette action est irreversible.`)) return;
    try {
      await api.deleteAnimal(animal.id);
    } catch {
      mockDeleteAnimal(animal.id);
    }
    router.push("/animals");
  };

  const handleEdit = async (data: Record<string, unknown>) => {
    if (!animal) return;
    try {
      setEditLoading(true);
      let updated: Animal;
      try {
        updated = await api.updateAnimal(animal.id, data);
      } catch {
        updated = mockUpdateAnimal(animal.id, data as Partial<Animal>);
      }
      setAnimal(updated);
      setShowEditModal(false);
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "message" in err
          ? (err as { message: string }).message
          : "Erreur lors de la modification";
      setError(message);
    } finally {
      setEditLoading(false);
    }
  };

  const handleExportPDF = async () => {
    if (!animal) return;
    setPdfLoading(true);
    try {
      let medicalRecords: MedicalRecord[] = [];
      let vaccinations: Vaccination[] = [];
      let weightEntries: WeightEntry[] = [];
      try {
        medicalRecords = await api.getMedicalRecords(animal.id);
      } catch {
        medicalRecords = mockGetMedicalRecords(animal.id);
      }
      try {
        vaccinations = await api.getVaccinations(animal.id);
      } catch {
        vaccinations = mockGetVaccinations(animal.id);
      }
      try {
        weightEntries = await api.getWeightEntries(animal.id);
      } catch {
        weightEntries = mockGetWeightEntries(animal.id);
      }
      exportAnimalPDF(animal, medicalRecords, vaccinations, weightEntries);
    } catch {
      // Fallback: export with whatever data we have
      exportAnimalPDF(animal, [], [], []);
    } finally {
      setPdfLoading(false);
    }
  };

  if (authLoading || loading) return <LoadingSpinner fullScreen />;
  if (!isAuthenticated) return null;

  if (error || !animal) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <p className="text-danger mb-4">{error || "Animal introuvable"}</p>
          <Link href="/animals">
            <Button variant="outline">Retour aux animaux</Button>
          </Link>
        </div>
      </PageContainer>
    );
  }

  const navLinks = [
    { href: `/animals/${id}/medical`, icon: Stethoscope, label: "Dossier medical", color: "text-primary" },
    { href: `/animals/${id}/vaccinations`, icon: Syringe, label: "Vaccinations", color: "text-success" },
    { href: `/animals/${id}/nutrition`, icon: Utensils, label: "Alimentation", color: "text-warning" },
    { href: `/animals/${id}/weight`, icon: Scale, label: "Suivi du poids", color: "text-accent" },
    { href: `/animals/${id}/appointments`, icon: Calendar, label: "Rendez-vous", color: "text-secondary" },
  ];

  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/animals"
          className="inline-flex items-center gap-2 text-sm text-textColor-light dark:text-textColor-dark-light hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Retour
        </Link>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExportPDF} isLoading={pdfLoading}>
            <FileText className="w-4 h-4 mr-1" /> Exporter PDF
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowQRModal(true)}>
            <QrCode className="w-4 h-4 mr-1" /> Carte QR
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowEditModal(true)}>
            <Edit3 className="w-4 h-4 mr-1" /> Modifier
          </Button>
          <Button variant="danger" size="sm" onClick={handleDelete}>
            <Trash2 className="w-4 h-4 mr-1" /> Supprimer
          </Button>
        </div>
      </div>

      {/* Animal Header */}
      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {animal.photoUrl ? (
              <img src={animal.photoUrl} alt={animal.name} className="w-full h-full object-cover" />
            ) : (
              <PawPrint className="w-12 h-12 text-primary" />
            )}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-bold text-textColor dark:text-textColor-dark">{animal.name}</h1>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
              <Badge variant="primary">{getSpeciesLabel(animal.species)}</Badge>
              {animal.breed && <Badge variant="default">{animal.breed}</Badge>}
              <Badge variant={animal.gender === "male" ? "primary" : "accent"}>
                {animal.gender === "male" ? "Male" : "Femelle"}
              </Badge>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
              {animal.birthDate && (
                <div>
                  <p className="text-xs text-textColor-light dark:text-textColor-dark-light">Age</p>
                  <p className="text-sm font-semibold text-textColor dark:text-textColor-dark">
                    {calculateAge(animal.birthDate)}
                  </p>
                </div>
              )}
              {animal.weight > 0 && (
                <div>
                  <p className="text-xs text-textColor-light dark:text-textColor-dark-light">Poids</p>
                  <p className="text-sm font-semibold text-textColor dark:text-textColor-dark">
                    {formatWeight(animal.weight)}
                  </p>
                </div>
              )}
              {animal.color && (
                <div>
                  <p className="text-xs text-textColor-light dark:text-textColor-dark-light">Couleur</p>
                  <p className="text-sm font-semibold text-textColor dark:text-textColor-dark">{animal.color}</p>
                </div>
              )}
              {animal.microchipNumber && (
                <div>
                  <p className="text-xs text-textColor-light dark:text-textColor-dark-light">Puce</p>
                  <p className="text-sm font-semibold text-textColor dark:text-textColor-dark truncate">
                    {animal.microchipNumber}
                  </p>
                </div>
              )}
            </div>
            {animal.notes && (
              <p className="mt-3 text-sm text-textColor-light dark:text-textColor-dark-light italic">
                {animal.notes}
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Navigation Links */}
      <div className="space-y-2">
        {navLinks.map(({ href, icon: Icon, label, color }) => (
          <Link key={href} href={href}>
            <Card hoverable className="!py-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <span className="flex-1 text-sm font-medium text-textColor dark:text-textColor-dark">
                  {label}
                </span>
                <ChevronRight className="w-4 h-4 text-textColor-light dark:text-textColor-dark-light" />
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Edit Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title={`Modifier ${animal.name}`}>
        <AnimalForm
          onSubmit={handleEdit}
          isLoading={editLoading}
          defaultValues={{
            name: animal.name,
            species: animal.species,
            breed: animal.breed,
            birthDate: animal.birthDate,
            gender: animal.gender,
            color: animal.color,
            weight: animal.weight,
            microchipNumber: animal.microchipNumber,
            notes: animal.notes,
            photoUrl: animal.photoUrl,
          }}
        />
      </Modal>

      {/* QR Code Modal */}
      <Modal isOpen={showQRModal} onClose={() => setShowQRModal(false)} title={`Carte d'identite - ${animal.name}`}>
        <QRCodeCard animal={animal} ownerName={user ? `${user.firstName} ${user.lastName}` : "Proprietaire"} />
      </Modal>
    </PageContainer>
  );
}

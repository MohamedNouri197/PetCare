"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  mockGetVetProfile,
  mockSaveVetProfile,
  mockGetVetSlots,
  mockGenerateSlots,
  mockToggleSlot,
  mockDeleteSlot,
} from "@/lib/mock-store";
import { api } from "@/lib/api";
import type { VetProfile, VetSlot } from "@/types";
import { formatDate, cn } from "@/lib/utils";
import PageContainer from "@/components/layout/PageContainer";
import AppointmentCalendar from "@/components/appointments/AppointmentCalendar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  Calendar,
  Clock,
  Settings,
  Check,
  X,
  Stethoscope,
  Save,
  RefreshCw,
  Users,
  Lock,
  Unlock,
} from "lucide-react";

const DAYS_LABELS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

export default function VetSchedulePage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<VetProfile | null>(null);
  const [slots, setSlots] = useState<VetSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    specialty: "Generaliste",
    clinic: "",
    address: "",
    phone: "",
    slotDuration: 30,
    workStart: "09:00",
    workEnd: "18:00",
    availableDays: [1, 2, 3, 4, 5] as number[],
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/login");
    if (!authLoading && isAuthenticated && user?.role !== "veterinarian") router.push("/dashboard");
  }, [isAuthenticated, authLoading, user, router]);

  useEffect(() => {
    if (!isAuthenticated || !user) return;
    (async () => {
      try {
        const existing = await api.getVetProfile(user.id);
        if (existing) {
          setProfile(existing);
          setSlots(mockGetVetSlots(user.id));
          setProfileForm({
            name: existing.name,
            specialty: existing.specialty,
            clinic: existing.clinic,
            address: existing.address,
            phone: existing.phone,
            slotDuration: existing.slotDuration,
            workStart: existing.workStart,
            workEnd: existing.workEnd,
            availableDays: existing.availableDays,
          });
          setLoading(false);
          return;
        }
      } catch {
        const local = mockGetVetProfile(user.id);
        if (local) {
          setProfile(local);
          setSlots(mockGetVetSlots(user.id));
          setProfileForm({
            name: local.name, specialty: local.specialty, clinic: local.clinic,
            address: local.address, phone: local.phone, slotDuration: local.slotDuration,
            workStart: local.workStart, workEnd: local.workEnd, availableDays: local.availableDays,
          });
          setLoading(false);
          return;
        }
      }
      setProfileForm((prev) => ({
        ...prev,
        name: `${user.firstName} ${user.lastName}`,
      }));
      setShowSettings(true);
      setLoading(false);
    })();
  }, [isAuthenticated, user]);

  const handleSaveProfile = async () => {
    if (!user) return;
    try {
      const saved = await api.saveVetProfile({ ...profileForm, userId: user.id });
      setProfile(saved);
    } catch {
      const saved = mockSaveVetProfile(profileForm, user.id);
      setProfile(saved);
    }
    setShowSettings(false);
  };

  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
    if (profile) {
      mockGenerateSlots(profile, date);
      setSlots(mockGetVetSlots(profile.userId));
    }
  };

  const handleToggleSlot = (slotId: string) => {
    mockToggleSlot(slotId);
    if (profile) setSlots(mockGetVetSlots(profile.userId));
  };

  const handleRegenerateDay = () => {
    if (!selectedDate || !profile) return;
    const daySlots = slots.filter((s) => s.date === selectedDate);
    daySlots.forEach((s) => mockDeleteSlot(s.id));
    mockGenerateSlots(profile, selectedDate);
    setSlots(mockGetVetSlots(profile.userId));
  };

  const toggleDay = (day: number) => {
    setProfileForm((prev) => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter((d) => d !== day)
        : [...prev.availableDays, day].sort(),
    }));
  };

  const daySlots = useMemo(() => {
    if (!selectedDate) return [];
    return slots.filter((s) => s.date === selectedDate).sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [slots, selectedDate]);

  const bookedToday = daySlots.filter((s) => s.isBooked).length;

  if (authLoading || loading) return <LoadingSpinner fullScreen />;
  if (!isAuthenticated || user?.role !== "veterinarian") return null;

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-textColor dark:text-textColor-dark flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-accent" />
            Mon calendrier
          </h1>
          <p className="text-sm text-textColor-light dark:text-textColor-dark-light mt-0.5">
            Gerez vos disponibilites et consultations
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setShowSettings(true)}>
          <Settings className="w-4 h-4 mr-1" /> Parametres
        </Button>
      </div>

      {!profile ? (
        <Card className="text-center py-12">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-accent/10 flex items-center justify-center mb-4">
            <Settings className="w-8 h-8 text-accent" />
          </div>
          <h2 className="text-lg font-semibold text-textColor dark:text-textColor-dark mb-2">
            Configurez votre profil
          </h2>
          <p className="text-sm text-textColor-light dark:text-textColor-dark-light mb-4">
            Definissez vos horaires et informations pour que les proprietaires puissent prendre rendez-vous.
          </p>
          <Button onClick={() => setShowSettings(true)}>Configurer</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calendar */}
          <div>
            <AppointmentCalendar
              slots={slots}
              selectedDate={selectedDate}
              onSelectDate={handleSelectDate}
            />

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              <Card className="text-center !py-3">
                <div className="text-lg font-bold text-primary">{slots.length}</div>
                <div className="text-[10px] text-textColor-light dark:text-textColor-dark-light">Total creneaux</div>
              </Card>
              <Card className="text-center !py-3">
                <div className="text-lg font-bold text-success">
                  {slots.filter((s) => !s.isBooked).length}
                </div>
                <div className="text-[10px] text-textColor-light dark:text-textColor-dark-light">Disponibles</div>
              </Card>
              <Card className="text-center !py-3">
                <div className="text-lg font-bold text-warning">
                  {slots.filter((s) => s.isBooked).length}
                </div>
                <div className="text-[10px] text-textColor-light dark:text-textColor-dark-light">Reserves</div>
              </Card>
            </div>
          </div>

          {/* Day view */}
          <div>
            {selectedDate ? (
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-textColor dark:text-textColor-dark">
                      {formatDate(selectedDate)}
                    </h3>
                    <p className="text-xs text-textColor-light dark:text-textColor-dark-light">
                      {daySlots.length} creneaux - {bookedToday} reserve{bookedToday > 1 ? "s" : ""}
                    </p>
                  </div>
                  <button
                    onClick={handleRegenerateDay}
                    className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    title="Regenerer les creneaux"
                  >
                    <RefreshCw className="w-4 h-4 text-textColor-light dark:text-textColor-dark-light" />
                  </button>
                </div>

                {daySlots.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-textColor-light dark:text-textColor-dark-light">
                      Jour non ouvre ou aucun creneau genere
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                    {daySlots.map((slot) => (
                      <div
                        key={slot.id}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-xl border transition-all",
                          slot.isBooked
                            ? "bg-warning/5 border-warning/20"
                            : "bg-success/5 border-success/20 hover:border-success/40"
                        )}
                      >
                        <div
                          className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                            slot.isBooked ? "bg-warning/10" : "bg-success/10"
                          )}
                        >
                          {slot.isBooked ? (
                            <Lock className="w-4 h-4 text-warning" />
                          ) : (
                            <Unlock className="w-4 h-4 text-success" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-textColor dark:text-textColor-dark">
                            {slot.startTime} - {slot.endTime}
                          </p>
                          <p className="text-xs text-textColor-light dark:text-textColor-dark-light">
                            {slot.isBooked ? "Reserve" : "Disponible"}
                          </p>
                        </div>
                        <button
                          onClick={() => handleToggleSlot(slot.id)}
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                            slot.isBooked
                              ? "bg-success/10 text-success hover:bg-success/20"
                              : "bg-warning/10 text-warning hover:bg-warning/20"
                          )}
                        >
                          {slot.isBooked ? "Liberer" : "Bloquer"}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            ) : (
              <Card className="flex flex-col items-center justify-center py-16">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                  <Calendar className="w-7 h-7 text-textColor-light dark:text-textColor-dark-light" />
                </div>
                <p className="text-sm font-medium text-textColor dark:text-textColor-dark">
                  Selectionnez un jour
                </p>
                <p className="text-xs text-textColor-light dark:text-textColor-dark-light mt-1">
                  Cliquez sur une date pour voir et gerer vos creneaux
                </p>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Settings Modal */}
      <Modal isOpen={showSettings} onClose={() => setShowSettings(false)} title="Parametres du cabinet" size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nom complet"
              placeholder="Dr. Martin Dupont"
              value={profileForm.name}
              onChange={(e) => setProfileForm((prev) => ({ ...prev, name: e.target.value }))}
            />
            <Input
              label="Specialite"
              placeholder="Generaliste"
              value={profileForm.specialty}
              onChange={(e) => setProfileForm((prev) => ({ ...prev, specialty: e.target.value }))}
            />
          </div>

          <Input
            label="Clinique"
            placeholder="Clinique VetCare"
            value={profileForm.clinic}
            onChange={(e) => setProfileForm((prev) => ({ ...prev, clinic: e.target.value }))}
          />

          <Input
            label="Adresse"
            placeholder="12 rue des Animaux, Paris"
            value={profileForm.address}
            onChange={(e) => setProfileForm((prev) => ({ ...prev, address: e.target.value }))}
          />

          <Input
            label="Telephone"
            placeholder="01 23 45 67 89"
            value={profileForm.phone}
            onChange={(e) => setProfileForm((prev) => ({ ...prev, phone: e.target.value }))}
          />

          <div>
            <label className="block text-sm font-medium text-textColor dark:text-textColor-dark mb-2">
              Jours de consultation
            </label>
            <div className="flex gap-2">
              {DAYS_LABELS.map((label, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => toggleDay(idx)}
                  className={cn(
                    "flex-1 py-2 rounded-xl text-xs font-medium transition-all",
                    profileForm.availableDays.includes(idx)
                      ? "bg-primary text-white shadow-sm"
                      : "bg-gray-100 dark:bg-gray-800 text-textColor-light dark:text-textColor-dark-light hover:bg-gray-200"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Debut"
              type="time"
              value={profileForm.workStart}
              onChange={(e) => setProfileForm((prev) => ({ ...prev, workStart: e.target.value }))}
            />
            <Input
              label="Fin"
              type="time"
              value={profileForm.workEnd}
              onChange={(e) => setProfileForm((prev) => ({ ...prev, workEnd: e.target.value }))}
            />
            <Input
              label="Duree (min)"
              type="number"
              value={String(profileForm.slotDuration)}
              onChange={(e) =>
                setProfileForm((prev) => ({ ...prev, slotDuration: parseInt(e.target.value) || 30 }))
              }
            />
          </div>

          <Button fullWidth onClick={handleSaveProfile}>
            <Save className="w-4 h-4 mr-2" /> Enregistrer
          </Button>
        </div>
      </Modal>
    </PageContainer>
  );
}

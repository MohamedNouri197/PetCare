"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useAnimals } from "@/hooks/useAnimals";
import { api } from "@/lib/api";
import {
  mockGetAppointments,
  mockCreateAppointment,
  mockDeleteAppointment,
  mockGetVetProfiles,
  mockGetVetSlots,
  mockGenerateSlots,
  seedDemoVetProfile,
} from "@/lib/mock-store";
import type { Appointment, VetSlot, VetProfile } from "@/types";
import { formatDate, formatTime, getAppointmentStatusBadge, cn } from "@/lib/utils";
import PageContainer from "@/components/layout/PageContainer";
import AppointmentCalendar from "@/components/appointments/AppointmentCalendar";
import TimeSlotPicker from "@/components/appointments/TimeSlotPicker";
import AppointmentCard from "@/components/appointments/AppointmentCard";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";
import Badge from "@/components/ui/Badge";
import {
  Plus,
  Calendar,
  Clock,
  Stethoscope,
  MapPin,
  User,
  ChevronRight,
  Check,
  PawPrint,
  CalendarCheck,
  ClipboardList,
  ArrowRight,
} from "lucide-react";

type ViewMode = "book" | "list";

export default function AppointmentsPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { animals } = useAnimals();
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("book");
  const [filter, setFilter] = useState("all");

  // Booking state
  const [vetProfiles, setVetProfiles] = useState<VetProfile[]>([]);
  const [selectedVet, setSelectedVet] = useState<VetProfile | null>(null);
  const [allSlots, setAllSlots] = useState<VetSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<VetSlot | null>(null);
  const [bookingStep, setBookingStep] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({ animalId: "", title: "", description: "" });
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/login");
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    seedDemoVetProfile();
    const loadData = async () => {
      try {
        const appts = await api.getAppointments();
        setAppointments(appts);
      } catch {
        setAppointments(mockGetAppointments(user?.id));
      }
      setVetProfiles(mockGetVetProfiles());
      setLoading(false);
    };
    loadData();
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    if (selectedVet) {
      const slots = mockGetVetSlots(selectedVet.userId);
      setAllSlots(slots);
      setBookingStep(1);
    }
  }, [selectedVet]);

  const handleSelectDate = useCallback(
    (date: string) => {
      setSelectedDate(date);
      setSelectedSlot(null);
      if (selectedVet) {
        mockGenerateSlots(selectedVet, date);
        const updatedSlots = mockGetVetSlots(selectedVet.userId);
        setAllSlots(updatedSlots);
      }
      setBookingStep(2);
    },
    [selectedVet]
  );

  const handleSelectSlot = useCallback((slot: VetSlot) => {
    setSelectedSlot(slot);
    setBookingStep(3);
  }, []);

  const handleOpenBooking = () => {
    if (!selectedSlot || !selectedVet) return;
    setBookingData({ animalId: animals[0]?.id || "", title: "Consultation", description: "" });
    setShowBookingModal(true);
  };

  const handleConfirmBooking = async () => {
    if (!selectedSlot || !selectedVet || !bookingData.animalId) return;
    setSubmitting(true);
    try {
      const data = {
        animalId: bookingData.animalId,
        title: bookingData.title,
        description: bookingData.description,
        veterinarian: selectedVet.name,
        clinic: selectedVet.clinic,
        date: selectedSlot.date,
        time: selectedSlot.startTime,
        slotId: selectedSlot.id,
      };
      let newAppt: Appointment;
      try {
        newAppt = await api.createAppointment(data as Partial<Appointment>);
      } catch {
        newAppt = mockCreateAppointment(data, user?.id || "");
      }
      setAppointments((prev) => [newAppt, ...prev]);
      setAllSlots((prev) =>
        prev.map((s) => (s.id === selectedSlot.id ? { ...s, isBooked: true, appointmentId: newAppt.id } : s))
      );
      setShowBookingModal(false);
      setBookingSuccess(true);
      setTimeout(() => {
        setBookingSuccess(false);
        setSelectedSlot(null);
        setBookingStep(2);
      }, 3000);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelAppointment = async (id: string) => {
    if (!window.confirm("Annuler ce rendez-vous ?")) return;
    try {
      await api.deleteAppointment(id);
    } catch {
      mockDeleteAppointment(id);
    }
    setAppointments((prev) => prev.filter((a) => a.id !== id));
  };

  const daySlots = useMemo(() => {
    if (!selectedDate) return [];
    return allSlots.filter((s) => s.date === selectedDate);
  }, [allSlots, selectedDate]);

  const filteredAppointments = useMemo(() => {
    let result = appointments;
    if (filter !== "all") result = result.filter((a) => a.status === filter);
    return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [appointments, filter]);

  if (authLoading || loading) return <LoadingSpinner fullScreen />;
  if (!isAuthenticated) return null;

  const steps = [
    { num: 1, label: "Veterinaire", desc: "Choisissez votre praticien", icon: Stethoscope, color: "primary" },
    { num: 2, label: "Date", desc: "Selectionnez un jour", icon: Calendar, color: "accent" },
    { num: 3, label: "Creneau", desc: "Choisissez l'heure", icon: Clock, color: "success" },
  ];

  return (
    <PageContainer>
      {/* View Toggle */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-textColor dark:text-textColor-dark">Rendez-vous</h1>
          <p className="text-sm text-textColor-light dark:text-textColor-dark-light mt-0.5">
            {viewMode === "book" ? "Prenez rendez-vous en 3 etapes" : `${appointments.length} rendez-vous`}
          </p>
        </div>
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
          <button
            onClick={() => setViewMode("book")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all",
              viewMode === "book"
                ? "bg-white dark:bg-surface-dark shadow-sm text-primary"
                : "text-textColor-light dark:text-textColor-dark-light hover:text-textColor dark:hover:text-textColor-dark"
            )}
          >
            <CalendarCheck className="w-3.5 h-3.5" /> Reserver
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all",
              viewMode === "list"
                ? "bg-white dark:bg-surface-dark shadow-sm text-primary"
                : "text-textColor-light dark:text-textColor-dark-light hover:text-textColor dark:hover:text-textColor-dark"
            )}
          >
            <ClipboardList className="w-3.5 h-3.5" /> Mes RDV
          </button>
        </div>
      </div>

      {/* Success banner */}
      {bookingSuccess && (
        <div className="mb-6 bg-success/10 border border-success/20 rounded-2xl px-5 py-4 flex items-center gap-3 animate-slide-up">
          <div className="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center">
            <Check className="w-5 h-5 text-success" />
          </div>
          <div>
            <p className="text-sm font-semibold text-success">Rendez-vous confirme !</p>
            <p className="text-xs text-textColor-light dark:text-textColor-dark-light">
              Vous recevrez un rappel avant votre consultation.
            </p>
          </div>
        </div>
      )}

      {viewMode === "book" ? (
        <>
          {/* Steps indicator - petcare-app.fr style */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {steps.map((step, i) => {
              const StepIcon = step.icon;
              const isActive = bookingStep >= step.num;
              const isCurrent = bookingStep === step.num;
              return (
                <div
                  key={step.num}
                  className={cn(
                    "relative flex flex-col items-center text-center p-4 rounded-2xl border transition-all duration-300",
                    isCurrent
                      ? "bg-gradient-to-br from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10 border-primary/20 shadow-sm"
                      : isActive
                      ? "bg-surface dark:bg-surface-dark border-success/20"
                      : "bg-gray-50/50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700/50 opacity-60"
                  )}
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center mb-2 transition-all",
                      isCurrent
                        ? "bg-primary/10 text-primary"
                        : isActive
                        ? "bg-success/10 text-success"
                        : "bg-gray-100 dark:bg-gray-700 text-textColor-light dark:text-textColor-dark-light"
                    )}
                  >
                    {isActive && !isCurrent ? <Check className="w-5 h-5" /> : <StepIcon className="w-5 h-5" />}
                  </div>
                  <span
                    className={cn(
                      "text-xs font-bold uppercase tracking-wide",
                      isCurrent ? "text-primary" : isActive ? "text-success" : "text-textColor-light dark:text-textColor-dark-light"
                    )}
                  >
                    {step.label}
                  </span>
                  <span className="text-[10px] text-textColor-light dark:text-textColor-dark-light mt-0.5 hidden sm:block">
                    {step.desc}
                  </span>
                  {i < steps.length - 1 && (
                    <ArrowRight
                      className={cn(
                        "absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 z-10 hidden sm:block",
                        isActive ? "text-success" : "text-gray-300 dark:text-gray-600"
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Step 1: Choose Vet */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-textColor dark:text-textColor-dark mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                1
              </span>
              Choisir un veterinaire
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {vetProfiles.map((vet) => (
                <Card
                  key={vet.id}
                  hoverable
                  onClick={() => setSelectedVet(vet)}
                  className={cn(
                    "!transition-all !duration-200",
                    selectedVet?.id === vet.id && "!border-primary !shadow-md ring-2 ring-primary/20"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0",
                        selectedVet?.id === vet.id
                          ? "bg-primary text-white"
                          : "bg-accent/10 text-accent"
                      )}
                    >
                      <Stethoscope className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-textColor dark:text-textColor-dark">
                        Dr. {vet.name}
                      </p>
                      <p className="text-xs text-textColor-light dark:text-textColor-dark-light">{vet.specialty}</p>
                      <div className="flex items-center gap-1 mt-1 text-xs text-textColor-light dark:text-textColor-dark-light">
                        <MapPin className="w-3 h-3" />
                        {vet.clinic}
                      </div>
                    </div>
                    {selectedVet?.id === vet.id && (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Step 2 & 3: Calendar + Slots */}
          {selectedVet && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-sm font-semibold text-textColor dark:text-textColor-dark mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-accent/10 flex items-center justify-center text-xs font-bold text-accent">
                    2
                  </span>
                  Choisir une date
                </h3>
                <AppointmentCalendar
                  slots={allSlots}
                  selectedDate={selectedDate}
                  onSelectDate={handleSelectDate}
                />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-textColor dark:text-textColor-dark mb-3 flex items-center gap-2">
                  <span
                    className={cn(
                      "w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold",
                      selectedDate ? "bg-success/10 text-success" : "bg-gray-100 dark:bg-gray-700 text-textColor-light"
                    )}
                  >
                    3
                  </span>
                  Choisir un creneau
                </h3>
                <Card>
                  {selectedDate ? (
                    <>
                      <TimeSlotPicker
                        date={selectedDate}
                        slots={daySlots}
                        selectedSlot={selectedSlot}
                        onSelectSlot={handleSelectSlot}
                      />
                      {selectedSlot && (
                        <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700/50">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="text-sm font-semibold text-textColor dark:text-textColor-dark">
                                {selectedSlot.startTime} - {selectedSlot.endTime}
                              </p>
                              <p className="text-xs text-textColor-light dark:text-textColor-dark-light">
                                Dr. {selectedVet.name} - {selectedVet.clinic}
                              </p>
                            </div>
                          </div>
                          <Button fullWidth onClick={handleOpenBooking}>
                            <PawPrint className="w-4 h-4 mr-2" />
                            Confirmer le rendez-vous
                          </Button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-14 h-14 mx-auto rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                        <Calendar className="w-7 h-7 text-textColor-light dark:text-textColor-dark-light" />
                      </div>
                      <p className="text-sm font-medium text-textColor dark:text-textColor-dark">
                        Selectionnez une date
                      </p>
                      <p className="text-xs text-textColor-light dark:text-textColor-dark-light mt-1">
                        Les jours avec un point vert ont des creneaux disponibles
                      </p>
                    </div>
                  )}
                </Card>
              </div>
            </div>
          )}

          {/* Upcoming Appointments Preview */}
          {appointments.filter((a) => a.status === "scheduled").length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-textColor dark:text-textColor-dark">
                  Prochains rendez-vous
                </h3>
                <button
                  onClick={() => setViewMode("list")}
                  className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
                >
                  Tout voir <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-3">
                {appointments
                  .filter((a) => a.status === "scheduled")
                  .slice(0, 3)
                  .map((appt) => (
                    <AppointmentCard key={appt.id} appointment={appt} showAnimalName />
                  ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {/* List View */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
            {[
              { key: "all", label: "Tous" },
              { key: "scheduled", label: "Planifies" },
              { key: "completed", label: "Termines" },
              { key: "cancelled", label: "Annules" },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all",
                  filter === f.key
                    ? "bg-primary text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-textColor-light dark:text-textColor-dark-light hover:bg-gray-200 dark:hover:bg-gray-700"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          {filteredAppointments.length === 0 ? (
            <EmptyState
              icon={<Calendar className="w-8 h-8" />}
              title="Aucun rendez-vous"
              description={
                filter === "all"
                  ? "Planifiez votre premier rendez-vous veterinaire."
                  : "Aucun rendez-vous avec ce statut."
              }
              action={
                filter === "all" ? (
                  <Button onClick={() => setViewMode("book")}>Prendre un rendez-vous</Button>
                ) : undefined
              }
            />
          ) : (
            <div className="space-y-3">
              {filteredAppointments.map((appt) => (
                <div key={appt.id} className="group relative">
                  <AppointmentCard appointment={appt} showAnimalName />
                  {appt.status === "scheduled" && (
                    <button
                      onClick={() => handleCancelAppointment(appt.id)}
                      className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-danger hover:underline"
                    >
                      Annuler
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Booking Modal */}
      <Modal isOpen={showBookingModal} onClose={() => setShowBookingModal(false)} title="Confirmer le rendez-vous" size="md">
        {selectedSlot && selectedVet && (
          <div className="space-y-5">
            {/* Summary Card */}
            <div className="bg-gradient-to-br from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10 rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-textColor dark:text-textColor-dark">
                    Dr. {selectedVet.name}
                  </p>
                  <p className="text-xs text-textColor-light dark:text-textColor-dark-light">{selectedVet.clinic}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-xs text-textColor dark:text-textColor-dark">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  {formatDate(selectedSlot.date)}
                </div>
                <div className="flex items-center gap-2 text-xs text-textColor dark:text-textColor-dark">
                  <Clock className="w-3.5 h-3.5 text-accent" />
                  {selectedSlot.startTime} - {selectedSlot.endTime}
                </div>
              </div>
            </div>

            {/* Animal Selection */}
            <Select
              label="Pour quel animal ?"
              placeholder="Choisir un animal"
              value={bookingData.animalId}
              options={animals.map((a) => ({ value: a.id, label: a.name }))}
              onChange={(e) => setBookingData((prev) => ({ ...prev, animalId: e.target.value }))}
            />

            {/* Motif */}
            <Input
              label="Motif de la consultation"
              placeholder="Ex: Visite annuelle, Vaccination..."
              value={bookingData.title}
              onChange={(e) => setBookingData((prev) => ({ ...prev, title: e.target.value }))}
            />

            {/* Notes */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-textColor dark:text-textColor-dark">
                Informations complementaires (optionnel)
              </label>
              <textarea
                className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-surface dark:bg-surface-dark px-4 py-2.5 text-sm text-textColor dark:text-textColor-dark focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 min-h-[60px] resize-y"
                placeholder="Symptomes, questions pour le veterinaire..."
                value={bookingData.description}
                onChange={(e) => setBookingData((prev) => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <Button
              fullWidth
              size="lg"
              isLoading={submitting}
              disabled={!bookingData.animalId || !bookingData.title}
              onClick={handleConfirmBooking}
            >
              <Check className="w-4 h-4 mr-2" />
              Confirmer le rendez-vous
            </Button>
          </div>
        )}
      </Modal>
    </PageContainer>
  );
}

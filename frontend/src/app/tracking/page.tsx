"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useAnimals } from "@/hooks/useAnimals";
import type { Animal } from "@/types";
import { formatDate, cn } from "@/lib/utils";
import PageContainer from "@/components/layout/PageContainer";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  Utensils,
  Heart,
  Droplets,
  Scale,
  Stethoscope,
  Scissors,
  Smile,
  FileText,
  Plus,
  Clock,
  PawPrint,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";

interface TrackingEntry {
  id: string;
  animalId: string;
  type: string;
  label: string;
  note: string;
  time: string;
  date: string;
}

const QUICK_ACTIONS = [
  { type: "meal", label: "Repas", icon: Utensils, color: "bg-primary/10 text-primary" },
  { type: "play", label: "Jeu", icon: Heart, color: "bg-secondary/10 text-secondary" },
  { type: "water", label: "Eau", icon: Droplets, color: "bg-accent/10 text-accent" },
  { type: "weight", label: "Poids", icon: Scale, color: "bg-warning/10 text-warning" },
  { type: "health", label: "Sante", icon: Stethoscope, color: "bg-danger/10 text-danger" },
  { type: "groom", label: "Toilette", icon: Scissors, color: "bg-primary/10 text-primary" },
  { type: "mood", label: "Humeur", icon: Smile, color: "bg-accent/10 text-accent" },
  { type: "note", label: "Notes", icon: FileText, color: "bg-primary/10 text-primary" },
];

const STORE_KEY = "petcare_mock_tracking";

function getEntries(): TrackingEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveEntries(entries: TrackingEntry[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORE_KEY, JSON.stringify(entries));
}

export default function TrackingPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { animals, isLoading: animalsLoading } = useAnimals();
  const router = useRouter();
  const [entries, setEntries] = useState<TrackingEntry[]>([]);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState<(typeof QUICK_ACTIONS)[0] | null>(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/login");
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    setEntries(getEntries());
  }, []);

  useEffect(() => {
    if (animals.length > 0 && !selectedAnimal) {
      setSelectedAnimal(animals[0]);
    }
  }, [animals, selectedAnimal]);

  const dayEntries = useMemo(() => {
    if (!selectedAnimal) return [];
    return entries
      .filter((e) => e.animalId === selectedAnimal.id && e.date === selectedDate)
      .sort((a, b) => b.time.localeCompare(a.time));
  }, [entries, selectedAnimal, selectedDate]);

  const stats = useMemo(() => {
    const today = entries.filter((e) => e.animalId === selectedAnimal?.id && e.date === selectedDate);
    return {
      meals: today.filter((e) => e.type === "meal").length,
      play: today.filter((e) => e.type === "play").length,
      water: today.filter((e) => e.type === "water").length,
      total: today.length,
    };
  }, [entries, selectedAnimal, selectedDate]);

  const handleQuickAction = (action: (typeof QUICK_ACTIONS)[0]) => {
    setActionType(action);
    setNote("");
    setShowModal(true);
  };

  const handleSaveEntry = () => {
    if (!selectedAnimal || !actionType) return;
    const now = new Date();
    const newEntry: TrackingEntry = {
      id: Date.now().toString(36),
      animalId: selectedAnimal.id,
      type: actionType.type,
      label: actionType.label,
      note: note || actionType.label,
      time: `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`,
      date: selectedDate,
    };
    const updated = [...entries, newEntry];
    setEntries(updated);
    saveEntries(updated);
    setShowModal(false);
  };

  const changeDate = (delta: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + delta);
    setSelectedDate(d.toISOString().split("T")[0]);
  };

  const isToday = selectedDate === new Date().toISOString().split("T")[0];

  if (authLoading || animalsLoading) return <LoadingSpinner fullScreen />;
  if (!isAuthenticated) return null;

  const getActionIcon = (type: string) => {
    const action = QUICK_ACTIONS.find((a) => a.type === type);
    return action ? action.icon : FileText;
  };

  const getActionColor = (type: string) => {
    const action = QUICK_ACTIONS.find((a) => a.type === type);
    return action ? action.color : "bg-gray-100 text-gray-500";
  };

  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-textColor dark:text-textColor-dark">Suivi quotidien</h1>
          <p className="text-sm text-textColor-light dark:text-textColor-dark-light mt-0.5">
            Suivez les activites de vos animaux au jour le jour
          </p>
        </div>
      </div>

      {/* Animal Selector */}
      {animals.length > 1 && (
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
          {animals.map((animal) => (
            <button
              key={animal.id}
              onClick={() => setSelectedAnimal(animal)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
                selectedAnimal?.id === animal.id
                  ? "bg-primary text-white shadow-sm"
                  : "bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-700/50 text-textColor dark:text-textColor-dark hover:border-primary/30"
              )}
            >
              <PawPrint className="w-3.5 h-3.5" />
              {animal.name}
            </button>
          ))}
        </div>
      )}

      {selectedAnimal && (
        <>
          {/* Animal Header + Date Nav */}
          <Card className="mb-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-bold text-sm">
                  {selectedAnimal.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-textColor dark:text-textColor-dark">{selectedAnimal.name}</p>
                <p className="text-xs text-textColor-light dark:text-textColor-dark-light">
                  {isToday ? "Aujourd'hui" : formatDate(selectedDate)}
                </p>
              </div>
            </div>

            {/* Date navigation */}
            <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 rounded-xl p-2">
              <button onClick={() => changeDate(-1)} className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-gray-700 transition-colors">
                <ChevronLeft className="w-4 h-4 text-textColor-light" />
              </button>
              <span className="text-sm font-medium text-textColor dark:text-textColor-dark">
                {isToday ? "Aujourd'hui" : formatDate(selectedDate)}
              </span>
              <button
                onClick={() => changeDate(1)}
                disabled={isToday}
                className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-gray-700 transition-colors disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4 text-textColor-light" />
              </button>
            </div>

            {/* Daily Stats */}
            <div className="grid grid-cols-4 gap-2 mt-4">
              {[
                { val: stats.meals, label: "Repas", icon: Utensils },
                { val: stats.play, label: "Jeu", icon: Heart },
                { val: stats.water, label: "Eau", icon: Droplets },
                { val: stats.total, label: "Total", icon: Check },
              ].map((s) => (
                <div key={s.label} className="bg-white dark:bg-surface-dark rounded-xl p-2.5 text-center border border-gray-100 dark:border-gray-700/50">
                  <s.icon className="w-4 h-4 text-primary mx-auto mb-1" />
                  <p className="text-lg font-bold text-textColor dark:text-textColor-dark">{s.val}</p>
                  <p className="text-[10px] text-textColor-light dark:text-textColor-dark-light">{s.label}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <div className="mb-5">
            <h3 className="text-sm font-semibold text-textColor dark:text-textColor-dark mb-3">Actions rapides</h3>
            <div className="grid grid-cols-4 gap-3">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.type}
                  onClick={() => handleQuickAction(action)}
                  className="flex flex-col items-center gap-1.5 group"
                >
                  <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-medium text-textColor-light dark:text-textColor-dark-light">
                    {action.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* History */}
          <div>
            <h3 className="text-sm font-semibold text-textColor dark:text-textColor-dark mb-3">
              Historique du jour
            </h3>
            {dayEntries.length === 0 ? (
              <Card className="text-center py-8">
                <Clock className="w-8 h-8 text-textColor-light dark:text-textColor-dark-light mx-auto mb-2" />
                <p className="text-sm text-textColor-light dark:text-textColor-dark-light">
                  Aucune activite enregistree
                </p>
                <p className="text-xs text-textColor-light dark:text-textColor-dark-light mt-1">
                  Utilisez les actions rapides ci-dessus
                </p>
              </Card>
            ) : (
              <div className="space-y-2">
                {dayEntries.map((entry) => {
                  const Icon = getActionIcon(entry.type);
                  const color = getActionColor(entry.type);
                  return (
                    <div key={entry.id} className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-700/50">
                      <span className="text-xs text-textColor-light dark:text-textColor-dark-light w-10 font-mono">
                        {entry.time}
                      </span>
                      <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm text-textColor dark:text-textColor-dark flex-1">{entry.note}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* Quick Action Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={actionType ? `${actionType.label}` : "Action"}
      >
        {actionType && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <div className={`w-10 h-10 rounded-xl ${actionType.color} flex items-center justify-center`}>
                <actionType.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-textColor dark:text-textColor-dark">
                  {actionType.label} pour {selectedAnimal?.name}
                </p>
                <p className="text-xs text-textColor-light dark:text-textColor-dark-light">
                  {isToday ? "Aujourd'hui" : formatDate(selectedDate)}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-textColor dark:text-textColor-dark mb-1.5">
                Note (optionnel)
              </label>
              <textarea
                className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-surface dark:bg-surface-dark px-4 py-2.5 text-sm text-textColor dark:text-textColor-dark focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all min-h-[60px] resize-y"
                placeholder={`Ex: ${actionType.type === "meal" ? "Croquettes - 50g" : actionType.type === "play" ? "Jeu de balle - 15 min" : "Details..."}`}
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            <Button fullWidth onClick={handleSaveEntry}>
              <Plus className="w-4 h-4 mr-2" />
              Enregistrer
            </Button>
          </div>
        )}
      </Modal>
    </PageContainer>
  );
}

"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useAnimals } from "@/hooks/useAnimals";
import PageContainer from "@/components/layout/PageContainer";
import AnimalCard from "@/components/animals/AnimalCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Link from "next/link";
import { PawPrint, Plus, Search } from "lucide-react";

export default function AnimalsPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { animals, isLoading, error } = useAnimals();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState<string>("all");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/login");
  }, [isAuthenticated, authLoading, router]);

  const filtered = useMemo(() => {
    return animals.filter((animal) => {
      const matchesSearch =
        animal.name.toLowerCase().includes(search.toLowerCase()) ||
        animal.breed.toLowerCase().includes(search.toLowerCase());
      const matchesSpecies = speciesFilter === "all" || animal.species === speciesFilter;
      return matchesSearch && matchesSpecies;
    });
  }, [animals, search, speciesFilter]);

  if (authLoading || isLoading) return <LoadingSpinner fullScreen />;
  if (!isAuthenticated) return null;

  return (
    <PageContainer
      title="Mes animaux"
      subtitle={`${animals.length} animal${animals.length !== 1 ? "ux" : ""} enregistre${animals.length !== 1 ? "s" : ""}`}
      action={
        <Link href="/animals/new">
          <Button size="sm">
            <Plus className="w-4 h-4 mr-1" /> Ajouter
          </Button>
        </Link>
      }
    >
      {animals.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Rechercher un animal..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {["all", "dog", "cat", "bird", "rabbit", "hamster", "fish", "reptile", "other"].map((s) => (
              <button
                key={s}
                onClick={() => setSpeciesFilter(s)}
                className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  speciesFilter === s
                    ? "bg-primary text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-textColor-light dark:text-textColor-dark-light hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {s === "all"
                  ? "Tous"
                  : s === "dog"
                    ? "Chiens"
                    : s === "cat"
                      ? "Chats"
                      : s === "bird"
                        ? "Oiseaux"
                        : s === "rabbit"
                          ? "Lapins"
                          : s === "hamster"
                            ? "Hamsters"
                            : s === "fish"
                              ? "Poissons"
                              : s === "reptile"
                                ? "Reptiles"
                                : "Autres"}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="bg-danger/10 text-danger text-sm rounded-xl px-4 py-3 mb-6">{error}</div>
      )}

      {filtered.length === 0 && animals.length === 0 ? (
        <EmptyState
          icon={<PawPrint className="w-8 h-8" />}
          title="Aucun animal"
          description="Ajoutez votre premier animal de compagnie pour commencer a suivre sa sante."
          action={
            <Link href="/animals/new">
              <Button>Ajouter un animal</Button>
            </Link>
          }
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Search className="w-8 h-8" />}
          title="Aucun resultat"
          description="Aucun animal ne correspond a votre recherche."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((animal) => (
            <AnimalCard key={animal.id} animal={animal} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}

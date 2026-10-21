"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { mockGetAnimals, mockCreateAnimal, mockUpdateAnimal, mockDeleteAnimal } from "@/lib/mock-store";
import { useAuth } from "./useAuth";
import type { Animal } from "@/types";

export function useAnimals() {
  const { user } = useAuth();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnimals = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await api.getAnimals();
      setAnimals(data);
    } catch {
      if (user) {
        const data = mockGetAnimals(user.id);
        setAnimals(data);
      } else {
        setAnimals([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAnimals();
  }, [fetchAnimals]);

  const addAnimal = useCallback(async (data: Partial<Animal>) => {
    try {
      const newAnimal = await api.createAnimal(data);
      setAnimals((prev) => [...prev, newAnimal]);
      return newAnimal;
    } catch {
      if (user) {
        const newAnimal = mockCreateAnimal(data, user.id);
        setAnimals((prev) => [...prev, newAnimal]);
        return newAnimal;
      }
      throw new Error("Non authentifie");
    }
  }, [user]);

  const updateAnimal = useCallback(async (id: string, data: Partial<Animal>) => {
    try {
      const updated = await api.updateAnimal(id, data);
      setAnimals((prev) => prev.map((a) => (a.id === id ? updated : a)));
      return updated;
    } catch {
      const updated = mockUpdateAnimal(id, data);
      setAnimals((prev) => prev.map((a) => (a.id === id ? updated : a)));
      return updated;
    }
  }, []);

  const removeAnimal = useCallback(async (id: string) => {
    try {
      await api.deleteAnimal(id);
    } catch {
      mockDeleteAnimal(id);
    }
    setAnimals((prev) => prev.filter((a) => a.id !== id));
  }, []);

  return {
    animals,
    isLoading,
    error,
    refetch: fetchAnimals,
    addAnimal,
    updateAnimal,
    removeAnimal,
  };
}

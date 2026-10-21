"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useAnimals } from "@/hooks/useAnimals";
import PageContainer from "@/components/layout/PageContainer";
import AnimalForm from "@/components/animals/AnimalForm";
import Card from "@/components/ui/Card";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewAnimalPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { addAnimal } = useAnimals();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/login");
  }, [isAuthenticated, authLoading, router]);

  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      setIsLoading(true);
      setError(null);
      await addAnimal(data);
      router.push("/animals");
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "message" in err
          ? (err as { message: string }).message
          : "Erreur lors de la creation";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) return <LoadingSpinner fullScreen />;
  if (!isAuthenticated) return null;

  return (
    <PageContainer>
      <Link
        href="/animals"
        className="inline-flex items-center gap-2 text-sm text-textColor-light dark:text-textColor-dark-light hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Retour aux animaux
      </Link>

      <h1 className="text-2xl font-bold text-textColor dark:text-textColor-dark mb-6">
        Ajouter un animal
      </h1>

      <Card className="max-w-2xl">
        {error && (
          <div className="bg-danger/10 text-danger text-sm rounded-xl px-4 py-3 mb-4">{error}</div>
        )}
        <AnimalForm onSubmit={handleSubmit} isLoading={isLoading} />
      </Card>
    </PageContainer>
  );
}

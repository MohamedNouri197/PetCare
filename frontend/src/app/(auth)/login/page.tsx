"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { seedAllDemoData } from "@/lib/mock-store";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Mail, Lock, PawPrint, Stethoscope, Sparkles } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVet, setIsVet] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      await login(data.email, data.password);
      router.push("/animals");
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "message" in err
          ? (err as { message: string }).message
          : "Identifiants incorrects";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (role: "owner" | "vet") => {
    try {
      setIsLoading(true);
      setError(null);
      seedAllDemoData();
      const email = role === "vet" ? "vet@petcare.fr" : "demo@petcare.fr";
      const password = role === "vet" ? "vet1234" : "demo1234";
      await login(email, password);
      router.push("/animals");
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "message" in err
          ? (err as { message: string }).message
          : "Erreur lors de la connexion demo";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <PawPrint className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-textColor dark:text-textColor-dark">
            Bon retour !
          </h1>
          <p className="text-sm text-textColor-light dark:text-textColor-dark-light mt-2">
            Connectez-vous a votre compte PetCare
          </p>
        </div>

        {/* Toggle Proprietaire / Veterinaire */}
        <div className="flex gap-2 mb-6">
          <button
            type="button"
            onClick={() => setIsVet(false)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${
              !isVet
                ? "bg-primary text-white shadow-md"
                : "bg-gray-100 dark:bg-gray-800 text-textColor-light dark:text-textColor-dark-light hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            <PawPrint className="w-4 h-4" />
            Proprietaire
          </button>
          <button
            type="button"
            onClick={() => setIsVet(true)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${
              isVet
                ? "bg-accent text-white shadow-md"
                : "bg-gray-100 dark:bg-gray-800 text-textColor-light dark:text-textColor-dark-light hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            Veterinaire
          </button>
        </div>

        {isVet && (
          <div className="bg-accent/10 border border-accent/20 text-accent dark:text-accent text-sm rounded-xl px-4 py-3 mb-4 flex items-start gap-2">
            <Stethoscope className="w-4 h-4 mt-0.5 shrink-0" />
            <span>
              Espace veterinaire : acces aux dossiers medicaux partages par les proprietaires.
            </span>
          </div>
        )}

        <div className="bg-surface dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="bg-danger/10 text-danger text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <Input
              label="Email"
              type="email"
              placeholder="votre@email.com"
              icon={<Mail className="w-4 h-4" />}
              error={errors.email?.message}
              {...register("email")}
            />

            <Input
              label="Mot de passe"
              type="password"
              placeholder="Votre mot de passe"
              icon={<Lock className="w-4 h-4" />}
              error={errors.password?.message}
              {...register("password")}
            />

            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              className={isVet ? "!bg-accent hover:!bg-accent/90" : ""}
            >
              {isVet ? "Se connecter en tant que veterinaire" : "Se connecter"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-textColor-light dark:text-textColor-dark-light">
              Pas encore de compte ?{" "}
              <Link href="/register" className="text-primary font-medium hover:underline">
                Creer un compte
              </Link>
            </p>
          </div>
        </div>

        {/* Demo Access */}
        <div className="mt-6 bg-primary/5 dark:bg-primary/10 rounded-2xl border border-primary/20 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold text-textColor dark:text-textColor-dark">Acces demonstration</h3>
          </div>
          <p className="text-xs text-textColor-light dark:text-textColor-dark-light mb-4">
            Decouvrez l&apos;application avec des donnees pre-remplies (4 animaux, dossiers medicaux, rendez-vous, etc.)
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin("owner")}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium bg-primary text-white hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              <PawPrint className="w-4 h-4" />
              Demo Proprietaire
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin("vet")}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium bg-accent text-white hover:bg-accent/90 transition-colors disabled:opacity-50"
            >
              <Stethoscope className="w-4 h-4" />
              Demo Veterinaire
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

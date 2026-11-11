"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Mail, Lock, User, PawPrint, Stethoscope } from "lucide-react";
import type { UserRole } from "@/types";

const registerSchema = z
  .object({
    firstName: z.string().min(2, "Le prenom doit contenir au moins 2 caracteres"),
    lastName: z.string().min(2, "Le nom doit contenir au moins 2 caracteres"),
    email: z.string().email("Email invalide"),
    password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register: registerUser, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<UserRole>("owner");

  useEffect(() => {
    if (!authLoading && isAuthenticated) router.replace("/animals");
  }, [isAuthenticated, authLoading, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      await registerUser(data.email, data.password, data.firstName, data.lastName, role);
      router.replace("/animals");
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "message" in err
          ? (err as { message: string }).message
          : "Erreur lors de l'inscription";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const isVet = role === "veterinarian";

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <PawPrint className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-textColor dark:text-textColor-dark">
            Creer un compte
          </h1>
          <p className="text-sm text-textColor-light dark:text-textColor-dark-light mt-2">
            Rejoignez PetCare pour prendre soin de vos animaux
          </p>
        </div>

        {/* Toggle Proprietaire / Veterinaire */}
        <div className="flex gap-2 mb-6">
          <button
            type="button"
            onClick={() => setRole("owner")}
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
            onClick={() => setRole("veterinarian")}
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
          <div className="bg-accent/10 border border-accent/20 text-accent text-sm rounded-xl px-4 py-3 mb-4 flex items-start gap-2">
            <Stethoscope className="w-4 h-4 mt-0.5 shrink-0" />
            <span>
              Compte veterinaire : vous pourrez consulter les dossiers medicaux partages par vos clients.
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

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Prenom"
                placeholder="Jean"
                icon={<User className="w-4 h-4" />}
                error={errors.firstName?.message}
                {...register("firstName")}
              />
              <Input
                label="Nom"
                placeholder="Dupont"
                error={errors.lastName?.message}
                {...register("lastName")}
              />
            </div>

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
              placeholder="Au moins 6 caracteres"
              icon={<Lock className="w-4 h-4" />}
              error={errors.password?.message}
              {...register("password")}
            />

            <Input
              label="Confirmer le mot de passe"
              type="password"
              placeholder="Confirmez votre mot de passe"
              icon={<Lock className="w-4 h-4" />}
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />

            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              className={isVet ? "!bg-accent hover:!bg-accent/90" : ""}
            >
              {isVet ? "Creer mon compte veterinaire" : "Creer mon compte"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-textColor-light dark:text-textColor-dark-light">
              Deja un compte ?{" "}
              <Link href="/login" className="text-primary font-medium hover:underline">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

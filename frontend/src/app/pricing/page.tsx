"use client";

import React, { useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import {
  Check,
  X,
  PawPrint,
  Zap,
  Crown,
  ArrowLeft,
  Star,
} from "lucide-react";

type PlanId = "free" | "elementary" | "premium";

interface PlanFeature {
  label: string;
  free: boolean;
  elementary: boolean;
  premium: boolean;
}

const FEATURES: PlanFeature[] = [
  { label: "Jusqu'a 1 animal", free: true, elementary: false, premium: false },
  { label: "Jusqu'a 5 animaux", free: false, elementary: true, premium: false },
  { label: "Animaux illimites", free: false, elementary: false, premium: true },
  { label: "Photo de profil animal", free: false, elementary: true, premium: true },
  { label: "Suivi medical de base", free: true, elementary: true, premium: true },
  { label: "Suivi des vaccinations", free: true, elementary: true, premium: true },
  { label: "Suivi quotidien", free: false, elementary: true, premium: true },
  { label: "Prise de rendez-vous", free: false, elementary: true, premium: true },
  { label: "Rappels automatiques", free: false, elementary: true, premium: true },
  { label: "Suivi nutritionnel", free: false, elementary: true, premium: true },
  { label: "Historique complet", free: false, elementary: true, premium: true },
  { label: "Assistant IA", free: false, elementary: false, premium: true },
  { label: "Export des donnees (PDF)", free: false, elementary: false, premium: true },
  { label: "Support prioritaire", free: false, elementary: false, premium: true },
];

const PLANS: {
  id: PlanId;
  name: string;
  price: string;
  period: string;
  description: string;
  icon: typeof PawPrint;
  color: string;
  bgGradient: string;
  popular?: boolean;
}[] = [
  {
    id: "free",
    name: "Gratuit",
    price: "0",
    period: "pour toujours",
    description: "L'essentiel pour commencer a suivre votre animal.",
    icon: PawPrint,
    color: "text-textColor-light",
    bgGradient: "from-gray-50 to-white dark:from-gray-800 dark:to-surface-dark",
  },
  {
    id: "elementary",
    name: "Elementaire",
    price: "4.99",
    period: "/ mois",
    description: "Tout ce dont vous avez besoin pour plusieurs animaux.",
    icon: Zap,
    color: "text-primary",
    bgGradient: "from-primary/5 to-white dark:from-primary/10 dark:to-surface-dark",
    popular: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: "9.99",
    period: "/ mois",
    description: "L'experience complete avec IA et fonctionnalites avancees.",
    icon: Crown,
    color: "text-warning",
    bgGradient: "from-warning/5 to-white dark:from-warning/10 dark:to-surface-dark",
  },
];

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<PlanId>("elementary");

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-background dark:bg-background-dark">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-textColor-light dark:text-textColor-dark-light hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Retour
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-4 py-1.5 rounded-full mb-4">
            Tarifs
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-textColor dark:text-textColor-dark tracking-tight">
            Choisissez votre plan
          </h1>
          <p className="mt-4 text-lg text-textColor-light dark:text-textColor-dark-light max-w-xl mx-auto">
            Des formules adaptees a tous les besoins, du proprietaire d&apos;un seul animal au passione multi-compagnons.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {PLANS.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`relative bg-gradient-to-b ${plan.bgGradient} rounded-3xl p-6 sm:p-8 border-2 transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? "border-primary shadow-xl shadow-primary/10 scale-[1.02]"
                    : "border-gray-100 dark:border-gray-700/50 hover:border-primary/30 hover:shadow-lg"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-4 py-1 rounded-full bg-primary text-white text-xs font-bold shadow-lg">
                      <Star className="w-3 h-3" />
                      Populaire
                    </span>
                  </div>
                )}

                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
                  plan.id === "free"
                    ? "bg-gray-100 dark:bg-gray-700"
                    : plan.id === "elementary"
                      ? "bg-primary/10"
                      : "bg-warning/10"
                }`}>
                  <plan.icon className={`w-6 h-6 ${plan.color}`} />
                </div>

                <h3 className="text-xl font-bold text-textColor dark:text-textColor-dark mb-1">
                  {plan.name}
                </h3>
                <p className="text-sm text-textColor-light dark:text-textColor-dark-light mb-4">
                  {plan.description}
                </p>

                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-extrabold text-textColor dark:text-textColor-dark">
                    {plan.price}
                  </span>
                  <span className="text-lg font-bold text-textColor dark:text-textColor-dark">
                    {plan.price !== "0" ? "EUR" : ""}
                  </span>
                  <span className="text-sm text-textColor-light dark:text-textColor-dark-light ml-1">
                    {plan.period}
                  </span>
                </div>

                <ul className="space-y-2.5 mb-6">
                  {FEATURES.filter((f) => f[plan.id]).map((f) => (
                    <li key={f.label} className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-sm text-textColor dark:text-textColor-dark">{f.label}</span>
                    </li>
                  ))}
                  {FEATURES.filter((f) => !f[plan.id]).slice(0, 3).map((f) => (
                    <li key={f.label} className="flex items-center gap-2.5 opacity-40">
                      <div className="w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                        <X className="w-3 h-3 text-textColor-light" />
                      </div>
                      <span className="text-sm text-textColor-light dark:text-textColor-dark-light line-through">{f.label}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/register">
                  <Button
                    fullWidth
                    variant={isSelected ? "primary" : "outline"}
                    className={isSelected ? "!rounded-xl" : "!rounded-xl"}
                  >
                    {plan.price === "0" ? "Commencer gratuitement" : "Essai gratuit 14 jours"}
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Comparison Table */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-textColor dark:text-textColor-dark text-center mb-8">
            Comparaison detaillee
          </h2>
          <div className="bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-700/50 overflow-hidden shadow-sm">
            {/* Table Header */}
            <div className="grid grid-cols-4 gap-0 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700/50">
              <div className="p-4 text-sm font-semibold text-textColor dark:text-textColor-dark">
                Fonctionnalite
              </div>
              {PLANS.map((plan) => (
                <div key={plan.id} className="p-4 text-center">
                  <p className="text-sm font-bold text-textColor dark:text-textColor-dark">{plan.name}</p>
                  <p className="text-xs text-textColor-light dark:text-textColor-dark-light">
                    {plan.price === "0" ? "Gratuit" : `${plan.price} EUR/mois`}
                  </p>
                </div>
              ))}
            </div>
            {/* Table Rows */}
            {FEATURES.map((feature, idx) => (
              <div
                key={feature.label}
                className={`grid grid-cols-4 gap-0 ${
                  idx < FEATURES.length - 1 ? "border-b border-gray-50 dark:border-gray-700/30" : ""
                } ${idx % 2 === 0 ? "" : "bg-gray-50/50 dark:bg-gray-800/20"}`}
              >
                <div className="p-3.5 text-sm text-textColor dark:text-textColor-dark flex items-center">
                  {feature.label}
                </div>
                {(["free", "elementary", "premium"] as PlanId[]).map((planId) => (
                  <div key={planId} className="p-3.5 flex items-center justify-center">
                    {feature[planId] ? (
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-primary" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        <X className="w-3.5 h-3.5 text-gray-300 dark:text-gray-500" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* FAQ or CTA */}
        <div className="text-center mt-16">
          <div className="bg-primary rounded-3xl p-8 sm:p-12 relative overflow-hidden max-w-3xl mx-auto">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative z-10">
              <h2 className="text-2xl font-extrabold text-white mb-3">
                Pas encore decide ?
              </h2>
              <p className="text-white/80 mb-6 max-w-md mx-auto">
                Commencez gratuitement et passez a un plan superieur quand vous le souhaitez. Aucun engagement.
              </p>
              <Link href="/register">
                <Button variant="ghost" size="lg" className="!bg-white !text-primary hover:!bg-gray-50 !rounded-full !px-8 !font-bold">
                  Commencer gratuitement
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

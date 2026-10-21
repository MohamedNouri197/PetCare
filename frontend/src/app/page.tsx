"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import Button from "@/components/ui/Button";
import {
  PawPrint,
  Heart,
  Calendar,
  Shield,
  Stethoscope,
  Bell,
  Utensils,
  Scale,
  Bot,
  ChevronRight,
  Check,
  Clock,
  Activity,
  Zap,
  Crown,
  Star,
} from "lucide-react";

const features = [
  {
    icon: PawPrint,
    title: "Gestion des animaux",
    description: "Creez des profils complets pour chacun de vos compagnons. Race, age, poids, allergies.",
    color: "text-primary bg-primary/10",
  },
  {
    icon: Stethoscope,
    title: "Suivi medical",
    description: "Historique complet des consultations, traitements et ordonnances veterinaires.",
    color: "text-primary bg-primary/10",
  },
  {
    icon: Shield,
    title: "Vaccinations",
    description: "Ne manquez plus jamais un rappel de vaccination. Alertes automatiques.",
    color: "text-primary bg-primary/10",
  },
  {
    icon: Calendar,
    title: "Rendez-vous en ligne",
    description: "Prenez rendez-vous chez votre veterinaire sur son calendrier partage.",
    color: "text-primary bg-primary/10",
  },
  {
    icon: Utensils,
    title: "Nutrition",
    description: "Suivez l'alimentation et les repas quotidiens de vos animaux.",
    color: "text-primary bg-primary/10",
  },
  {
    icon: Bot,
    title: "Assistant IA",
    description: "Notre assistant vous aide a organiser les soins et vous indique quand consulter.",
    color: "text-primary bg-primary/10",
  },
];

export default function LandingPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) return null;
  if (isAuthenticated) return null;

  return (
    <div className="min-h-[calc(100vh-3.5rem)]">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-primary/20 bg-white dark:bg-surface-dark text-primary text-sm font-semibold mb-8 shadow-sm">
            <PawPrint className="w-4 h-4" />
            DISPONIBLE GRATUITEMENT
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-textColor dark:text-textColor-dark leading-[1.1] tracking-tight">
            Prenez soin de vos
            <br />
            animaux avec{" "}
            <span className="text-primary">
              amour
            </span>
          </h1>
          <p className="mt-6 text-lg text-textColor-light dark:text-textColor-dark-light max-w-xl mx-auto leading-relaxed">
            Suivez la sante, le poids, les vaccins et l&apos;alimentation de votre chien ou de votre chat.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="!rounded-full !px-8">
                Commencer gratuitement
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="!rounded-full !px-8">
                Se connecter
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* App Preview - 3 phone mockups */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-textColor dark:text-textColor-dark tracking-tight">
            Decouvrez l&apos;interface
          </h2>
          <p className="text-textColor-light dark:text-textColor-dark-light mt-3">
            Simple, intuitive et concue pour le quotidien de votre animal.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
          {/* Phone 1 - Profil */}
          <div className="flex flex-col items-center">
            <div className="w-full max-w-[280px] bg-white dark:bg-surface-dark rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700/50 overflow-hidden">
              {/* Phone notch */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-24 h-6 bg-black rounded-full" />
              </div>
              {/* Screen content */}
              <div className="px-4 pb-6">
                <div className="bg-primary rounded-2xl p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-bold">Profil</h3>
                    <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                      <PawPrint className="w-3 h-3" /> 3 animaux
                    </span>
                  </div>
                </div>
                <p className="text-xs font-semibold text-textColor dark:text-textColor-dark mb-2 flex items-center justify-between">
                  Mes animaux <span className="text-primary text-lg">+</span>
                </p>
                {[
                  { name: "Minou", breed: "siamois - 6 mois", gender: "Male", weight: "5 kg" },
                  { name: "Rex", breed: "beagle - 1 an", gender: "Femelle", weight: "8 kg" },
                  { name: "Kiwi", breed: "canary - 7 mois", gender: "Femelle", weight: "35 g" },
                ].map((pet) => (
                  <div key={pet.name} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 dark:border-gray-700/50 mb-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <PawPrint className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-textColor dark:text-textColor-dark flex items-center gap-1">
                        {pet.name} <Check className="w-3 h-3 text-primary" />
                      </p>
                      <p className="text-[10px] text-textColor-light dark:text-textColor-dark-light">{pet.breed}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </div>
                ))}
                <p className="text-xs font-semibold text-textColor dark:text-textColor-dark mt-3 mb-2">
                  Notifications
                </p>
                <div className="flex items-center gap-2 p-2 rounded-lg">
                  <Bell className="w-4 h-4 text-warning" />
                  <span className="text-xs text-textColor dark:text-textColor-dark flex-1">Rappels repas</span>
                  <div className="w-8 h-4 bg-primary rounded-full relative">
                    <div className="w-3 h-3 bg-white rounded-full absolute right-0.5 top-0.5" />
                  </div>
                </div>
              </div>
            </div>
            <p className="mt-4 text-sm font-bold text-textColor dark:text-textColor-dark">Gestion des animaux</p>
          </div>

          {/* Phone 2 - Suivi Sante */}
          <div className="flex flex-col items-center">
            <div className="w-full max-w-[280px] bg-white dark:bg-surface-dark rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700/50 overflow-hidden">
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-24 h-6 bg-black rounded-full" />
              </div>
              <div className="px-4 pb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-textColor dark:text-textColor-dark">Sante</h3>
                </div>
                <div className="bg-primary/5 rounded-2xl p-4 mb-3 border border-primary/10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">M</div>
                    <div>
                      <p className="text-sm font-semibold text-textColor dark:text-textColor-dark">Minou</p>
                      <p className="text-[10px] text-textColor-light dark:text-textColor-dark-light">Derniere visite: il y a 2 sem.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    {[
                      { val: "1", label: "Repas", icon: Utensils },
                      { val: "15", label: "Vaccins", icon: Shield },
                      { val: "2", label: "RDV", icon: Calendar },
                      { val: "1", label: "Alerte", icon: Bell },
                    ].map((s) => (
                      <div key={s.label} className="bg-white dark:bg-surface-dark rounded-xl p-2 border border-gray-100 dark:border-gray-700/50">
                        <s.icon className="w-3.5 h-3.5 text-primary mx-auto mb-0.5" />
                        <p className="text-sm font-bold text-textColor dark:text-textColor-dark">{s.val}</p>
                        <p className="text-[8px] text-textColor-light dark:text-textColor-dark-light">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-xs font-semibold text-textColor dark:text-textColor-dark mb-2">Analyse</p>
                <div className="space-y-1.5 text-xs">
                  {[
                    { text: "8 ingredients de qualite identifies", ok: true },
                    { text: "Premier ingredient de qualite", ok: true },
                    { text: "1 ingredient a surveiller", ok: false },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${item.ok ? "bg-primary/10" : "bg-warning/10"}`}>
                        {item.ok ? <Check className="w-2.5 h-2.5 text-primary" /> : <span className="text-warning text-[10px] font-bold">!</span>}
                      </div>
                      <span className="text-textColor-light dark:text-textColor-dark-light">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-4 text-sm font-bold text-textColor dark:text-textColor-dark">Suivi medical</p>
          </div>

          {/* Phone 3 - Suivi quotidien */}
          <div className="flex flex-col items-center">
            <div className="w-full max-w-[280px] bg-white dark:bg-surface-dark rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700/50 overflow-hidden">
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-24 h-6 bg-black rounded-full" />
              </div>
              <div className="px-4 pb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-textColor dark:text-textColor-dark">Suivi</h3>
                  <Calendar className="w-4 h-4 text-textColor-light" />
                </div>
                <p className="text-xs font-semibold text-textColor dark:text-textColor-dark mb-2">Actions rapides</p>
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {[
                    { icon: Utensils, label: "Repas", color: "bg-primary/10 text-primary" },
                    { icon: Heart, label: "Jeu", color: "bg-secondary/10 text-secondary" },
                    { icon: Scale, label: "Poids", color: "bg-accent/10 text-accent" },
                    { icon: Shield, label: "Vaccin", color: "bg-warning/10 text-warning" },
                    { icon: Stethoscope, label: "Sante", color: "bg-danger/10 text-danger" },
                    { icon: Clock, label: "Toilette", color: "bg-primary/10 text-primary" },
                    { icon: Activity, label: "Humeur", color: "bg-accent/10 text-accent" },
                    { icon: Bot, label: "Notes", color: "bg-primary/10 text-primary" },
                  ].map((a) => (
                    <div key={a.label} className="flex flex-col items-center gap-1">
                      <div className={`w-10 h-10 rounded-xl ${a.color} flex items-center justify-center`}>
                        <a.icon className="w-4 h-4" />
                      </div>
                      <span className="text-[9px] text-textColor-light dark:text-textColor-dark-light">{a.label}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs font-semibold text-textColor dark:text-textColor-dark mb-2">Historique du jour</p>
                <div className="space-y-2">
                  {[
                    { time: "08:30", text: "Croquettes - 50g", icon: Utensils },
                    { time: "09:15", text: "Jeu - 15 min", icon: Heart },
                    { time: "10:00", text: "Eau remplie 2x", icon: Activity },
                  ].map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <span className="text-textColor-light dark:text-textColor-dark-light w-10 text-[10px]">{h.time}</span>
                      <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                        <h.icon className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-textColor dark:text-textColor-dark">{h.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-4 text-sm font-bold text-textColor dark:text-textColor-dark">Suivi quotidien</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-4 py-16" id="how">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-4 py-1.5 rounded-full mb-4">
            Comment ca marche
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-textColor dark:text-textColor-dark tracking-tight">
            Simple comme bonjour
          </h2>
          <p className="text-textColor-light dark:text-textColor-dark-light mt-3 max-w-md mx-auto">
            En quelques etapes, offrez les meilleurs soins a votre compagnon.
          </p>
        </div>
        <div className="space-y-4 max-w-2xl mx-auto">
          {[
            { num: "1", text: "Creez le profil de votre animal avec ses informations" },
            { num: "2", text: "Prenez rendez-vous chez le veterinaire en ligne" },
            { num: "3", text: "Recevez des rappels et suivez la sante au quotidien" },
          ].map((step) => (
            <div
              key={step.num}
              className="flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-shadow"
            >
              <span className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-lg font-extrabold flex-shrink-0">
                {step.num}
              </span>
              <p className="text-base font-medium text-textColor dark:text-textColor-dark">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-4 py-1.5 rounded-full mb-4">
            Fonctionnalites
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-textColor dark:text-textColor-dark tracking-tight">
            Tout ce dont vous avez besoin
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-gray-100 dark:border-gray-700/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-textColor dark:text-textColor-dark mb-2">{feature.title}</h3>
              <p className="text-sm text-textColor-light dark:text-textColor-dark-light leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-4 py-1.5 rounded-full mb-4">
            Tarifs
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-textColor dark:text-textColor-dark tracking-tight">
            Des formules pour tous
          </h2>
          <p className="text-textColor-light dark:text-textColor-dark-light mt-3 max-w-md mx-auto">
            Commencez gratuitement et evoluez selon vos besoins.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {[
            { name: "Gratuit", price: "0", desc: "1 animal, suivi de base", icon: PawPrint, color: "bg-gray-100 dark:bg-gray-700 text-textColor-light" },
            { name: "Elementaire", price: "4.99", desc: "5 animaux, toutes les fonctionnalites", icon: Zap, color: "bg-primary/10 text-primary", popular: true },
            { name: "Premium", price: "9.99", desc: "Illimite, IA, export PDF", icon: Crown, color: "bg-warning/10 text-warning" },
          ].map((plan) => (
            <div
              key={plan.name}
              className={`bg-white dark:bg-surface-dark rounded-2xl p-6 border-2 text-center transition-all hover:shadow-lg ${
                plan.popular ? "border-primary shadow-lg shadow-primary/10" : "border-gray-100 dark:border-gray-700/50"
              }`}
            >
              {plan.popular && (
                <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-primary text-white text-[10px] font-bold mb-3">
                  <Star className="w-2.5 h-2.5" /> Populaire
                </span>
              )}
              <div className={`w-10 h-10 rounded-xl ${plan.color} flex items-center justify-center mx-auto mb-3`}>
                <plan.icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-textColor dark:text-textColor-dark">{plan.name}</h3>
              <div className="flex items-baseline justify-center gap-0.5 my-2">
                <span className="text-3xl font-extrabold text-textColor dark:text-textColor-dark">{plan.price}</span>
                {plan.price !== "0" && <span className="text-sm font-bold text-textColor dark:text-textColor-dark">EUR</span>}
                <span className="text-xs text-textColor-light dark:text-textColor-dark-light ml-1">{plan.price === "0" ? "gratuit" : "/mois"}</span>
              </div>
              <p className="text-xs text-textColor-light dark:text-textColor-dark-light">{plan.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/pricing">
            <Button variant="outline" className="!rounded-full !px-6">
              Voir tous les plans <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 py-16 text-center">
        <div className="bg-primary rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
              Pret a prendre soin de vos animaux ?
            </h2>
            <p className="text-white/80 mb-8 max-w-lg mx-auto">
              Rejoignez PetCare et offrez a vos compagnons les meilleurs soins possibles.
            </p>
            <Link href="/register">
              <Button variant="ghost" size="lg" className="!bg-white !text-primary hover:!bg-gray-50 !rounded-full !px-8 !font-bold">
                Creer un compte
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

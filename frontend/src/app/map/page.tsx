"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import PageContainer from "@/components/layout/PageContainer";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Badge from "@/components/ui/Badge";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  Search,
  MapPin,
  Star,
  Phone,
  Clock,
  Navigation,
  Stethoscope,
  Trees,
  Store,
  Pill,
  Scissors,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  User,
  X,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type PlaceCategory = "veterinaire" | "parc" | "animalerie" | "pharmacie" | "toiletteur";

interface Place {
  id: string;
  name: string;
  category: PlaceCategory;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  rating: number;
  reviewCount: number;
  openNow: boolean;
  hours: string;
  description: string;
  reviews: { author: string; rating: number; text: string; date: string }[];
}

// ---------------------------------------------------------------------------
// Category config
// ---------------------------------------------------------------------------

const CATEGORIES: {
  key: PlaceCategory | "all";
  label: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  dotColor: string;
}[] = [
  { key: "all", label: "Tous", icon: MapPin, color: "text-primary", bgColor: "bg-primary/10", dotColor: "#22c55e" },
  { key: "veterinaire", label: "Vétérinaires", icon: Stethoscope, color: "text-red-500", bgColor: "bg-red-500/10", dotColor: "#ef4444" },
  { key: "parc", label: "Parcs", icon: Trees, color: "text-emerald-500", bgColor: "bg-emerald-500/10", dotColor: "#10b981" },
  { key: "animalerie", label: "Animaleries", icon: Store, color: "text-blue-500", bgColor: "bg-blue-500/10", dotColor: "#3b82f6" },
  { key: "pharmacie", label: "Pharmacies", icon: Pill, color: "text-purple-500", bgColor: "bg-purple-500/10", dotColor: "#a855f7" },
  { key: "toiletteur", label: "Toiletteurs", icon: Scissors, color: "text-amber-500", bgColor: "bg-amber-500/10", dotColor: "#f59e0b" },
];

const categoryConfig = (cat: PlaceCategory) => CATEGORIES.find((c) => c.key === cat)!;

// ---------------------------------------------------------------------------
// Mock places (15+ realistic Parisian locations)
// ---------------------------------------------------------------------------

const MOCK_PLACES: Place[] = [
  {
    id: "v1",
    name: "Clinique Vétérinaire Saint-Germain",
    category: "veterinaire",
    address: "12 Rue de Seine, 75006 Paris",
    lat: 48.8546,
    lng: 2.3364,
    phone: "01 43 26 45 78",
    rating: 4.7,
    reviewCount: 128,
    openNow: true,
    hours: "Lun-Ven 9h-19h, Sam 9h-13h",
    description: "Clinique vétérinaire pluridisciplinaire avec équipements modernes. Consultations générales, chirurgie, imagerie médicale et urgences.",
    reviews: [
      { author: "Marie L.", rating: 5, text: "Equipe très attentionnée avec mon chat. Le Dr Dupont est formidable !", date: "2024-10-15" },
      { author: "Pierre M.", rating: 4, text: "Bon suivi pour mon chien, tarifs corrects pour Paris.", date: "2024-09-22" },
      { author: "Sophie R.", rating: 5, text: "Urgence prise en charge rapidement. Merci à toute l'équipe.", date: "2024-08-30" },
    ],
  },
  {
    id: "v2",
    name: "Cabinet Vétérinaire du Marais",
    category: "veterinaire",
    address: "34 Rue des Archives, 75004 Paris",
    lat: 48.8612,
    lng: 2.3558,
    phone: "01 42 78 12 34",
    rating: 4.5,
    reviewCount: 87,
    openNow: true,
    hours: "Lun-Ven 8h30-19h30, Sam 9h-12h",
    description: "Cabinet vétérinaire au coeur du Marais. Spécialiste NAC et animaux de compagnie.",
    reviews: [
      { author: "Lucas D.", rating: 5, text: "Excellent pour les NAC, mon lapin a été très bien soigné.", date: "2024-10-08" },
      { author: "Emma V.", rating: 4, text: "Accueil chaleureux, un peu d'attente parfois.", date: "2024-09-15" },
    ],
  },
  {
    id: "v3",
    name: "Vétérinaire Montmartre",
    category: "veterinaire",
    address: "8 Rue Lepic, 75018 Paris",
    lat: 48.8845,
    lng: 2.3324,
    phone: "01 46 06 89 12",
    rating: 4.3,
    reviewCount: 65,
    openNow: false,
    hours: "Lun-Ven 9h-18h",
    description: "Clinique de proximité à Montmartre. Consultations, vaccinations et petite chirurgie.",
    reviews: [
      { author: "Camille B.", rating: 4, text: "Vétérinaire très doux avec les animaux peureux.", date: "2024-10-01" },
      { author: "Thomas G.", rating: 5, text: "Suivi régulier impeccable pour mes deux chats.", date: "2024-08-20" },
    ],
  },
  {
    id: "p1",
    name: "Parc Canin des Buttes-Chaumont",
    category: "parc",
    address: "1 Rue Botzaris, 75019 Paris",
    lat: 48.8809,
    lng: 2.3826,
    phone: "01 48 03 83 10",
    rating: 4.6,
    reviewCount: 234,
    openNow: true,
    hours: "Tous les jours 7h-21h",
    description: "Grand espace vert avec zone dédiée aux chiens. Parcours d'agility, fontaines à eau et bancs.",
    reviews: [
      { author: "Julie A.", rating: 5, text: "Super parc pour les chiens ! Beaucoup d'espace et bien entretenu.", date: "2024-10-12" },
      { author: "Marc T.", rating: 4, text: "Très agréable, attention aux heures de pointe le weekend.", date: "2024-09-28" },
      { author: "Nadia K.", rating: 5, text: "Mon golden adore y aller, les autres propriétaires sont sympas.", date: "2024-09-10" },
    ],
  },
  {
    id: "p2",
    name: "Jardin du Luxembourg - Espace Canin",
    category: "parc",
    address: "Rue de Médicis, 75006 Paris",
    lat: 48.8462,
    lng: 2.3372,
    phone: "01 42 34 20 00",
    rating: 4.4,
    reviewCount: 178,
    openNow: true,
    hours: "Tous les jours 8h-20h30",
    description: "Zone canine dans le prestigieux Jardin du Luxembourg. Promenade encadrée, chiens en laisse obligatoire.",
    reviews: [
      { author: "Claire F.", rating: 4, text: "Cadre magnifique pour promener son chien, un peu strict sur les règles.", date: "2024-10-05" },
      { author: "Antoine R.", rating: 5, text: "Rien de mieux qu'une balade ici avec son compagnon.", date: "2024-09-18" },
    ],
  },
  {
    id: "p3",
    name: "Parc Monceau - Aire Canine",
    category: "parc",
    address: "35 Boulevard de Courcelles, 75008 Paris",
    lat: 48.8795,
    lng: 2.3089,
    phone: "01 42 27 08 64",
    rating: 4.2,
    reviewCount: 112,
    openNow: true,
    hours: "Tous les jours 7h-22h",
    description: "Espace canin dans le charmant Parc Monceau. Idéal pour les petites races.",
    reviews: [
      { author: "Isabelle M.", rating: 4, text: "Joli parc, espace canin un peu petit mais agréable.", date: "2024-10-02" },
      { author: "David L.", rating: 4, text: "Ambiance calme, parfait pour mon cavalier king charles.", date: "2024-09-25" },
    ],
  },
  {
    id: "a1",
    name: "Animalis - Rivoli",
    category: "animalerie",
    address: "56 Rue de Rivoli, 75004 Paris",
    lat: 48.8566,
    lng: 2.3515,
    phone: "01 42 77 56 90",
    rating: 4.1,
    reviewCount: 95,
    openNow: true,
    hours: "Lun-Sam 10h-20h, Dim 11h-18h",
    description: "Grande animalerie en plein centre de Paris. Alimentation, accessoires, aquariophilie et conseil.",
    reviews: [
      { author: "Pauline C.", rating: 4, text: "Large choix de produits, vendeurs compétents.", date: "2024-10-10" },
      { author: "Nicolas B.", rating: 4, text: "Un peu cher mais la qualité est au rendez-vous.", date: "2024-09-20" },
      { author: "Lea S.", rating: 5, text: "Rayon aquariophilie très complet !", date: "2024-08-15" },
    ],
  },
  {
    id: "a2",
    name: "Tom & Co - Bastille",
    category: "animalerie",
    address: "22 Boulevard Beaumarchais, 75011 Paris",
    lat: 48.8553,
    lng: 2.3681,
    phone: "01 43 38 67 21",
    rating: 4.3,
    reviewCount: 72,
    openNow: true,
    hours: "Lun-Sam 9h30-19h30",
    description: "Animalerie de quartier avec produits bio et naturels pour animaux. Service de livraison.",
    reviews: [
      { author: "Sarah J.", rating: 5, text: "Adore leur sélection de produits bio pour chiens !", date: "2024-10-07" },
      { author: "Mehdi A.", rating: 4, text: "Bon rapport qualité-prix, personnel agréable.", date: "2024-09-12" },
    ],
  },
  {
    id: "a3",
    name: "La Niche Parisienne",
    category: "animalerie",
    address: "15 Rue du Commerce, 75015 Paris",
    lat: 48.8467,
    lng: 2.2937,
    phone: "01 45 75 34 56",
    rating: 4.6,
    reviewCount: 54,
    openNow: false,
    hours: "Mar-Sam 10h-19h",
    description: "Boutique indépendante spécialisée dans les accessoires haut de gamme pour animaux.",
    reviews: [
      { author: "Véronique D.", rating: 5, text: "Boutique unique avec des produits qu'on ne trouve nulle part ailleurs.", date: "2024-10-11" },
      { author: "Jacques P.", rating: 4, text: "Jolies choses mais budget conséquent.", date: "2024-09-30" },
    ],
  },
  {
    id: "ph1",
    name: "Pharmacie des Animaux - Nation",
    category: "pharmacie",
    address: "45 Avenue de la République, 75011 Paris",
    lat: 48.8634,
    lng: 2.3783,
    phone: "01 43 79 22 11",
    rating: 4.4,
    reviewCount: 68,
    openNow: true,
    hours: "Lun-Ven 9h-19h30, Sam 9h-13h",
    description: "Pharmacie vétérinaire avec large gamme de médicaments, antiparasitaires et compléments alimentaires.",
    reviews: [
      { author: "Anne-Marie G.", rating: 5, text: "Très bons conseils, prix compétitifs sur les antiparasitaires.", date: "2024-10-09" },
      { author: "Frédéric H.", rating: 4, text: "Livraison rapide et produits toujours en stock.", date: "2024-09-14" },
    ],
  },
  {
    id: "ph2",
    name: "ParaPharma Véto - Opéra",
    category: "pharmacie",
    address: "8 Boulevard des Capucines, 75009 Paris",
    lat: 48.8706,
    lng: 2.3310,
    phone: "01 47 42 88 55",
    rating: 4.2,
    reviewCount: 43,
    openNow: true,
    hours: "Lun-Sam 8h30-20h",
    description: "Parapharmacie vétérinaire, produits de soin, hygiène et bien-être animal.",
    reviews: [
      { author: "Christine L.", rating: 4, text: "Bonne sélection de produits de soins naturels.", date: "2024-10-03" },
      { author: "Yann M.", rating: 4, text: "Emplacement pratique, équipe serviable.", date: "2024-09-08" },
    ],
  },
  {
    id: "t1",
    name: "Salon de Toilettage L'Atelier Canin",
    category: "toiletteur",
    address: "27 Rue de la Roquette, 75011 Paris",
    lat: 48.8548,
    lng: 2.3737,
    phone: "01 43 55 67 89",
    rating: 4.8,
    reviewCount: 156,
    openNow: true,
    hours: "Mar-Sam 9h-18h30",
    description: "Salon de toilettage haut de gamme. Bains, coupes, épilation et soins spécifiques par race.",
    reviews: [
      { author: "Sandrine T.", rating: 5, text: "Mon bichon est toujours magnifique en sortant ! Professionnel.", date: "2024-10-13" },
      { author: "Olivier F.", rating: 5, text: "Le seul toiletteur à qui je confie mon caniche.", date: "2024-09-26" },
      { author: "Maryline H.", rating: 5, text: "Démaillage parfait de mon berger australien.", date: "2024-09-05" },
    ],
  },
  {
    id: "t2",
    name: "Dog'Style Paris",
    category: "toiletteur",
    address: "5 Rue Daguerre, 75014 Paris",
    lat: 48.8335,
    lng: 2.3265,
    phone: "01 43 22 45 90",
    rating: 4.5,
    reviewCount: 98,
    openNow: false,
    hours: "Lun-Ven 10h-19h, Sam 10h-17h",
    description: "Toilettage créatif et classique. Spécialiste grandes races. Self-service disponible.",
    reviews: [
      { author: "Rémi N.", rating: 5, text: "Super résultat pour mon husky, et tarifs raisonnables.", date: "2024-10-06" },
      { author: "Amandine P.", rating: 4, text: "Bonne ambiance, mon chien est détendu ici.", date: "2024-09-19" },
    ],
  },
  {
    id: "t3",
    name: "Au Poil Près - Oberkampf",
    category: "toiletteur",
    address: "18 Rue Oberkampf, 75011 Paris",
    lat: 48.8649,
    lng: 2.3673,
    phone: "01 48 06 32 17",
    rating: 4.6,
    reviewCount: 82,
    openNow: true,
    hours: "Mar-Sam 9h30-19h",
    description: "Toilettage doux et respectueux de l'animal. Produits naturels et bio. Chiens et chats.",
    reviews: [
      { author: "Charlotte E.", rating: 5, text: "Approche très douce, mon chat stresse beaucoup moins ici.", date: "2024-10-04" },
      { author: "Benjamin W.", rating: 4, text: "Bon toilettage, produits de qualité utilisés.", date: "2024-09-21" },
    ],
  },
  {
    id: "v4",
    name: "Clinique Vétérinaire de la Bastille",
    category: "veterinaire",
    address: "3 Place de la Bastille, 75004 Paris",
    lat: 48.8531,
    lng: 2.3692,
    phone: "01 43 42 10 55",
    rating: 4.4,
    reviewCount: 102,
    openNow: true,
    hours: "Lun-Ven 8h-20h, Sam 9h-14h, Urgences 24h/24",
    description: "Clinique d'urgence ouverte 24h/24. Échographie, radiologie, laboratoire intégré.",
    reviews: [
      { author: "Fatima Z.", rating: 5, text: "Urgence nocturne prise en charge immédiatement. Excellent.", date: "2024-10-14" },
      { author: "Guillaume C.", rating: 4, text: "Très bien équipé, un peu d'attente aux heures de pointe.", date: "2024-09-17" },
    ],
  },
  {
    id: "p4",
    name: "Bois de Vincennes - Aire de Jeux Canine",
    category: "parc",
    address: "Route de la Tourelle, 75012 Paris",
    lat: 48.8316,
    lng: 2.4392,
    phone: "01 49 57 15 15",
    rating: 4.8,
    reviewCount: 310,
    openNow: true,
    hours: "Tous les jours - accès libre",
    description: "Immense espace vert avec aires de liberté pour chiens. Lac, sentiers et parcours d'agility.",
    reviews: [
      { author: "Christophe D.", rating: 5, text: "Le paradis pour les chiens en Île-de-France !", date: "2024-10-11" },
      { author: "Elise B.", rating: 5, text: "Très grand, idéal pour les chiens énergiques.", date: "2024-09-29" },
      { author: "Karim S.", rating: 4, text: "Superbe mais attention aux tiques en été.", date: "2024-08-25" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Default Paris coordinates (fallback)
// ---------------------------------------------------------------------------
const PARIS_LAT = 48.8566;
const PARIS_LNG = 2.3522;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function renderStars(rating: number) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.3;
  const stars: React.ReactNode[] = [];
  for (let i = 0; i < 5; i++) {
    if (i < full) {
      stars.push(<Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />);
    } else if (i === full && half) {
      stars.push(
        <span key={i} className="relative inline-block w-3.5 h-3.5">
          <Star className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600 absolute inset-0" />
          <span className="absolute inset-0 overflow-hidden w-[50%]">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          </span>
        </span>
      );
    } else {
      stars.push(<Star key={i} className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600" />);
    }
  }
  return stars;
}

// ---------------------------------------------------------------------------
// SVG Map Component
// ---------------------------------------------------------------------------

function CityMapSVG({
  places,
  selectedId,
  onSelect,
}: {
  places: Place[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  // Compute bounding box for placement
  const lats = places.map((p) => p.lat);
  const lngs = places.map((p) => p.lng);
  const minLat = Math.min(...lats) - 0.005;
  const maxLat = Math.max(...lats) + 0.005;
  const minLng = Math.min(...lngs) - 0.005;
  const maxLng = Math.max(...lngs) + 0.005;
  const toX = (lng: number) => 30 + ((lng - minLng) / (maxLng - minLng)) * 440;
  const toY = (lat: number) => 270 - ((lat - minLat) / (maxLat - minLat)) * 240;

  return (
    <svg
      viewBox="0 0 500 300"
      className="w-full rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/50"
      role="img"
      aria-label="Carte illustrative des lieux"
    >
      {/* Abstract city grid */}
      {/* Horizontal streets */}
      {[60, 110, 160, 210, 260].map((y) => (
        <line key={`h${y}`} x1="10" y1={y} x2="490" y2={y} stroke="currentColor" className="text-gray-200 dark:text-gray-700" strokeWidth="1" strokeDasharray="4 6" />
      ))}
      {/* Vertical streets */}
      {[80, 160, 250, 340, 420].map((x) => (
        <line key={`v${x}`} x1={x} y1="10" x2={x} y2="290" stroke="currentColor" className="text-gray-200 dark:text-gray-700" strokeWidth="1" strokeDasharray="4 6" />
      ))}

      {/* Decorative blocks */}
      {[
        { x: 20, y: 20, w: 50, h: 30 },
        { x: 90, y: 65, w: 60, h: 35 },
        { x: 170, y: 20, w: 70, h: 30 },
        { x: 260, y: 115, w: 70, h: 35 },
        { x: 350, y: 65, w: 60, h: 35 },
        { x: 430, y: 20, w: 50, h: 30 },
        { x: 90, y: 165, w: 60, h: 35 },
        { x: 350, y: 165, w: 60, h: 35 },
        { x: 170, y: 215, w: 70, h: 30 },
        { x: 430, y: 215, w: 50, h: 35 },
        { x: 20, y: 115, w: 50, h: 35 },
        { x: 260, y: 215, w: 70, h: 30 },
      ].map((b, i) => (
        <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} rx="4" className="fill-gray-100 dark:fill-gray-700/40" />
      ))}

      {/* River */}
      <path
        d="M0 155 Q80 140 160 155 T320 155 T500 150"
        fill="none"
        strokeWidth="8"
        className="stroke-blue-200 dark:stroke-blue-900/40"
        strokeLinecap="round"
      />

      {/* Place pins */}
      {places.map((place) => {
        const cx = toX(place.lng);
        const cy = toY(place.lat);
        const cat = categoryConfig(place.category);
        const isSelected = place.id === selectedId;
        return (
          <g
            key={place.id}
            onClick={() => onSelect(place.id)}
            className="cursor-pointer"
            role="button"
            aria-label={place.name}
          >
            {/* Pulse ring on selected */}
            {isSelected && (
              <circle cx={cx} cy={cy} r="14" fill={cat.dotColor} opacity="0.15">
                <animate attributeName="r" from="10" to="20" dur="1.2s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.2" to="0" dur="1.2s" repeatCount="indefinite" />
              </circle>
            )}
            {/* Pin shadow */}
            <circle cx={cx} cy={cy + 2} r={isSelected ? 8 : 6} fill="black" opacity="0.1" />
            {/* Pin */}
            <circle
              cx={cx}
              cy={cy}
              r={isSelected ? 8 : 6}
              fill={cat.dotColor}
              stroke="white"
              strokeWidth={isSelected ? 2.5 : 1.5}
              className="transition-all duration-200"
            />
            {/* Label on hover / selected */}
            {isSelected && (
              <g>
                <rect
                  x={cx - 50}
                  y={cy - 28}
                  width="100"
                  height="18"
                  rx="4"
                  className="fill-white dark:fill-gray-800"
                  stroke={cat.dotColor}
                  strokeWidth="1"
                />
                <text
                  x={cx}
                  y={cy - 16}
                  textAnchor="middle"
                  className="fill-gray-700 dark:fill-gray-200 text-[8px] font-medium"
                  style={{ fontSize: "8px" }}
                >
                  {place.name.length > 18 ? place.name.slice(0, 18) + "..." : place.name}
                </text>
              </g>
            )}
          </g>
        );
      })}

      {/* Legend */}
      {CATEGORIES.filter((c) => c.key !== "all").map((cat, i) => (
        <g key={cat.key} transform={`translate(15, ${12 + i * 14})`}>
          <circle cx="4" cy="4" r="3.5" fill={cat.dotColor} />
          <text x="12" y="7" className="fill-gray-500 dark:fill-gray-400" style={{ fontSize: "7px" }}>
            {cat.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function MapPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [userLat, setUserLat] = useState(PARIS_LAT);
  const [userLng, setUserLng] = useState(PARIS_LNG);
  const [geoLoaded, setGeoLoaded] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<PlaceCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"distance" | "rating" | "name">("distance");
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  // Auth guard
  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/login");
  }, [isAuthenticated, authLoading, router]);

  // Geolocation
  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLat(pos.coords.latitude);
          setUserLng(pos.coords.longitude);
          setGeoLoaded(true);
        },
        () => {
          // Fallback: use default Paris coords
          setGeoLoaded(true);
        },
        { timeout: 5000 }
      );
    } else {
      setGeoLoaded(true);
    }
  }, []);

  // Compute distances
  const placesWithDistance = useMemo(() => {
    return MOCK_PLACES.map((p) => ({
      ...p,
      distance: haversineDistance(userLat, userLng, p.lat, p.lng),
    }));
  }, [userLat, userLng]);

  // Filter + search + sort
  const filteredPlaces = useMemo(() => {
    let result = placesWithDistance;

    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case "distance":
        result = [...result].sort((a, b) => a.distance - b.distance);
        break;
      case "rating":
        result = [...result].sort((a, b) => b.rating - a.rating);
        break;
      case "name":
        result = [...result].sort((a, b) => a.name.localeCompare(b.name, "fr"));
        break;
    }

    return result;
  }, [placesWithDistance, selectedCategory, searchQuery, sortBy]);

  const handleSelectPin = useCallback((id: string) => {
    setHighlightedId(id);
    const place = MOCK_PLACES.find((p) => p.id === id) ?? null;
    if (place) {
      setSelectedPlace(place);
      setShowDetail(true);
    }
  }, []);

  const handleOpenPlace = (place: Place) => {
    setSelectedPlace(place);
    setHighlightedId(place.id);
    setShowDetail(true);
  };

  const handleItineraire = (address: string) => {
    const encoded = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encoded}`, "_blank");
  };

  if (authLoading) return <LoadingSpinner fullScreen />;
  if (!isAuthenticated) return null;

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-textColor dark:text-textColor-dark">Carte & Lieux</h1>
          <p className="text-sm text-textColor-light dark:text-textColor-dark-light mt-0.5">
            Trouvez les meilleurs services pour vos animaux
          </p>
        </div>
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <MapPin className="w-5 h-5 text-primary" />
        </div>
      </div>

      {/* SVG Map */}
      <Card className="mb-5 !p-3">
        <CityMapSVG
          places={filteredPlaces}
          selectedId={highlightedId}
          onSelect={handleSelectPin}
        />
        {!geoLoaded && (
          <p className="text-xs text-textColor-light dark:text-textColor-dark-light text-center mt-2">
            Localisation en cours...
          </p>
        )}
      </Card>

      {/* Search + Sort */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1">
          <Input
            placeholder="Rechercher un lieu..."
            icon={<Search className="w-4 h-4" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-36">
          <Select
            options={[
              { value: "distance", label: "Distance" },
              { value: "rating", label: "Note" },
              { value: "name", label: "Nom" },
            ]}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "distance" | "rating" | "name")}
          />
        </div>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1 -mx-1 px-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={cn(
              "flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all",
              selectedCategory === cat.key
                ? "bg-primary text-white shadow-sm"
                : "bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-700/50 text-textColor dark:text-textColor-dark hover:border-primary/30"
            )}
          >
            <cat.icon className="w-3.5 h-3.5" />
            {cat.label}
          </button>
        ))}
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-textColor dark:text-textColor-dark">
          {filteredPlaces.length} lieu{filteredPlaces.length !== 1 ? "x" : ""} trouvé{filteredPlaces.length !== 1 ? "s" : ""}
        </p>
        {selectedCategory !== "all" && (
          <button
            onClick={() => setSelectedCategory("all")}
            className="flex items-center gap-1 text-xs text-primary hover:underline"
          >
            <X className="w-3 h-3" />
            Réinitialiser le filtre
          </button>
        )}
      </div>

      {/* Place list */}
      {filteredPlaces.length === 0 ? (
        <Card className="text-center py-8">
          <MapPin className="w-8 h-8 text-textColor-light dark:text-textColor-dark-light mx-auto mb-2" />
          <p className="text-sm text-textColor-light dark:text-textColor-dark-light">
            Aucun lieu trouvé pour cette recherche
          </p>
          <p className="text-xs text-textColor-light dark:text-textColor-dark-light mt-1">
            Essayez de modifier vos filtres
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredPlaces.map((place) => {
            const cat = categoryConfig(place.category);
            const CatIcon = cat.icon;
            return (
              <Card
                key={place.id}
                className={cn(
                  "cursor-pointer hover:shadow-md transition-shadow",
                  highlightedId === place.id && "ring-2 ring-primary/50"
                )}
              >
                <div
                  onClick={() => handleOpenPlace(place)}
                  className="space-y-3"
                >
                  {/* Top row: name + badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", cat.bgColor)}>
                        <CatIcon className={cn("w-5 h-5", cat.color)} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-semibold text-textColor dark:text-textColor-dark truncate">
                          {place.name}
                        </h3>
                        <p className="text-xs text-textColor-light dark:text-textColor-dark-light mt-0.5 truncate">
                          {place.address}
                        </p>
                      </div>
                    </div>
                    <Badge variant={place.openNow ? "success" : "danger"} size="sm">
                      {place.openNow ? "Ouvert" : "Fermé"}
                    </Badge>
                  </div>

                  {/* Middle row: rating + distance */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center gap-0.5">{renderStars(place.rating)}</div>
                      <span className="text-xs font-medium text-textColor dark:text-textColor-dark">
                        {place.rating.toFixed(1)}
                      </span>
                      <span className="text-xs text-textColor-light dark:text-textColor-dark-light">
                        ({place.reviewCount} avis)
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-medium text-primary">
                      <Navigation className="w-3 h-3" />
                      {place.distance < 1
                        ? `${Math.round(place.distance * 1000)} m`
                        : `${place.distance.toFixed(1)} km`}
                    </div>
                  </div>

                  {/* Bottom row: hours + phone + arrow */}
                  <div className="flex items-center justify-between text-xs text-textColor-light dark:text-textColor-dark-light">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {place.hours.split(",")[0]}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {place.phone}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>

                {/* Itineraire button */}
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/50">
                  <Button
                    variant="outline"
                    size="sm"
                    fullWidth
                    onClick={(e) => {
                      e.stopPropagation();
                      handleItineraire(place.address);
                    }}
                  >
                    <ExternalLink className="w-3.5 h-3.5 mr-2" />
                    Itinéraire
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      <Modal
        isOpen={showDetail}
        onClose={() => {
          setShowDetail(false);
          setHighlightedId(null);
        }}
        title={selectedPlace?.name ?? "Détails"}
        size="lg"
      >
        {selectedPlace && (() => {
          const cat = categoryConfig(selectedPlace.category);
          const CatIcon = cat.icon;
          const dist = haversineDistance(userLat, userLng, selectedPlace.lat, selectedPlace.lng);
          return (
            <div className="space-y-5">
              {/* Header */}
              <div className="flex items-start gap-4">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0", cat.bgColor)}>
                  <CatIcon className={cn("w-7 h-7", cat.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={selectedPlace.openNow ? "success" : "danger"} size="md">
                      {selectedPlace.openNow ? "Ouvert" : "Fermé"}
                    </Badge>
                    <Badge variant="primary" size="md">
                      {cat.label.replace(/s$/, "")}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <div className="flex items-center gap-0.5">{renderStars(selectedPlace.rating)}</div>
                    <span className="text-sm font-semibold text-textColor dark:text-textColor-dark">
                      {selectedPlace.rating.toFixed(1)}
                    </span>
                    <span className="text-xs text-textColor-light dark:text-textColor-dark-light">
                      ({selectedPlace.reviewCount} avis)
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-textColor dark:text-textColor-dark leading-relaxed">
                {selectedPlace.description}
              </p>

              {/* Info grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                  <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-textColor-light dark:text-textColor-dark-light mb-0.5">Adresse</p>
                    <p className="text-sm text-textColor dark:text-textColor-dark">{selectedPlace.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                  <Navigation className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-textColor-light dark:text-textColor-dark-light mb-0.5">Distance</p>
                    <p className="text-sm text-textColor dark:text-textColor-dark">
                      {dist < 1 ? `${Math.round(dist * 1000)} m` : `${dist.toFixed(1)} km`}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                  <Clock className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-textColor-light dark:text-textColor-dark-light mb-0.5">Horaires</p>
                    <p className="text-sm text-textColor dark:text-textColor-dark">{selectedPlace.hours}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                  <Phone className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-textColor-light dark:text-textColor-dark-light mb-0.5">Téléphone</p>
                    <p className="text-sm text-textColor dark:text-textColor-dark">{selectedPlace.phone}</p>
                  </div>
                </div>
              </div>

              {/* Photos placeholder */}
              <div>
                <h4 className="text-sm font-semibold text-textColor dark:text-textColor-dark mb-2">Photos</h4>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-24 h-24 rounded-xl bg-gray-100 dark:bg-gray-700/50 flex-shrink-0 flex items-center justify-center"
                    >
                      <CatIcon className={cn("w-8 h-8", cat.color, "opacity-30")} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews */}
              <div>
                <h4 className="text-sm font-semibold text-textColor dark:text-textColor-dark mb-3 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4" />
                  Avis ({selectedPlace.reviews.length})
                </h4>
                <div className="space-y-3">
                  {selectedPlace.reviews.map((review, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="w-3.5 h-3.5 text-primary" />
                          </div>
                          <span className="text-sm font-medium text-textColor dark:text-textColor-dark">
                            {review.author}
                          </span>
                        </div>
                        <span className="text-xs text-textColor-light dark:text-textColor-dark-light">
                          {new Date(review.date).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-0.5 mb-1.5">
                        {renderStars(review.rating)}
                      </div>
                      <p className="text-sm text-textColor dark:text-textColor-dark leading-relaxed">
                        {review.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <Button
                  fullWidth
                  onClick={() => handleItineraire(selectedPlace.address)}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Itinéraire
                </Button>
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => {
                    window.open(`tel:${selectedPlace.phone.replace(/\s/g, "")}`, "_self");
                  }}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Appeler
                </Button>
              </div>
            </div>
          );
        })()}
      </Modal>
    </PageContainer>
  );
}

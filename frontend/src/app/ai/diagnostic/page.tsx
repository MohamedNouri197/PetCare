"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useAnimals } from "@/hooks/useAnimals";
import type { Animal } from "@/types";
import { cn } from "@/lib/utils";
import PageContainer from "@/components/layout/PageContainer";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  Camera,
  Upload,
  Search,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RotateCcw,
  PawPrint,
  Image as ImageIcon,
  Trash2,
  Clock,
  ShieldAlert,
  Activity,
  FileText,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface DiagnosticCondition {
  name: string;
  confidence: number;
  severity: "Faible" | "Modere" | "Eleve";
  description: string;
  actions: string[];
  keywords: string[];
}

interface AnalysisResult {
  id: string;
  animalName: string;
  animalId: string;
  photoName: string;
  photoUrl: string;
  condition: DiagnosticCondition;
  date: string;
}

// ---------------------------------------------------------------------------
// Mock AI conditions database
// ---------------------------------------------------------------------------

const CONDITIONS: DiagnosticCondition[] = [
  {
    name: "Dermatite allergique",
    confidence: 87,
    severity: "Modere",
    description:
      "Inflammation cutanee provoquee par une reaction allergique. Les zones touchees presentent des rougeurs, des demangeaisons et parfois des croutes. Les allergenes courants incluent les acariens, le pollen et certains aliments.",
    actions: [
      "Consulter un veterinaire pour identifier l'allergene en cause",
      "Appliquer un baume apaisant adapte aux animaux sur les zones irritees",
      "Eviter les allergenes connus et adapter l'alimentation si necessaire",
      "Surveiller l'evolution des lesions sur les prochaines 48 heures",
    ],
    keywords: ["peau", "skin", "rougeur", "allergie", "gratte", "demangeaison", "dermatite"],
  },
  {
    name: "Conjonctivite",
    confidence: 91,
    severity: "Modere",
    description:
      "Inflammation de la conjonctive de l'oeil caracterisee par des rougeurs, un larmoiement excessif et parfois un ecoulement purulent. Peut etre d'origine bacterienne, virale ou allergique.",
    actions: [
      "Nettoyer delicatement les yeux avec du serum physiologique sterile",
      "Eviter que l'animal ne se frotte les yeux (collerette si necessaire)",
      "Consulter un veterinaire pour un traitement adapte (collyre antibiotique)",
      "Surveiller l'apparition de signes d'aggravation (oeil ferme, douleur)",
    ],
    keywords: ["oeil", "eye", "yeux", "rouge", "larme", "conjonctivite", "ecoulement"],
  },
  {
    name: "Otite externe",
    confidence: 84,
    severity: "Modere",
    description:
      "Infection du conduit auditif externe, tres frequente chez les chiens a oreilles tombantes. Se manifeste par des secouements de tete, un grattage des oreilles et une odeur desagreable.",
    actions: [
      "Ne pas introduire de coton-tige dans le conduit auditif",
      "Nettoyer l'oreille avec un nettoyant auriculaire veterinaire",
      "Consulter un veterinaire pour un traitement antifongique ou antibiotique",
      "Secher les oreilles apres chaque bain ou baignade",
    ],
    keywords: ["oreille", "ear", "otite", "gratte", "secoue", "tete"],
  },
  {
    name: "Plaie superficielle",
    confidence: 78,
    severity: "Faible",
    description:
      "Blessure cutanee peu profonde sans atteinte des tissus sous-jacents. Necessite un nettoyage et une surveillance pour prevenir une infection secondaire.",
    actions: [
      "Nettoyer la plaie avec du serum physiologique ou de la chlorhexidine diluee",
      "Appliquer un pansement protecteur si l'animal risque de lecher la zone",
      "Verifier l'absence de corps etranger dans la plaie",
      "Consulter un veterinaire si la plaie ne cicatrise pas sous 3 a 5 jours",
    ],
    keywords: ["plaie", "wound", "blessure", "coupe", "coupure", "sang", "blood"],
  },
  {
    name: "Teigne (Dermatophytose)",
    confidence: 82,
    severity: "Eleve",
    description:
      "Infection fongique de la peau provoquant des zones circulaires depilees avec des squames. Tres contagieuse entre animaux et transmissible a l'homme (zoonose).",
    actions: [
      "Isoler l'animal des autres animaux et limiter les contacts humains",
      "Consulter un veterinaire en urgence pour un traitement antifongique",
      "Desinfecter l'environnement de l'animal (literie, brosses, coussins)",
      "Ne pas arreter le traitement avant la fin prescrite, meme si amelioration",
    ],
    keywords: ["teigne", "champignon", "depile", "circulaire", "fungus", "ringworm", "poil"],
  },
  {
    name: "Hotspot (Dermatite pyotraumatique)",
    confidence: 89,
    severity: "Modere",
    description:
      "Lesion cutanee suintante et douloureuse causee par un lechage ou grattage excessif. Evolue rapidement et necessite un traitement rapide pour eviter l'extension.",
    actions: [
      "Tondre les poils autour de la lesion pour favoriser l'aeration",
      "Nettoyer la zone avec un antiseptique doux et laisser secher",
      "Poser une collerette pour empecher le lechage de la zone",
      "Consulter un veterinaire pour un traitement anti-inflammatoire et antibiotique",
    ],
    keywords: ["hotspot", "suintant", "lechage", "leche", "mouille", "croute", "plaque"],
  },
  {
    name: "Abces cutane",
    confidence: 76,
    severity: "Eleve",
    description:
      "Collection de pus sous la peau formant une masse chaude et douloureuse, souvent suite a une morsure ou une griffure. Necessite generalement un drainage veterinaire.",
    actions: [
      "Ne pas tenter de percer ou presser l'abces soi-meme",
      "Appliquer des compresses tiedes pour favoriser la maturation",
      "Consulter un veterinaire rapidement pour un drainage et un traitement antibiotique",
      "Surveiller la temperature de l'animal (fievre possible)",
    ],
    keywords: ["abces", "bosse", "gonfle", "morsure", "griffure", "pus", "abscess", "bump"],
  },
  {
    name: "Gale (Sarcoptes)",
    confidence: 80,
    severity: "Eleve",
    description:
      "Infestation parasitaire causee par des acariens qui creusent des galeries sous la peau. Provoque des demangeaisons intenses, surtout la nuit, et des croutes epaisses.",
    actions: [
      "Isoler l'animal des autres animaux immediatement",
      "Consulter un veterinaire en urgence pour un traitement acaricide",
      "Traiter l'environnement et tous les animaux en contact",
      "Se laver les mains apres chaque manipulation (zoonose possible)",
    ],
    keywords: ["gale", "acarien", "parasite", "demangeaison", "croute", "nuit", "mange", "scabies"],
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function matchCondition(fileName: string): DiagnosticCondition {
  const lower = fileName.toLowerCase();
  for (const condition of CONDITIONS) {
    if (condition.keywords.some((kw) => lower.includes(kw))) {
      return {
        ...condition,
        confidence: condition.confidence + Math.floor(Math.random() * 6) - 3, // +/- 3
      };
    }
  }
  // Random pick with random confidence between 75-95
  const pick = CONDITIONS[Math.floor(Math.random() * CONDITIONS.length)];
  return {
    ...pick,
    confidence: 75 + Math.floor(Math.random() * 21),
  };
}

function severityVariant(severity: string): "success" | "warning" | "danger" {
  if (severity === "Faible") return "success";
  if (severity === "Modere") return "warning";
  return "danger";
}

function severityIcon(severity: string) {
  if (severity === "Faible") return CheckCircle;
  if (severity === "Modere") return AlertTriangle;
  return XCircle;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function DiagnosticPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { animals, isLoading: animalsLoading } = useAnimals();
  const router = useRouter();

  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auth guard
  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/login");
  }, [isAuthenticated, authLoading, router]);

  // Auto-select first animal
  useEffect(() => {
    if (animals.length > 0 && !selectedAnimal) {
      setSelectedAnimal(animals[0]);
    }
  }, [animals, selectedAnimal]);

  // Handle file selection
  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    setPhotoFile(file);
    setCurrentResult(null);
    const reader = new FileReader();
    reader.onload = (e) => setPhotoPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  // Simulated AI analysis with progressive loading
  const runAnalysis = useCallback(async () => {
    if (!photoFile || !selectedAnimal) return;

    setIsAnalyzing(true);
    setProgress(0);
    setProgressLabel("Preparation de l'image...");

    const steps = [
      { target: 20, label: "Preparation de l'image..." },
      { target: 45, label: "Analyse des structures visuelles..." },
      { target: 65, label: "Detection des anomalies..." },
      { target: 80, label: "Classification de la pathologie..." },
      { target: 95, label: "Generation du rapport..." },
      { target: 100, label: "Analyse terminee" },
    ];

    for (const step of steps) {
      await new Promise((resolve) => setTimeout(resolve, 350 + Math.random() * 400));
      setProgress(step.target);
      setProgressLabel(step.label);
    }

    await new Promise((resolve) => setTimeout(resolve, 300));

    const condition = matchCondition(photoFile.name);
    const result: AnalysisResult = {
      id: Date.now().toString(36),
      animalName: selectedAnimal.name,
      animalId: selectedAnimal.id,
      photoName: photoFile.name,
      photoUrl: photoPreview || "",
      condition,
      date: new Date().toLocaleString("fr-FR"),
    };

    setCurrentResult(result);
    setHistory((prev) => [result, ...prev]);
    setIsAnalyzing(false);
  }, [photoFile, selectedAnimal, photoPreview]);

  // Reset for new analysis
  const resetAnalysis = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    setCurrentResult(null);
    setProgress(0);
    setProgressLabel("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Loading / auth states
  if (authLoading || animalsLoading) return <LoadingSpinner fullScreen />;
  if (!isAuthenticated) return null;

  const SeverityIcon = currentResult ? severityIcon(currentResult.condition.severity) : AlertTriangle;

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-textColor dark:text-textColor-dark">
            Diagnostic IA
          </h1>
          <p className="text-sm text-textColor-light dark:text-textColor-dark-light mt-0.5">
            Analysez une photo pour detecter d&apos;eventuelles pathologies
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Activity className="w-5 h-5 text-primary" />
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

      {/* Single animal display */}
      {animals.length === 1 && selectedAnimal && (
        <Card className="mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold text-sm">
                {selectedAnimal.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm font-bold text-textColor dark:text-textColor-dark">
                {selectedAnimal.name}
              </p>
              <p className="text-xs text-textColor-light dark:text-textColor-dark-light">
                {selectedAnimal.species} &middot; {selectedAnimal.breed}
              </p>
            </div>
          </div>
        </Card>
      )}

      {selectedAnimal && (
        <>
          {/* Photo Upload Zone */}
          {!currentResult && !isAnalyzing && (
            <Card className="mb-5">
              <h3 className="text-sm font-semibold text-textColor dark:text-textColor-dark mb-3">
                <Camera className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
                Photo a analyser
              </h3>

              {!photoPreview ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all",
                    isDragging
                      ? "border-primary bg-primary/5 scale-[1.02]"
                      : "border-gray-200 dark:border-gray-600 hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  )}
                >
                  <Upload className="w-10 h-10 text-textColor-light dark:text-textColor-dark-light mx-auto mb-3" />
                  <p className="text-sm font-medium text-textColor dark:text-textColor-dark">
                    Glissez une photo ici ou cliquez pour parcourir
                  </p>
                  <p className="text-xs text-textColor-light dark:text-textColor-dark-light mt-1">
                    JPG, PNG ou WEBP &middot; Peau, yeux, oreilles, plaies...
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Image Preview */}
                  <div className="relative rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700/50">
                    <img
                      src={photoPreview}
                      alt="Photo a analyser"
                      className="w-full max-h-64 object-contain bg-gray-50 dark:bg-gray-800/50"
                    />
                    <button
                      onClick={resetAnalysis}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-sm"
                    >
                      <Trash2 className="w-4 h-4 text-danger" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-textColor-light dark:text-textColor-dark-light">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span className="truncate">{photoFile?.name}</span>
                  </div>

                  {/* Analyze button */}
                  <Button fullWidth onClick={runAnalysis}>
                    <Search className="w-4 h-4 mr-2" />
                    Analyser la photo
                  </Button>
                </div>
              )}
            </Card>
          )}

          {/* Analysis Progress */}
          {isAnalyzing && (
            <Card className="mb-5">
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Search className="w-7 h-7 text-primary" />
                </div>
                <p className="text-sm font-semibold text-textColor dark:text-textColor-dark mb-1">
                  Analyse en cours...
                </p>
                <p className="text-xs text-textColor-light dark:text-textColor-dark-light mb-4">
                  {progressLabel}
                </p>

                {/* Progress bar */}
                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-textColor-light dark:text-textColor-dark-light mt-2">
                  {progress}%
                </p>
              </div>
            </Card>
          )}

          {/* Results */}
          {currentResult && (
            <div className="space-y-4 mb-5">
              {/* Main result card */}
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-textColor dark:text-textColor-dark">
                    Resultat de l&apos;analyse
                  </h3>
                  <Badge variant={severityVariant(currentResult.condition.severity)} size="md">
                    <SeverityIcon className="w-3.5 h-3.5 mr-1" />
                    {currentResult.condition.severity}
                  </Badge>
                </div>

                {/* Condition name + confidence */}
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mb-4">
                  <p className="text-lg font-bold text-textColor dark:text-textColor-dark mb-1">
                    {currentResult.condition.name}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-primary h-1.5 rounded-full"
                        style={{ width: `${currentResult.condition.confidence}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-primary">
                      {currentResult.condition.confidence}% confiance
                    </span>
                  </div>
                </div>

                {/* Photo thumbnail */}
                <div className="flex gap-3 mb-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100 dark:border-gray-700/50">
                    <img
                      src={currentResult.photoUrl}
                      alt="Photo analysee"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-textColor dark:text-textColor-dark mb-0.5">
                      {currentResult.animalName}
                    </p>
                    <p className="text-xs text-textColor-light dark:text-textColor-dark-light">
                      {currentResult.date}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-textColor dark:text-textColor-dark mb-1.5 uppercase tracking-wider">
                    Description
                  </h4>
                  <p className="text-sm text-textColor-light dark:text-textColor-dark-light leading-relaxed">
                    {currentResult.condition.description}
                  </p>
                </div>

                {/* Recommended actions */}
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-textColor dark:text-textColor-dark mb-2 uppercase tracking-wider">
                    Actions recommandees
                  </h4>
                  <div className="space-y-2">
                    {currentResult.condition.actions.map((action, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 text-sm text-textColor-light dark:text-textColor-dark-light"
                      >
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>{action}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Veterinary disclaimer */}
                <div className="flex items-start gap-3 p-3 rounded-xl bg-warning/10 border border-warning/20">
                  <ShieldAlert className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-warning mb-0.5">
                      Consulter un veterinaire
                    </p>
                    <p className="text-xs text-textColor-light dark:text-textColor-dark-light leading-relaxed">
                      Ce diagnostic est genere par une intelligence artificielle a titre informatif
                      uniquement. Il ne remplace en aucun cas l&apos;avis d&apos;un professionnel
                      veterinaire. En cas de doute, consultez votre veterinaire.
                    </p>
                  </div>
                </div>
              </Card>

              {/* New analysis button */}
              <Button fullWidth variant="outline" onClick={resetAnalysis}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Nouvelle analyse
              </Button>
            </div>
          )}

          {/* Session history */}
          {history.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-textColor dark:text-textColor-dark mb-3">
                <Clock className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
                Historique de la session ({history.length})
              </h3>
              <div className="space-y-2">
                {history.map((item) => {
                  const ItemSeverityIcon = severityIcon(item.condition.severity);
                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-700/50"
                    >
                      <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100 dark:border-gray-700/50">
                        <img
                          src={item.photoUrl}
                          alt={item.condition.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-textColor dark:text-textColor-dark truncate">
                          {item.condition.name}
                        </p>
                        <p className="text-xs text-textColor-light dark:text-textColor-dark-light">
                          {item.animalName} &middot; {item.date}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs font-medium text-primary">
                          {item.condition.confidence}%
                        </span>
                        <Badge variant={severityVariant(item.condition.severity)} size="sm">
                          <ItemSeverityIcon className="w-3 h-3 mr-0.5" />
                          {item.condition.severity}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Empty state when no history and no current analysis */}
          {history.length === 0 && !currentResult && !isAnalyzing && !photoPreview && (
            <Card className="text-center py-8">
              <FileText className="w-8 h-8 text-textColor-light dark:text-textColor-dark-light mx-auto mb-2" />
              <p className="text-sm text-textColor-light dark:text-textColor-dark-light">
                Aucune analyse effectuee
              </p>
              <p className="text-xs text-textColor-light dark:text-textColor-dark-light mt-1">
                Importez une photo pour commencer le diagnostic
              </p>
            </Card>
          )}
        </>
      )}

      {/* No animals state */}
      {animals.length === 0 && !animalsLoading && (
        <Card className="text-center py-8">
          <PawPrint className="w-8 h-8 text-textColor-light dark:text-textColor-dark-light mx-auto mb-2" />
          <p className="text-sm text-textColor-light dark:text-textColor-dark-light">
            Aucun animal enregistre
          </p>
          <p className="text-xs text-textColor-light dark:text-textColor-dark-light mt-1 mb-4">
            Ajoutez un animal pour utiliser le diagnostic IA
          </p>
          <Button variant="primary" onClick={() => router.push("/animals")}>
            Ajouter un animal
          </Button>
        </Card>
      )}
    </PageContainer>
  );
}

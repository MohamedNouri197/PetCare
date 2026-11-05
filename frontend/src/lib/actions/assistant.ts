"use server";

interface ConditionMatch {
  name: string;
  description: string;
  severity: "Leger" | "Modere" | "Severe";
  recommendations: string[];
}

const SYMPTOM_CONDITIONS: Record<string, ConditionMatch> = {
  vomissements: {
    name: "Gastrite ou intolerance alimentaire",
    description: "Les vomissements peuvent indiquer une irritation gastrique, une intolerance alimentaire ou l'ingestion d'un corps etranger.",
    severity: "Modere",
    recommendations: [
      "Mettre a jeun pendant 12 a 24 heures",
      "Proposer de l'eau en petites quantites",
      "Reprendre l'alimentation avec un regime doux (riz + poulet cuit)",
      "Consulter un veterinaire si les vomissements persistent plus de 24h",
    ],
  },
  lethargie: {
    name: "Infection ou maladie systemique",
    description: "La lethargie peut etre le signe d'une infection virale ou bacterienne, d'une douleur chronique ou d'un desequilibre metabolique.",
    severity: "Modere",
    recommendations: [
      "Verifier la temperature rectale (normale : 38-39°C)",
      "Observer l'appetit et la consommation d'eau",
      "Surveiller les autres symptomes associes",
      "Consulter un veterinaire si la lethargie dure plus de 48h",
    ],
  },
  toux: {
    name: "Bronchite ou infection respiratoire",
    description: "La toux peut etre causee par une infection des voies respiratoires, une allergie ou, chez le chien, la toux de chenil.",
    severity: "Modere",
    recommendations: [
      "Eviter l'exposition au froid et a la fumee",
      "Maintenir l'animal au repos",
      "Humidifier l'air ambiant",
      "Consulter un veterinaire si la toux persiste plus de 3 jours",
    ],
  },
  diarrhee: {
    name: "Intolerance alimentaire ou infection digestive",
    description: "La diarrhee peut resulter d'un changement alimentaire brusque, d'une infection parasitaire ou d'un stress.",
    severity: "Modere",
    recommendations: [
      "Assurer une hydratation suffisante",
      "Proposer une alimentation legere (riz, poulet bouilli)",
      "Eviter les friandises et la nourriture humaine",
      "Consulter si la diarrhee contient du sang ou dure plus de 48h",
    ],
  },
  "perte appetit": {
    name: "Stress ou affection sous-jacente",
    description: "La perte d'appetit peut etre liee a un stress, une douleur dentaire, une maladie digestive ou un changement d'environnement.",
    severity: "Leger",
    recommendations: [
      "Proposer une nourriture plus appetente (patee, nourriture tiede)",
      "Verifier l'etat des dents et des gencives",
      "Maintenir un environnement calme",
      "Consulter si l'anorexie dure plus de 2 jours",
    ],
  },
  boiterie: {
    name: "Entorse ou lesion articulaire",
    description: "La boiterie peut etre causee par une entorse, une fracture, une luxation ou de l'arthrose chez les animaux ages.",
    severity: "Modere",
    recommendations: [
      "Limiter l'activite physique et les sauts",
      "Appliquer du froid sur la zone douloureuse (10 min max)",
      "Observer si l'animal pose la patte ou non",
      "Consulter un veterinaire pour un examen et eventuellement une radiographie",
    ],
  },
  grattage: {
    name: "Allergie ou dermatite",
    description: "Le grattage excessif peut indiquer une allergie (alimentaire, environnementale), des parasites (puces, acariens) ou une dermatite.",
    severity: "Leger",
    recommendations: [
      "Verifier la presence de puces ou de rougeurs sur la peau",
      "Appliquer un traitement antiparasitaire si necessaire",
      "Eviter les allergenes connus",
      "Consulter pour un test allergique si le grattage est chronique",
    ],
  },
  "perte poils": {
    name: "Carence nutritionnelle ou trouble hormonal",
    description: "La perte de poils anormale peut etre liee a une carence en vitamines, un desequilibre hormonal (hypothyroidie) ou une infection fongique.",
    severity: "Leger",
    recommendations: [
      "Verifier la qualite de l'alimentation (acides gras omega-3/6)",
      "Brosser regulierement le pelage",
      "Observer si la perte est localisee ou generalisee",
      "Consulter pour un bilan sanguin si la perte est importante",
    ],
  },
  "yeux rouges": {
    name: "Conjonctivite",
    description: "Les yeux rouges peuvent indiquer une conjonctivite infectieuse, allergique ou traumatique. Un ecoulement peut etre present.",
    severity: "Modere",
    recommendations: [
      "Nettoyer les yeux avec du serum physiologique",
      "Eviter que l'animal ne se gratte les yeux",
      "Ne pas utiliser de collyre humain sans avis veterinaire",
      "Consulter rapidement si l'oeil est ferme ou si l'ecoulement est purulent",
    ],
  },
  eternuements: {
    name: "Rhinite ou allergie respiratoire",
    description: "Les eternuements repetitifs peuvent etre causes par une rhinite virale, une allergie aux poussieres ou pollens, ou un corps etranger nasal.",
    severity: "Leger",
    recommendations: [
      "Verifier la presence d'ecoulement nasal",
      "Eliminer les sources de poussiere et de parfum",
      "Maintenir un environnement propre et aere",
      "Consulter si les eternuements s'accompagnent de sang ou de fievre",
    ],
  },
};

export async function analyzeSymptoms(
  symptoms: string[],
  animalInfo?: { name: string; species: string },
  additionalInfo?: string
): Promise<string> {
  const matches: ConditionMatch[] = [];

  for (const symptom of symptoms) {
    const key = symptom.toLowerCase();
    for (const [trigger, condition] of Object.entries(SYMPTOM_CONDITIONS)) {
      if (key.includes(trigger) || trigger.includes(key)) {
        if (!matches.find((m) => m.name === condition.name)) {
          matches.push(condition);
        }
      }
    }
  }

  if (matches.length === 0) {
    matches.push({
      name: "Symptomes non specifiques",
      description: "Les symptomes decrits ne correspondent pas a un diagnostic precis dans notre base. Une consultation veterinaire est recommandee pour un examen approfondi.",
      severity: "Modere",
      recommendations: [
        "Surveiller l'evolution des symptomes",
        "Noter la frequence et l'intensite",
        "Prendre rendez-vous avec votre veterinaire",
      ],
    });
  }

  const animalLabel = animalInfo
    ? `${animalInfo.name} (${animalInfo.species})`
    : "votre animal";

  let response = `**Analyse des symptomes pour ${animalLabel}**\n`;
  response += `Symptomes observes : ${symptoms.join(", ")}\n\n`;

  if (additionalInfo) {
    response += `Informations complementaires : ${additionalInfo}\n\n`;
  }

  const maxSeverity = matches.some((m) => m.severity === "Severe")
    ? "Severe"
    : matches.some((m) => m.severity === "Modere")
      ? "Modere"
      : "Leger";

  response += `**Niveau de severite global : ${maxSeverity}**\n\n`;

  for (const match of matches) {
    response += `---\n`;
    response += `**${match.name}** (Severite : ${match.severity})\n`;
    response += `${match.description}\n\n`;
    response += `Recommandations :\n`;
    for (const rec of match.recommendations) {
      response += `- ${rec}\n`;
    }
    response += `\n`;
  }

  response += `---\n`;
  response += `⚠️ **Avertissement** : Cette analyse est generee automatiquement a titre informatif. `;
  response += `Elle ne remplace en aucun cas un diagnostic veterinaire professionnel. `;
  response += `En cas d'urgence ou de symptomes graves, contactez immediatement votre veterinaire.`;

  return response;
}

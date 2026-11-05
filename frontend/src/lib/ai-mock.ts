import type { Animal } from "@/types";

interface SymptomAnalysis {
  condition: string;
  severity: "low" | "moderate" | "high";
  description: string;
  recommendations: string[];
  urgency: string;
}

const SYMPTOM_DATABASE: Record<string, SymptomAnalysis[]> = {
  vomiting: [
    {
      condition: "Gastrite aigue",
      severity: "moderate",
      description: "Les vomissements peuvent indiquer une inflammation de l'estomac, souvent causee par l'ingestion d'aliments inadaptes ou de corps etrangers.",
      recommendations: [
        "Mettez votre animal a la diete pendant 12 a 24 heures",
        "Proposez de petites quantites d'eau regulierement",
        "Reintroduisez progressivement une alimentation legere (riz, poulet bouilli)",
        "Si les vomissements persistent plus de 24h, consultez un veterinaire",
      ],
      urgency: "Consultez un veterinaire si les vomissements contiennent du sang ou persistent plus de 24 heures.",
    },
  ],
  diarrhea: [
    {
      condition: "Troubles digestifs",
      severity: "moderate",
      description: "La diarrhee peut etre causee par un changement alimentaire, du stress, des parasites ou une infection intestinale.",
      recommendations: [
        "Assurez une hydratation suffisante",
        "Proposez une alimentation legere et facilement digestible",
        "Surveillez la frequence et la consistance des selles",
        "Un traitement antiparasitaire peut etre necessaire",
      ],
      urgency: "Consultez rapidement si la diarrhee est sanglante ou si votre animal est abattu.",
    },
  ],
  loss_appetite: [
    {
      condition: "Anorexie",
      severity: "moderate",
      description: "La perte d'appetit peut avoir de nombreuses causes : stress, douleur dentaire, maladie systemique ou changement d'environnement.",
      recommendations: [
        "Verifiez la temperature de votre animal (normale : 38-39°C)",
        "Proposez des aliments appetants et tiedes",
        "Observez s'il y a d'autres symptomes associes",
        "Si la perte d'appetit depasse 48h, consultez un veterinaire",
      ],
      urgency: "Chez les jeunes animaux, une perte d'appetit de plus de 24h necessite une consultation.",
    },
  ],
  lethargy: [
    {
      condition: "Fatigue pathologique",
      severity: "moderate",
      description: "La lethargie peut signaler une infection, une douleur, une anemie ou un probleme metabolique sous-jacent.",
      recommendations: [
        "Verifiez la temperature rectale de votre animal",
        "Observez la couleur des gencives (doivent etre roses)",
        "Assurez-vous que l'animal s'hydrate correctement",
        "Notez depuis quand ce comportement a change",
      ],
      urgency: "Une lethargie soudaine et marquee necessite une consultation veterinaire rapide.",
    },
  ],
  coughing: [
    {
      condition: "Toux - Affection respiratoire",
      severity: "moderate",
      description: "La toux peut etre causee par une infection des voies respiratoires, une allergie, une insuffisance cardiaque ou la toux du chenil.",
      recommendations: [
        "Evitez les environnements poussiereux ou enfumes",
        "Notez le type de toux (seche, grasse, nocturne)",
        "Verifiez que votre animal est a jour de ses vaccinations",
        "Une radiographie thoracique peut etre necessaire",
      ],
      urgency: "Si la toux s'accompagne de difficulte respiratoire, consultez en urgence.",
    },
  ],
  itching: [
    {
      condition: "Dermatite / Prurit",
      severity: "low",
      description: "Les demangeaisons sont souvent liees a des allergies (alimentaires, environnementales), des parasites (puces, acariens) ou des infections cutanees.",
      recommendations: [
        "Verifiez l'absence de puces avec un peigne fin",
        "Un bain avec un shampooing apaisant peut soulager temporairement",
        "Appliquez un traitement antiparasitaire adapte",
        "Un regime d'eviction alimentaire peut identifier une allergie",
      ],
      urgency: "Si des lesions cutanees apparaissent ou si le grattage est intense, consultez.",
    },
  ],
  limping: [
    {
      condition: "Boiterie - Probleme locomoteur",
      severity: "moderate",
      description: "La boiterie peut resulter d'une entorse, d'une fracture, d'une arthrose ou d'un corps etranger dans la patte.",
      recommendations: [
        "Examinez delicatement la patte concernee (coussinets, ongles, articulations)",
        "Limitez l'activite physique de votre animal",
        "Appliquez du froid si un gonflement est visible (15 min)",
        "Ne donnez pas d'anti-inflammatoire humain, ils sont toxiques",
      ],
      urgency: "Si la patte est deformee ou si l'animal ne pose plus du tout la patte, consultez en urgence.",
    },
  ],
  excessive_thirst: [
    {
      condition: "Polydipsie",
      severity: "high",
      description: "Une soif excessive peut etre le signe de diabete, d'insuffisance renale, d'une infection uterine (pyometre) ou d'un probleme hormonal.",
      recommendations: [
        "Mesurez la consommation d'eau quotidienne de votre animal",
        "Un chien boit normalement 50-60 ml/kg/jour",
        "Des analyses sanguines et urinaires sont recommandees",
        "Ne limitez jamais l'acces a l'eau",
      ],
      urgency: "La polydipsie est souvent le signe d'une maladie serieuse. Consultez rapidement.",
    },
  ],
  weight_loss: [
    {
      condition: "Amaigrissement",
      severity: "high",
      description: "Une perte de poids inexpliquee peut indiquer des parasites, un probleme thyroidien, le diabete, ou une maladie plus grave.",
      recommendations: [
        "Pesez regulierement votre animal pour objectiver la perte",
        "Verifiez que l'alimentation est adaptee en quantite et qualite",
        "Un bilan sanguin complet est recommande",
        "Un traitement antiparasitaire peut etre envisage",
      ],
      urgency: "Une perte de poids superieure a 10% du poids normal necessite un bilan veterinaire.",
    },
  ],
  hair_loss: [
    {
      condition: "Alopecie",
      severity: "low",
      description: "La perte de poils peut etre liee a des allergies, des parasites (teigne, demodecie), un probleme hormonal ou du stress.",
      recommendations: [
        "Observez si la perte est localisee ou diffuse",
        "Verifiez l'absence de rougeurs ou de squames",
        "Un examen a la lampe de Wood peut detecter la teigne",
        "Brossez regulierement votre animal",
      ],
      urgency: "Si des plaques sans poils apparaissent, consultez pour ecarter une teigne (contagieuse).",
    },
  ],
  eye_discharge: [
    {
      condition: "Affection oculaire",
      severity: "moderate",
      description: "Les ecoulements oculaires peuvent indiquer une conjonctivite, un ulcere corneen, une allergie ou un canal lacrymal bouche.",
      recommendations: [
        "Nettoyez delicatement les yeux avec du serum physiologique",
        "Observez la couleur de l'ecoulement (clair, jaunatre, verdatre)",
        "Verifiez si l'oeil est rouge ou si l'animal cligne excessivement",
        "Evitez les courants d'air et les irritants",
      ],
      urgency: "Un oeil ferme, tres rouge ou avec un ecoulement verdatre necessite une consultation rapide.",
    },
  ],
  bad_breath: [
    {
      condition: "Halitose - Probleme dentaire",
      severity: "low",
      description: "La mauvaise haleine est generalement liee a une maladie parodontale, du tartre, ou parfois a des problemes digestifs ou renaux.",
      recommendations: [
        "Examinez les dents et gencives de votre animal",
        "Un detartrage veterinaire peut etre necessaire",
        "Proposez des jouets a macher adaptes",
        "Un brossage dentaire regulier est recommande",
      ],
      urgency: "Une haleine tres forte et soudaine peut signaler un probleme renal. Consultez si c'est recent.",
    },
  ],
  difficulty_breathing: [
    {
      condition: "Detresse respiratoire",
      severity: "high",
      description: "Les difficultes respiratoires constituent une urgence et peuvent etre causees par un oedeme pulmonaire, un corps etranger, une allergie severe ou un probleme cardiaque.",
      recommendations: [
        "Gardez votre animal au calme dans un environnement frais",
        "Ne le forcez pas a se coucher s'il prefere rester assis",
        "Verifiez la couleur des gencives (bleues = urgence absolue)",
        "Rendez-vous immediatement chez le veterinaire",
      ],
      urgency: "URGENCE : Les difficultes respiratoires necessitent une consultation veterinaire immediate.",
    },
  ],
  swelling: [
    {
      condition: "Tumefaction / Oedeme",
      severity: "moderate",
      description: "Un gonflement peut etre cause par un abces, une piqure d'insecte, une reaction allergique, un traumatisme ou une tumeur.",
      recommendations: [
        "Notez l'emplacement exact et la taille du gonflement",
        "Observez si le gonflement est chaud, douloureux ou mobile",
        "Appliquez du froid si c'est recent (15 min)",
        "Ne percez jamais un abces vous-meme",
      ],
      urgency: "Un gonflement rapide du museau ou de la gorge (choc anaphylactique) est une urgence absolue.",
    },
  ],
  behavioral_change: [
    {
      condition: "Trouble comportemental",
      severity: "moderate",
      description: "Un changement de comportement peut signaler une douleur, un stress, une maladie cognitive (chez les animaux ages) ou un probleme neurologique.",
      recommendations: [
        "Notez les changements specifiques observes et depuis quand",
        "Verifiez s'il y a eu des modifications dans l'environnement",
        "Un bilan de sante general est recommande",
        "Un comportementaliste veterinaire peut etre consulte",
      ],
      urgency: "Une agressivite soudaine ou une desorientation necessitent une consultation rapide.",
    },
  ],
};

const FREE_CHAT_RESPONSES: Record<string, string> = {
  bonjour: "Bonjour ! Je suis l'assistant sante PetCare. Comment puis-je vous aider aujourd'hui ? Vous pouvez me poser des questions sur la sante, l'alimentation ou le comportement de votre animal.",
  merci: "Je vous en prie ! N'hesitez pas si vous avez d'autres questions. Rappelez-vous que cet assistant ne remplace pas un avis veterinaire professionnel.",
  alimentation: "L'alimentation est cruciale pour la sante de votre animal. Voici quelques principes :\n\n• Choisissez une alimentation adaptee a l'age, la taille et l'activite\n• Respectez les quantites recommandees sur l'emballage\n• Evitez le chocolat, le raisin, l'oignon et l'ail (toxiques)\n• Changez progressivement d'alimentation sur 7 jours\n• Privilegiez des croquettes de qualite premium\n\nSouhaitez-vous des conseils plus specifiques ?",
  vaccination: "Le calendrier vaccinal depend de l'espece et du mode de vie :\n\n🐕 **Chien** : CHPL (maladie de Carre, Hepatite, Parvovirose, Leptospirose) + Rage\n🐱 **Chat** : Typhus, Coryza, Leucose (FeLV) + Rage si acces exterieur\n🐰 **Lapin** : Myxomatose + VHD\n\n• Primovaccination : 2 injections a 1 mois d'intervalle\n• Rappel annuel indispensable\n• Carnet de sante a jour obligatoire\n\nVotre animal est-il a jour ?",
  sterilisation: "La sterilisation presente de nombreux avantages :\n\n✅ Prevention des tumeurs mammaires (risque reduit de 90% si fait avant les 1eres chaleurs)\n✅ Elimination du risque de pyometre (infection uterine)\n✅ Reduction des comportements de marquage et fugues\n✅ Prevention des portees non desirees\n\n⏰ Age recommande : entre 6 et 12 mois selon l'espece et la race\n💰 Cout moyen : 200-500€ selon l'animal\n\nParlez-en avec votre veterinaire pour le meilleur moment.",
  parasites: "La prevention antiparasitaire est essentielle toute l'annee :\n\n🔴 **Parasites externes** : puces, tiques, aoûtats\n• Traitement mensuel en pipette, comprime ou collier\n• Traitez aussi l'environnement (coussins, tapis)\n\n🟡 **Parasites internes** : vers ronds, vers plats\n• Vermifugation tous les 3 mois pour les adultes\n• Mensuelle pour les chiots/chatons jusqu'a 6 mois\n\nProduits recommandes : consultez votre veterinaire pour un protocole adapte.",
  urgence: "🚨 **Signes d'urgence veterinaire** - consultez immediatement si :\n\n• Difficulte a respirer ou gencives bleues/blanches\n• Saignement abondant\n• Impossibilite d'uriner (surtout chat male)\n• Convulsions\n• Ingestion de produit toxique (chocolat, antigel, medicaments)\n• Abdomen gonfle et douloureux\n• Perte de conscience\n\n📞 Gardez toujours le numero de votre veterinaire et des urgences a portee de main.",
  exercice: "L'exercice est vital pour le bien-etre de votre animal :\n\n🐕 **Chien** :\n• Minimum 30 min a 2h de promenade/jour selon la race\n• Jeux de rapport, pistage, agility\n• Adaptez a l'age et la condition physique\n\n🐱 **Chat** :\n• Sessions de jeu de 15-20 min, 2 a 3 fois/jour\n• Arbres a chat, jouets interactifs\n• Stimulation mentale (puzzles alimentaires)\n\n🐰 **Lapin** : minimum 4h de liberte/jour hors cage",
};

export function generateAIResponse(
  symptoms: string[],
  animal?: Animal | null,
  additionalInfo?: string
): string {
  const analyses: SymptomAnalysis[] = [];

  for (const symptom of symptoms) {
    const entries = SYMPTOM_DATABASE[symptom];
    if (entries) {
      analyses.push(entries[0]);
    }
  }

  if (analyses.length === 0) {
    return "Je n'ai pas pu analyser les symptomes selectionnes. Veuillez selectionner des symptomes specifiques ou consulter votre veterinaire.";
  }

  const maxSeverity = analyses.reduce((max, a) => {
    const order = { low: 0, moderate: 1, high: 2 };
    return order[a.severity] > order[max.severity] ? a : max;
  });

  const severityLabel = {
    low: "⚪ Faible",
    moderate: "🟡 Modere",
    high: "🔴 Eleve",
  };

  const animalInfo = animal
    ? `pour **${animal.name}** (${animal.species}${animal.breed ? `, ${animal.breed}` : ""})`
    : "";

  let response = `## 🩺 Analyse des symptomes ${animalInfo}\n\n`;
  response += `**Niveau d'alerte general** : ${severityLabel[maxSeverity.severity]}\n\n`;

  for (const analysis of analyses) {
    response += `### ${analysis.condition}\n`;
    response += `*Severite* : ${severityLabel[analysis.severity]}\n\n`;
    response += `${analysis.description}\n\n`;
    response += `**Recommandations :**\n`;
    for (const rec of analysis.recommendations) {
      response += `• ${rec}\n`;
    }
    response += `\n⚠️ *${analysis.urgency}*\n\n`;
  }

  if (additionalInfo) {
    response += `---\n*Note : Vos observations supplementaires ("${additionalInfo.slice(0, 100)}...") ont ete prises en compte dans l'analyse.*\n\n`;
  }

  response += `---\n⚕️ **Rappel** : Cette analyse est generee par un algorithme et ne remplace pas un diagnostic veterinaire. En cas de doute, consultez toujours un professionnel.`;

  return response;
}

export function generateFreeChatResponse(message: string): string {
  const lower = message.toLowerCase().trim();

  for (const [keyword, response] of Object.entries(FREE_CHAT_RESPONSES)) {
    if (lower.includes(keyword)) return response;
  }

  if (lower.includes("age") || lower.includes("vieux") || lower.includes("senior")) {
    return "Le vieillissement varie selon l'espece et la race :\n\n🐕 **Chien** : senior a partir de 7-8 ans (5-6 ans pour les grandes races)\n🐱 **Chat** : senior a partir de 10-12 ans\n\nAvec l'age, prevoyez :\n• Un bilan sanguin annuel\n• Une alimentation adaptee \"senior\"\n• Un suivi dentaire renforce\n• Des exercices adaptes (plus courts, moins intenses)\n• Une surveillance du poids et de la mobilite";
  }

  if (lower.includes("poids") || lower.includes("gros") || lower.includes("maigr")) {
    return "La gestion du poids est essentielle :\n\n📊 **Comment savoir si votre animal est en surpoids ?**\n• Vous devriez sentir ses cotes facilement\n• Il devrait avoir une taille marquee vu de dessus\n• Son ventre ne devrait pas pendre\n\n⚖️ **Pour perdre du poids** :\n• Reduisez les portions de 10-15%\n• Supprimez les friandises ou utilisez des legumes\n• Augmentez progressivement l'exercice\n• Pesez-le chaque semaine\n\nConsultez votre veterinaire pour un plan personnalise.";
  }

  if (lower.includes("dent") || lower.includes("gencive") || lower.includes("bouche")) {
    return "L'hygiene bucco-dentaire est souvent negligee :\n\n🦷 **Signes de probleme dentaire** :\n• Mauvaise haleine\n• Difficulte a manger, mache d'un seul cote\n• Gencives rouges ou qui saignent\n• Tartre visible (depot jaunatre/brun)\n\n✨ **Prevention** :\n• Brossage 2 a 3 fois/semaine avec un dentifrice veterinaire\n• Lamelles a macher dentaires\n• Detartrage professionnel regulier\n• 80% des animaux de plus de 3 ans ont une maladie parodontale !";
  }

  return "C'est une bonne question ! Voici ce que je peux vous dire :\n\nPour une reponse personnalisee, je vous recommande de :\n• Selectionner votre animal et decrire les symptomes observes\n• Utiliser le selecteur de symptomes ci-dessous pour une analyse detaillee\n• Consulter votre veterinaire pour un diagnostic professionnel\n\nJe peux vous renseigner sur : l'alimentation, la vaccination, la sterilisation, les parasites, l'exercice, les urgences, le vieillissement, le poids, et l'hygiene dentaire.\n\nN'hesitez pas a me poser des questions !";
}

export function generateHealthPredictions(animal: Animal, weightEntries: Array<{ weight: number; date: string }>, vaccinations: Array<{ nextDueDate?: string }>): Array<{ type: "warning" | "info" | "success"; title: string; message: string }> {
  const predictions: Array<{ type: "warning" | "info" | "success"; title: string; message: string }> = [];

  if (weightEntries.length >= 2) {
    const sorted = [...weightEntries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const latest = sorted[sorted.length - 1];
    const prev = sorted[sorted.length - 2];
    const change = ((latest.weight - prev.weight) / prev.weight) * 100;

    if (Math.abs(change) > 10) {
      predictions.push({
        type: "warning",
        title: "Variation de poids importante",
        message: `${animal.name} a ${change > 0 ? "pris" : "perdu"} ${Math.abs(change).toFixed(1)}% de poids recemment. Une variation superieure a 10% merite une consultation.`,
      });
    } else {
      predictions.push({
        type: "success",
        title: "Poids stable",
        message: `Le poids de ${animal.name} est stable (variation de ${Math.abs(change).toFixed(1)}%). Continuez ainsi !`,
      });
    }
  }

  const now = new Date();
  for (const vacc of vaccinations) {
    if (vacc.nextDueDate) {
      const due = new Date(vacc.nextDueDate);
      const daysLeft = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      if (daysLeft < 0) {
        predictions.push({
          type: "warning",
          title: "Vaccination en retard",
          message: `${animal.name} a une vaccination en retard de ${Math.abs(daysLeft)} jours. Prenez rendez-vous rapidement.`,
        });
      } else if (daysLeft < 30) {
        predictions.push({
          type: "info",
          title: "Vaccination bientot",
          message: `${animal.name} doit etre vaccine dans ${daysLeft} jours. Pensez a prendre rendez-vous.`,
        });
      }
    }
  }

  return predictions;
}

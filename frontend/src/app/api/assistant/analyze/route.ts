import { NextRequest, NextResponse } from "next/server";

const SYMPTOM_RESPONSES: Record<string, string> = {
  vomissements: "Les vomissements peuvent etre causes par une indigestion, un corps etranger, ou une infection. Si les vomissements persistent plus de 24h ou contiennent du sang, consultez un veterinaire en urgence. En attendant, retirez la nourriture pendant 12h et proposez de petites quantites d'eau.",
  diarrhee: "La diarrhee peut resulter d'un changement alimentaire, d'un stress ou d'une infection. Assurez une bonne hydratation. Si la diarrhee dure plus de 48h, contient du sang, ou s'accompagne de fievre, consultez rapidement.",
  toux: "La toux peut indiquer une infection respiratoire, une allergie, ou un probleme cardiaque chez les animaux ages. Si la toux persiste plus de 3 jours ou s'accompagne de difficultes respiratoires, une consultation est recommandee.",
  boiterie: "Une boiterie peut etre causee par une entorse, une fracture, ou un probleme articulaire. Limitez l'activite physique et observez l'evolution. Si la boiterie ne s'ameliore pas en 48h ou si l'animal refuse de poser la patte, consultez.",
  grattage: "Un grattage excessif peut indiquer des parasites (puces, tiques), une allergie alimentaire ou environnementale, ou une infection cutanee. Verifiez la presence de parasites et consultez si le grattage cause des lesions.",
  fatigue: "Une fatigue inhabituelle peut signaler une anemie, une infection, un probleme cardiaque ou metabolique. Si la lethargie dure plus de 24-48h, une consultation veterinaire est conseillee pour un bilan sanguin.",
  "perte appetit": "Une perte d'appetit peut etre liee au stress, a une douleur dentaire, ou a une maladie sous-jacente. Si votre animal ne mange pas depuis plus de 24h (12h pour un chat), consultez un veterinaire.",
  "perte poids": "Une perte de poids inexpliquee peut indiquer des parasites intestinaux, un probleme thyroidien, un diabete ou une maladie renale. Un bilan veterinaire complet est recommande.",
  fievre: "La fievre (>39.5C) peut accompagner une infection bacterienne ou virale. Gardez l'animal au repos, hydratez-le, et consultez rapidement si la temperature depasse 40C.",
  yeux: "Des yeux rouges, larmoyants ou avec un ecoulement peuvent indiquer une conjonctivite, une allergie, un corps etranger ou un ulcere corneen. Nettoyez delicatement avec du serum physiologique et consultez si ca persiste.",
  oreilles: "Des oreilles qui grattent ou avec un ecoulement peuvent indiquer une otite, des acariens, ou une allergie. Ne mettez rien dans l'oreille sans avis veterinaire. Consultez pour un diagnostic precis.",
  respiration: "Des difficultes respiratoires sont une urgence. Si votre animal halète excessivement, respire la bouche ouverte (chat), ou a les gencives bleues, rendez-vous immediatement chez le veterinaire.",
};

export async function POST(req: NextRequest) {
  const { symptoms, additionalInfo } = await req.json();

  if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
    return NextResponse.json({ message: "Veuillez fournir au moins un symptome" }, { status: 400 });
  }

  let analysis = "## Analyse des symptomes\n\n";

  for (const symptom of symptoms) {
    const key = Object.keys(SYMPTOM_RESPONSES).find((k) =>
      symptom.toLowerCase().includes(k)
    );
    if (key) {
      analysis += `### ${symptom}\n${SYMPTOM_RESPONSES[key]}\n\n`;
    } else {
      analysis += `### ${symptom}\nCe symptome necessite une evaluation veterinaire pour un diagnostic precis.\n\n`;
    }
  }

  if (symptoms.length > 2) {
    analysis += "### Recommandation\nLa combinaison de plusieurs symptomes necessite une consultation veterinaire rapide pour un diagnostic complet.\n\n";
  }

  if (additionalInfo) {
    analysis += `### Note supplementaire\nInformations complementaires prises en compte : ${additionalInfo}\n\n`;
  }

  analysis += "---\n*Cet avis est genere automatiquement et ne remplace pas un diagnostic veterinaire professionnel.*";

  return NextResponse.json({ analysis });
}

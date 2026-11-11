import { MongoClient } from "mongodb";

const MONGODB_URI = "mongodb+srv://pet:pet@ac-q6ppedi.bigisyq.mongodb.net/petcare?retryWrites=true&w=majority";

const now = new Date();
function daysAgo(d) { return new Date(now.getTime() - d * 86400000); }
function daysFromNow(d) { return new Date(now.getTime() + d * 86400000); }
function dateAt(y, m, d) { return new Date(y, m - 1, d); }
function todayAt(h, min) { const d = new Date(now); d.setHours(h, min, 0, 0); return d; }
function futureAt(days, h, min) { const d = daysFromNow(days); d.setHours(h, min, 0, 0); return d; }
function pastAt(days, h, min) { const d = daysAgo(days); d.setHours(h, min, 0, 0); return d; }
function timeStr(h, min) { return `${String(h).padStart(2,"0")}:${String(min).padStart(2,"0")}`; }

async function main() {
  console.log("Connecting to MongoDB Atlas...");
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  console.log("Connected!");

  const db = client.db("petcare");

  // Drop and re-seed to fix ObjectId vs string issue
  const collections = ["users", "animals", "medicalRecords", "vaccinations", "appointments", "reminders", "meals", "weightRecords"];
  for (const c of collections) {
    try { await db.collection(c).drop(); } catch {}
  }
  console.log("Cleaned existing collections");

  // =============================================
  // UTILISATEURS
  // =============================================
  const usersData = [
    { email: "amine@petcare.tn", password: "amine1234", firstName: "Mohamed Amine", lastName: "Nouri", createdAt: daysAgo(120) },
    { email: "yasmine@petcare.tn", password: "yasmine1234", firstName: "Yasmine", lastName: "Ben Ali", createdAt: daysAgo(90) },
    { email: "khalil@petcare.tn", password: "khalil1234", firstName: "Khalil", lastName: "Trabelsi", createdAt: daysAgo(60) },
    { email: "fatma@petcare.tn", password: "fatma1234", firstName: "Fatma", lastName: "Bouazizi", createdAt: daysAgo(45) },
    { email: "ahmed@petcare.tn", password: "ahmed1234", firstName: "Ahmed", lastName: "Mejri", createdAt: daysAgo(30) },
    { email: "demo@petcare.tn", password: "demo1234", firstName: "Demo", lastName: "Utilisateur", createdAt: daysAgo(150) },
    { email: "vet@petcare.tn", password: "vet1234", firstName: "Dr. Sami", lastName: "Khelifi", createdAt: daysAgo(200) },
  ];
  const usersResult = await db.collection("users").insertMany(usersData);
  const userIds = Object.values(usersResult.insertedIds).map(id => id.toString());
  const [amineId, yasmineId, khalilId, fatmaId, ahmedId, demoId, vetId] = userIds;
  console.log(`Inserted ${userIds.length} users`);

  // =============================================
  // ANIMAUX
  // =============================================
  const animalsData = [
    // Amine (4)
    { name: "Rex", species: "DOG", breed: "Berger Allemand", birthDate: dateAt(2021,5,10), weight: 34.0, gender: "MALE", color: "Noir et feu", notes: "Tres protecteur, garde la maison a La Marsa", chipNumber: "788269801234567", userId: amineId, createdAt: daysAgo(100), updatedAt: daysAgo(2) },
    { name: "Mimi", species: "CAT", breed: "Siamois", birthDate: dateAt(2022,8,15), weight: 4.5, gender: "FEMALE", color: "Creme et chocolat", notes: "Tres caline, dort sur le canape toute la journee", chipNumber: "788269801234568", userId: amineId, createdAt: daysAgo(95), updatedAt: daysAgo(5) },
    { name: "Coco", species: "BIRD", breed: "Perruche ondulee", birthDate: dateAt(2023,3,20), weight: 0.035, gender: "MALE", color: "Vert et jaune", notes: "Chante le matin, aime les graines de tournesol", userId: amineId, createdAt: daysAgo(80), updatedAt: daysAgo(10) },
    { name: "Neige", species: "RABBIT", breed: "Nain Belier", birthDate: dateAt(2023,11,5), weight: 1.9, gender: "FEMALE", color: "Blanc", notes: "Adore les carottes et le persil frais du marche central", userId: amineId, createdAt: daysAgo(60), updatedAt: daysAgo(3) },
    // Yasmine (3)
    { name: "Sultan", species: "DOG", breed: "Sloughi", birthDate: dateAt(2020,2,14), weight: 25.0, gender: "MALE", color: "Sable dore", notes: "Race tunisienne, tres rapide, promenades a Sidi Bou Said", chipNumber: "788269802345678", userId: yasmineId, createdAt: daysAgo(85), updatedAt: daysAgo(1) },
    { name: "Bella", species: "CAT", breed: "Angora Turc", birthDate: dateAt(2021,12,1), weight: 5.2, gender: "FEMALE", color: "Blanc pur", notes: "Poils longs, necessite un brossage quotidien", chipNumber: "788269802345679", userId: yasmineId, createdAt: daysAgo(80), updatedAt: daysAgo(4) },
    { name: "Oscar", species: "HAMSTER", breed: "Hamster dore", birthDate: dateAt(2024,6,10), weight: 0.12, gender: "MALE", color: "Dore et blanc", notes: "Tres actif la nuit, adore sa roue", userId: yasmineId, createdAt: daysAgo(50), updatedAt: daysAgo(7) },
    // Khalil (3)
    { name: "Rocky", species: "DOG", breed: "Pitbull", birthDate: dateAt(2022,1,8), weight: 28.0, gender: "MALE", color: "Bringe", notes: "Doux malgre les apparences, adore les enfants", chipNumber: "788269803456789", userId: khalilId, createdAt: daysAgo(55), updatedAt: daysAgo(6) },
    { name: "Luna", species: "CAT", breed: "Chat de gouttiere", birthDate: dateAt(2023,4,17), weight: 3.8, gender: "FEMALE", color: "Tigree gris", notes: "Trouvee dans le quartier El Menzah, adoptee a 2 mois", userId: khalilId, createdAt: daysAgo(50), updatedAt: daysAgo(8) },
    { name: "Nemo", species: "FISH", breed: "Poisson-clown", birthDate: dateAt(2024,2,1), weight: 0.02, gender: "MALE", color: "Orange et blanc", notes: "Aquarium 100L dans le salon, avec corail artificiel", userId: khalilId, createdAt: daysAgo(40), updatedAt: daysAgo(15) },
    // Fatma (2)
    { name: "Princesse", species: "CAT", breed: "Persan", birthDate: dateAt(2021,9,22), weight: 4.8, gender: "FEMALE", color: "Gris cendre", notes: "Nez ecrase, necessite nettoyage des yeux regulier", chipNumber: "788269804567890", userId: fatmaId, createdAt: daysAgo(40), updatedAt: daysAgo(2) },
    { name: "Simba", species: "DOG", breed: "Caniche", birthDate: dateAt(2023,7,30), weight: 6.5, gender: "MALE", color: "Abricot", notes: "Toilettage tous les 2 mois chez Salon Vetcare Lac", chipNumber: "788269804567891", userId: fatmaId, createdAt: daysAgo(35), updatedAt: daysAgo(9) },
    // Ahmed (3)
    { name: "Balto", species: "DOG", breed: "Husky Siberien", birthDate: dateAt(2022,11,11), weight: 23.5, gender: "MALE", color: "Gris et blanc", notes: "Supporte mal la chaleur de Tunis en ete, climatisation obligatoire", chipNumber: "788269805678901", userId: ahmedId, createdAt: daysAgo(28), updatedAt: daysAgo(1) },
    { name: "Caramel", species: "CAT", breed: "British Shorthair", birthDate: dateAt(2023,5,5), weight: 5.8, gender: "MALE", color: "Bleu (gris)", notes: "Achete a l'animalerie de la Soukra, tres gourmand", chipNumber: "788269805678902", userId: ahmedId, createdAt: daysAgo(25), updatedAt: daysAgo(3) },
    { name: "Drago", species: "REPTILE", breed: "Iguane vert", birthDate: dateAt(2024,1,15), weight: 0.45, gender: "MALE", color: "Vert emeraude", notes: "Terrarium chauffe, alimentation vegetale uniquement", userId: ahmedId, createdAt: daysAgo(20), updatedAt: daysAgo(12) },
    // Demo (3)
    { name: "Max", species: "DOG", breed: "Golden Retriever", birthDate: dateAt(2021,3,15), weight: 32.5, gender: "MALE", color: "Dore", notes: "Tres joueur, promenades au Parc du Belvedere chaque matin", chipNumber: "788269800123456", userId: demoId, createdAt: daysAgo(140), updatedAt: daysAgo(1) },
    { name: "Minette", species: "CAT", breed: "Europeen", birthDate: dateAt(2022,6,20), weight: 4.0, gender: "FEMALE", color: "Ecaille de tortue", notes: "Trouvee pres de la Medina de Tunis, tres affectueuse", chipNumber: "788269800123457", userId: demoId, createdAt: daysAgo(130), updatedAt: daysAgo(5) },
    { name: "Pirate", species: "BIRD", breed: "Calopsitte elegante", birthDate: dateAt(2023,9,1), weight: 0.09, gender: "MALE", color: "Gris avec joues orange", notes: "Siffle des melodies, tres sociable", userId: demoId, createdAt: daysAgo(100), updatedAt: daysAgo(14) },
  ];
  const animalsResult = await db.collection("animals").insertMany(animalsData);
  const animalIds = Object.values(animalsResult.insertedIds).map(id => id.toString());
  const [rexId, mimiId, cocoId, neigeId, sultanId, bellaId, oscarId, rockyId, lunaId, nemoId, princesseId, simbaId, baltoId, caramelId, dragoId, maxId, minetteId, pirateId] = animalIds;
  console.log(`Inserted ${animalIds.length} animals`);

  // =============================================
  // DOSSIERS MEDICAUX
  // =============================================
  const medicalRecords = [
    { type: "CONSULTATION", title: "Bilan annuel complet", description: "Examen general, auscultation, palpation abdominale. RAS.", date: daysAgo(30), veterinarian: "Dr. Sami Khelifi", clinic: "Clinique Veterinaire El Manar, Tunis", notes: "Animal en bonne sante, continuer le regime actuel", cost: 85.0, animalId: rexId },
    { type: "TREATMENT", title: "Traitement anti-parasitaire", description: "Application Frontline Combo contre puces et tiques", date: daysAgo(60), veterinarian: "Dr. Sami Khelifi", clinic: "Clinique Veterinaire El Manar, Tunis", cost: 45.0, animalId: rexId },
    { type: "EXAM", title: "Radiographie hanche", description: "Controle de dysplasie. Resultats normaux, pas de signe de dysplasie.", date: daysAgo(120), veterinarian: "Dr. Leila Hammami", clinic: "Centre Veterinaire Lac 2, Tunis", notes: "Prochain controle dans 1 an", cost: 120.0, animalId: rexId },
    { type: "CONSULTATION", title: "Allergie cutanee", description: "Demangeaisons et rougeurs au niveau du cou. Prescrit antihistaminique.", date: daysAgo(20), veterinarian: "Dr. Sami Khelifi", clinic: "Clinique Veterinaire El Manar, Tunis", notes: "Eviter les croquettes au poulet", cost: 65.0, animalId: mimiId },
    { type: "SURGERY", title: "Sterilisation", description: "Ovariectomie sous anesthesie generale. Intervention sans complication.", date: daysAgo(180), veterinarian: "Dr. Leila Hammami", clinic: "Centre Veterinaire Lac 2, Tunis", notes: "Retrait des fils apres 10 jours", cost: 180.0, animalId: mimiId },
    { type: "CONSULTATION", title: "Boiterie patte avant droite", description: "Legere entorse du carpe apres course a la plage de Gammarth. Repos 7 jours.", date: daysAgo(15), veterinarian: "Dr. Nabil Saidi", clinic: "Veterinaire Sidi Bou Said", notes: "Anti-inflammatoire pendant 5 jours", cost: 75.0, animalId: sultanId },
    { type: "TREATMENT", title: "Detartrage dentaire", description: "Detartrage complet sous sedation. Gencives en bon etat.", date: daysAgo(90), veterinarian: "Dr. Nabil Saidi", clinic: "Veterinaire Sidi Bou Said", cost: 95.0, animalId: sultanId },
    { type: "CONSULTATION", title: "Probleme oculaire", description: "Larmoiement excessif oeil gauche. Prescrit collyre antibiotique.", date: daysAgo(10), veterinarian: "Dr. Nabil Saidi", clinic: "Veterinaire Sidi Bou Said", cost: 55.0, animalId: bellaId },
    { type: "CONSULTATION", title: "Bilan annuel", description: "Examen complet. Bon etat general. Poids stable.", date: daysAgo(25), veterinarian: "Dr. Imen Gharbi", clinic: "Clinique Veterinaire El Menzah, Tunis", notes: "Regime hypoallergenique recommande", cost: 70.0, animalId: rockyId },
    { type: "TREATMENT", title: "Otite externe", description: "Nettoyage auriculaire + traitement topique. Controle dans 10 jours.", date: daysAgo(45), veterinarian: "Dr. Imen Gharbi", clinic: "Clinique Veterinaire El Menzah, Tunis", cost: 50.0, animalId: rockyId },
    { type: "SURGERY", title: "Sterilisation", description: "Sterilisation realisee avec succes. Recuperation rapide.", date: daysAgo(150), veterinarian: "Dr. Imen Gharbi", clinic: "Clinique Veterinaire El Menzah, Tunis", cost: 150.0, animalId: lunaId },
    { type: "CONSULTATION", title: "Probleme respiratoire", description: "Difficulte respiratoire legere liee au nez ecrase (brachycephale). Surveillance.", date: daysAgo(18), veterinarian: "Dr. Anis Mathlouthi", clinic: "Clinique Veterinaire Les Berges du Lac, Tunis", notes: "Eviter les efforts par temps chaud", cost: 90.0, animalId: princesseId },
    { type: "TREATMENT", title: "Nettoyage yeux et oreilles", description: "Soins de routine pour race Persan. Nettoyage oculaire + auriculaire.", date: daysAgo(40), veterinarian: "Dr. Anis Mathlouthi", clinic: "Clinique Veterinaire Les Berges du Lac, Tunis", cost: 35.0, animalId: princesseId },
    { type: "CONSULTATION", title: "Vaccination et bilan", description: "Bilan complet. Rappel vaccins effectue. Tres bon etat.", date: daysAgo(35), veterinarian: "Dr. Anis Mathlouthi", clinic: "Clinique Veterinaire Les Berges du Lac, Tunis", cost: 80.0, animalId: simbaId },
    { type: "CONSULTATION", title: "Coup de chaleur", description: "Episode de coup de chaleur en aout. Rehydratation IV. Surveillance 24h.", date: daysAgo(80), veterinarian: "Dr. Sami Khelifi", clinic: "Clinique Veterinaire El Manar, Tunis", notes: "Limiter les sorties entre 11h et 17h en ete", cost: 130.0, animalId: baltoId },
    { type: "EXAM", title: "Bilan sanguin complet", description: "NFS, biochimie, thyroide. Resultats dans les normes.", date: daysAgo(30), veterinarian: "Dr. Sami Khelifi", clinic: "Clinique Veterinaire El Manar, Tunis", cost: 95.0, animalId: baltoId },
    { type: "CONSULTATION", title: "Visite annuelle", description: "Bilan complet. Poids stable. Dentition en bon etat.", date: daysAgo(20), veterinarian: "Dr. Sami Khelifi", clinic: "Clinique Veterinaire El Manar, Tunis", notes: "Prochain bilan dans 12 mois", cost: 85.0, animalId: maxId },
    { type: "TREATMENT", title: "Traitement anti-puces", description: "Application Bravecto comprime. Protection 3 mois.", date: daysAgo(20), veterinarian: "Dr. Sami Khelifi", clinic: "Clinique Veterinaire El Manar, Tunis", cost: 55.0, animalId: maxId },
    { type: "SURGERY", title: "Extraction dentaire", description: "Extraction d'une premolaire fracturee sous anesthesie generale.", date: daysAgo(200), veterinarian: "Dr. Leila Hammami", clinic: "Centre Veterinaire Lac 2, Tunis", cost: 200.0, animalId: maxId },
    { type: "CONSULTATION", title: "Gastro-enterite", description: "Vomissements et diarrhee. Prescrit anti-emetique + diete 24h.", date: daysAgo(45), veterinarian: "Dr. Sami Khelifi", clinic: "Clinique Veterinaire El Manar, Tunis", cost: 60.0, animalId: minetteId },
  ];
  await db.collection("medicalRecords").insertMany(medicalRecords);
  console.log(`Inserted ${medicalRecords.length} medical records`);

  // =============================================
  // VACCINATIONS
  // =============================================
  const vaccinations = [
    // Rex
    { name: "Rage", date: daysAgo(30), nextDueDate: daysFromNow(335), veterinarian: "Dr. Sami Khelifi", clinic: "Clinique Veterinaire El Manar", batchNumber: "RAB-2026-TN-0891", animalId: rexId },
    { name: "DHPP", date: daysAgo(30), nextDueDate: daysFromNow(335), veterinarian: "Dr. Sami Khelifi", clinic: "Clinique Veterinaire El Manar", batchNumber: "DHP-2026-TN-1204", animalId: rexId },
    { name: "Leptospirose", date: daysAgo(180), nextDueDate: daysFromNow(10), veterinarian: "Dr. Sami Khelifi", clinic: "Clinique Veterinaire El Manar", batchNumber: "LEP-2026-TN-0332", notes: "Rappel bientot", animalId: rexId },
    // Mimi
    { name: "Typhus", date: daysAgo(45), nextDueDate: daysFromNow(320), veterinarian: "Dr. Sami Khelifi", clinic: "Clinique Veterinaire El Manar", batchNumber: "TYP-2026-TN-0556", animalId: mimiId },
    { name: "Coryza", date: daysAgo(45), nextDueDate: daysFromNow(320), veterinarian: "Dr. Sami Khelifi", clinic: "Clinique Veterinaire El Manar", batchNumber: "COR-2026-TN-0771", animalId: mimiId },
    { name: "Leucose feline (FeLV)", date: daysAgo(200), nextDueDate: daysAgo(5), veterinarian: "Dr. Sami Khelifi", clinic: "Clinique Veterinaire El Manar", batchNumber: "FLV-2025-TN-0120", notes: "EN RETARD - rappel urgent", animalId: mimiId },
    // Sultan
    { name: "Rage", date: daysAgo(60), nextDueDate: daysFromNow(305), veterinarian: "Dr. Nabil Saidi", clinic: "Veterinaire Sidi Bou Said", batchNumber: "RAB-2026-TN-0445", animalId: sultanId },
    { name: "DHPP", date: daysAgo(60), nextDueDate: daysFromNow(305), veterinarian: "Dr. Nabil Saidi", clinic: "Veterinaire Sidi Bou Said", batchNumber: "DHP-2026-TN-0667", animalId: sultanId },
    { name: "Leishmaniose", date: daysAgo(60), nextDueDate: daysFromNow(305), veterinarian: "Dr. Nabil Saidi", clinic: "Veterinaire Sidi Bou Said", batchNumber: "LEI-2026-TN-0102", notes: "Important en zone mediterraneenne", animalId: sultanId },
    // Bella
    { name: "Typhus", date: daysAgo(90), nextDueDate: daysFromNow(275), veterinarian: "Dr. Nabil Saidi", clinic: "Veterinaire Sidi Bou Said", batchNumber: "TYP-2026-TN-0889", animalId: bellaId },
    { name: "Coryza", date: daysAgo(90), nextDueDate: daysFromNow(275), veterinarian: "Dr. Nabil Saidi", clinic: "Veterinaire Sidi Bou Said", batchNumber: "COR-2026-TN-0445", animalId: bellaId },
    // Rocky
    { name: "Rage", date: daysAgo(25), nextDueDate: daysFromNow(340), veterinarian: "Dr. Imen Gharbi", clinic: "Clinique El Menzah", batchNumber: "RAB-2026-TN-1102", animalId: rockyId },
    { name: "DHPP", date: daysAgo(25), nextDueDate: daysFromNow(340), veterinarian: "Dr. Imen Gharbi", clinic: "Clinique El Menzah", batchNumber: "DHP-2026-TN-0998", animalId: rockyId },
    // Luna
    { name: "Typhus", date: daysAgo(100), nextDueDate: daysFromNow(265), veterinarian: "Dr. Imen Gharbi", clinic: "Clinique El Menzah", batchNumber: "TYP-2026-TN-0334", animalId: lunaId },
    // Princesse
    { name: "Typhus", date: daysAgo(50), nextDueDate: daysFromNow(315), veterinarian: "Dr. Anis Mathlouthi", clinic: "Clinique Les Berges du Lac", batchNumber: "TYP-2026-TN-0776", animalId: princesseId },
    { name: "Coryza", date: daysAgo(50), nextDueDate: daysFromNow(315), veterinarian: "Dr. Anis Mathlouthi", clinic: "Clinique Les Berges du Lac", batchNumber: "COR-2026-TN-0221", animalId: princesseId },
    // Simba
    { name: "Rage", date: daysAgo(35), nextDueDate: daysFromNow(330), veterinarian: "Dr. Anis Mathlouthi", clinic: "Clinique Les Berges du Lac", batchNumber: "RAB-2026-TN-0553", animalId: simbaId },
    { name: "DHPP", date: daysAgo(35), nextDueDate: daysFromNow(330), veterinarian: "Dr. Anis Mathlouthi", clinic: "Clinique Les Berges du Lac", batchNumber: "DHP-2026-TN-0412", animalId: simbaId },
    // Balto
    { name: "Rage", date: daysAgo(40), nextDueDate: daysFromNow(325), veterinarian: "Dr. Sami Khelifi", clinic: "Clinique Veterinaire El Manar", batchNumber: "RAB-2026-TN-0712", animalId: baltoId },
    { name: "DHPP", date: daysAgo(40), nextDueDate: daysFromNow(325), veterinarian: "Dr. Sami Khelifi", clinic: "Clinique Veterinaire El Manar", batchNumber: "DHP-2026-TN-0831", animalId: baltoId },
    { name: "Piroplasmose", date: daysAgo(150), nextDueDate: daysFromNow(30), veterinarian: "Dr. Sami Khelifi", clinic: "Clinique Veterinaire El Manar", batchNumber: "PIR-2026-TN-0055", notes: "A surveiller, bientot du", animalId: baltoId },
    // Max
    { name: "Rage", date: daysAgo(20), nextDueDate: daysFromNow(345), veterinarian: "Dr. Sami Khelifi", clinic: "Clinique Veterinaire El Manar", batchNumber: "RAB-2026-TN-1301", animalId: maxId },
    { name: "DHPP", date: daysAgo(20), nextDueDate: daysFromNow(345), veterinarian: "Dr. Sami Khelifi", clinic: "Clinique Veterinaire El Manar", batchNumber: "DHP-2026-TN-1155", animalId: maxId },
    { name: "Leptospirose", date: daysAgo(20), nextDueDate: daysFromNow(345), veterinarian: "Dr. Sami Khelifi", clinic: "Clinique Veterinaire El Manar", batchNumber: "LEP-2026-TN-0489", animalId: maxId },
    // Minette
    { name: "Typhus", date: daysAgo(60), nextDueDate: daysFromNow(305), veterinarian: "Dr. Sami Khelifi", clinic: "Clinique Veterinaire El Manar", batchNumber: "TYP-2026-TN-0998", animalId: minetteId },
    { name: "Coryza", date: daysAgo(60), nextDueDate: daysFromNow(305), veterinarian: "Dr. Sami Khelifi", clinic: "Clinique Veterinaire El Manar", batchNumber: "COR-2026-TN-1002", animalId: minetteId },
  ];
  await db.collection("vaccinations").insertMany(vaccinations);
  console.log(`Inserted ${vaccinations.length} vaccinations`);

  // =============================================
  // RENDEZ-VOUS
  // =============================================
  const appointments = [
    // Futurs
    { title: "Rappel vaccin Leptospirose Rex", dateTime: futureAt(10,10,0), veterinarian: "Dr. Sami Khelifi", clinic: "Clinique Veterinaire El Manar, Tunis", type: "VACCINATION", status: "SCHEDULED", notes: "Rappel annuel", animalId: rexId },
    { title: "Rappel vaccin FeLV Mimi", dateTime: futureAt(3,14,30), veterinarian: "Dr. Sami Khelifi", clinic: "Clinique Veterinaire El Manar, Tunis", type: "VACCINATION", status: "SCHEDULED", notes: "Vaccin en retard", animalId: mimiId },
    { title: "Controle boiterie Sultan", dateTime: futureAt(5,11,0), veterinarian: "Dr. Nabil Saidi", clinic: "Veterinaire Sidi Bou Said", type: "CHECKUP", status: "SCHEDULED", animalId: sultanId },
    { title: "Toilettage Bella", dateTime: futureAt(7,9,30), veterinarian: "", clinic: "Salon Toilettage La Marsa", type: "GROOMING", status: "SCHEDULED", animalId: bellaId },
    { title: "Controle otite Rocky", dateTime: futureAt(2,16,0), veterinarian: "Dr. Imen Gharbi", clinic: "Clinique Veterinaire El Menzah, Tunis", type: "CHECKUP", status: "SCHEDULED", animalId: rockyId },
    { title: "Bilan annuel Princesse", dateTime: futureAt(12,10,30), veterinarian: "Dr. Anis Mathlouthi", clinic: "Clinique Les Berges du Lac, Tunis", type: "CHECKUP", status: "SCHEDULED", animalId: princesseId },
    { title: "Toilettage Simba", dateTime: futureAt(8,14,0), veterinarian: "", clinic: "Salon Vetcare Lac, Tunis", type: "GROOMING", status: "SCHEDULED", animalId: simbaId },
    { title: "Rappel Piroplasmose Balto", dateTime: futureAt(15,9,0), veterinarian: "Dr. Sami Khelifi", clinic: "Clinique Veterinaire El Manar, Tunis", type: "VACCINATION", status: "SCHEDULED", animalId: baltoId },
    { title: "Bilan annuel Max", dateTime: futureAt(20,10,0), veterinarian: "Dr. Sami Khelifi", clinic: "Clinique Veterinaire El Manar, Tunis", type: "CHECKUP", status: "SCHEDULED", notes: "Bilan + rappel vaccins", animalId: maxId },
    // Passes
    { title: "Bilan annuel Rex", dateTime: pastAt(30,10,0), veterinarian: "Dr. Sami Khelifi", clinic: "Clinique Veterinaire El Manar, Tunis", type: "CHECKUP", status: "COMPLETED", animalId: rexId },
    { title: "Sterilisation Mimi", dateTime: pastAt(180,8,30), veterinarian: "Dr. Leila Hammami", clinic: "Centre Veterinaire Lac 2, Tunis", type: "SURGERY", status: "COMPLETED", animalId: mimiId },
    { title: "Visite Sultan urgence", dateTime: pastAt(15,17,0), veterinarian: "Dr. Nabil Saidi", clinic: "Veterinaire Sidi Bou Said", type: "CHECKUP", status: "COMPLETED", animalId: sultanId },
    { title: "Controle annuel Rocky", dateTime: pastAt(25,15,0), veterinarian: "Dr. Imen Gharbi", clinic: "Clinique Veterinaire El Menzah, Tunis", type: "CHECKUP", status: "COMPLETED", animalId: rockyId },
    { title: "Vaccination Max", dateTime: pastAt(20,10,0), veterinarian: "Dr. Sami Khelifi", clinic: "Clinique Veterinaire El Manar, Tunis", type: "VACCINATION", status: "COMPLETED", animalId: maxId },
    { title: "RDV annule - Caramel", dateTime: pastAt(5,11,0), veterinarian: "Dr. Sami Khelifi", clinic: "Clinique Veterinaire El Manar, Tunis", type: "CHECKUP", status: "CANCELLED", notes: "Report pour la semaine prochaine", animalId: caramelId },
  ];
  await db.collection("appointments").insertMany(appointments);
  console.log(`Inserted ${appointments.length} appointments`);

  // =============================================
  // RAPPELS
  // =============================================
  const reminders = [
    { title: "Anti-puces Rex", message: "Appliquer Frontline Combo", dateTime: futureAt(15,8,0), type: "MEDICATION", recurring: true, recurringIntervalDays: 30, active: true, animalId: rexId },
    { title: "Vermifuge Rex", message: "Donner 1 comprime Milbemax", dateTime: futureAt(25,8,0), type: "MEDICATION", recurring: true, recurringIntervalDays: 90, active: true, animalId: rexId },
    { title: "Vaccin FeLV Mimi URGENT", message: "Rappel vaccin Leucose en retard !", dateTime: todayAt(9,0), type: "VACCINATION", recurring: false, active: true, animalId: mimiId },
    { title: "Brossage Bella", message: "Brossage quotidien poils longs", dateTime: futureAt(1,18,0), type: "GROOMING", recurring: true, recurringIntervalDays: 1, active: true, animalId: bellaId },
    { title: "Promenade Sultan", message: "Promenade a Sidi Bou Said - eviter heures chaudes", dateTime: futureAt(1,7,0), type: "OTHER", recurring: true, recurringIntervalDays: 1, active: true, animalId: sultanId },
    { title: "Nettoyage aquarium Nemo", message: "Changement partiel eau 20% + nettoyage filtre", dateTime: futureAt(3,10,0), type: "OTHER", recurring: true, recurringIntervalDays: 7, active: true, animalId: nemoId },
    { title: "Nettoyage yeux Princesse", message: "Nettoyer les yeux avec serum physiologique", dateTime: futureAt(1,9,0), type: "GROOMING", recurring: true, recurringIntervalDays: 2, active: true, animalId: princesseId },
    { title: "Toilettage Simba", message: "RDV toilettage Salon Vetcare Lac", dateTime: futureAt(8,14,0), type: "GROOMING", recurring: true, recurringIntervalDays: 60, active: true, animalId: simbaId },
    { title: "Climatisation Balto", message: "Verifier que la clim fonctionne - essentiel pour Husky a Tunis", dateTime: futureAt(1,8,0), type: "OTHER", recurring: false, active: true, animalId: baltoId },
    { title: "Anti-puces Max", message: "Comprime Bravecto tous les 3 mois", dateTime: futureAt(70,8,0), type: "MEDICATION", recurring: true, recurringIntervalDays: 90, active: true, animalId: maxId },
    { title: "Vermifuge Minette", message: "Vermifuge trimestriel", dateTime: futureAt(30,8,0), type: "MEDICATION", recurring: true, recurringIntervalDays: 90, active: true, animalId: minetteId },
    { title: "Cage Coco", message: "Nettoyage complet de la cage + graines fraiches", dateTime: futureAt(2,9,0), type: "GROOMING", recurring: true, recurringIntervalDays: 7, active: true, animalId: cocoId },
    { title: "Nourriture Drago", message: "Preparer salade (laitue, courgette, carotte rapee)", dateTime: futureAt(1,11,0), type: "FOOD", recurring: true, recurringIntervalDays: 1, active: true, animalId: dragoId },
    { title: "Litiere Oscar", message: "Changer la litiere du hamster", dateTime: futureAt(4,17,0), type: "GROOMING", recurring: true, recurringIntervalDays: 3, active: true, animalId: oscarId },
    { title: "Cage Neige", message: "Nettoyage cage + foin frais", dateTime: futureAt(2,10,0), type: "GROOMING", recurring: true, recurringIntervalDays: 3, active: true, animalId: neigeId },
  ];
  await db.collection("reminders").insertMany(reminders);
  console.log(`Inserted ${reminders.length} reminders`);

  // =============================================
  // REPAS
  // =============================================
  const meals = [
    { foodName: "Croquettes Pro Plan Large", foodBrand: "Purina Pro Plan", quantity: 250.0, unit: "GRAMS", scheduledTime: timeStr(7,0), notes: "Repas du matin", animalId: rexId },
    { foodName: "Croquettes Pro Plan Large", foodBrand: "Purina Pro Plan", quantity: 300.0, unit: "GRAMS", scheduledTime: timeStr(18,30), notes: "Repas du soir", animalId: rexId },
    { foodName: "Patee Feline Sensible", foodBrand: "Royal Canin", quantity: 85.0, unit: "GRAMS", scheduledTime: timeStr(7,30), notes: "Patee hypoallergenique (sans poulet)", animalId: mimiId },
    { foodName: "Croquettes Hypoallergenic", foodBrand: "Royal Canin", quantity: 40.0, unit: "GRAMS", scheduledTime: timeStr(18,0), animalId: mimiId },
    { foodName: "Croquettes Adult Medium", foodBrand: "Acana", quantity: 200.0, unit: "GRAMS", scheduledTime: timeStr(6,30), notes: "Avant la promenade du matin", animalId: sultanId },
    { foodName: "Croquettes Adult Medium", foodBrand: "Acana", quantity: 200.0, unit: "GRAMS", scheduledTime: timeStr(19,0), animalId: sultanId },
    { foodName: "Patee Persian Adult", foodBrand: "Royal Canin", quantity: 85.0, unit: "GRAMS", scheduledTime: timeStr(8,0), animalId: bellaId },
    { foodName: "Croquettes Persian Adult", foodBrand: "Royal Canin", quantity: 50.0, unit: "GRAMS", scheduledTime: timeStr(13,0), notes: "Libre service midi", animalId: bellaId },
    { foodName: "Croquettes Maxi Adult", foodBrand: "Royal Canin", quantity: 200.0, unit: "GRAMS", scheduledTime: timeStr(7,0), animalId: rockyId },
    { foodName: "Croquettes Maxi Adult", foodBrand: "Royal Canin", quantity: 250.0, unit: "GRAMS", scheduledTime: timeStr(18,0), animalId: rockyId },
    { foodName: "Patee Persian", foodBrand: "Whiskas", quantity: 80.0, unit: "GRAMS", scheduledTime: timeStr(7,30), animalId: princesseId },
    { foodName: "Croquettes Indoor", foodBrand: "Hill's Science Plan", quantity: 35.0, unit: "GRAMS", scheduledTime: timeStr(17,30), animalId: princesseId },
    { foodName: "Croquettes Mini Adult", foodBrand: "Royal Canin", quantity: 80.0, unit: "GRAMS", scheduledTime: timeStr(7,30), animalId: simbaId },
    { foodName: "Croquettes Mini Adult", foodBrand: "Royal Canin", quantity: 80.0, unit: "GRAMS", scheduledTime: timeStr(18,30), animalId: simbaId },
    { foodName: "Croquettes Husky Active", foodBrand: "Orijen", quantity: 200.0, unit: "GRAMS", scheduledTime: timeStr(6,30), notes: "Riche en proteines", animalId: baltoId },
    { foodName: "Croquettes Husky Active", foodBrand: "Orijen", quantity: 250.0, unit: "GRAMS", scheduledTime: timeStr(19,0), animalId: baltoId },
    { foodName: "Croquettes Golden Retriever", foodBrand: "Royal Canin", quantity: 200.0, unit: "GRAMS", scheduledTime: timeStr(7,0), notes: "Repas du matin", animalId: maxId },
    { foodName: "Croquettes Golden Retriever", foodBrand: "Royal Canin", quantity: 250.0, unit: "GRAMS", scheduledTime: timeStr(18,30), notes: "Repas du soir", animalId: maxId },
    { foodName: "Patee Feline", foodBrand: "Sheba", quantity: 85.0, unit: "GRAMS", scheduledTime: timeStr(7,30), animalId: minetteId },
    { foodName: "Croquettes Sterilise", foodBrand: "Purina ONE", quantity: 40.0, unit: "GRAMS", scheduledTime: timeStr(18,0), animalId: minetteId },
    { foodName: "Melange graines perruche", foodBrand: "Versele-Laga", quantity: 15.0, unit: "GRAMS", scheduledTime: timeStr(8,0), notes: "+ morceau de pomme frais", animalId: cocoId },
    { foodName: "Granules lapin nain", foodBrand: "Oxbow", quantity: 30.0, unit: "GRAMS", scheduledTime: timeStr(8,0), notes: "+ foin a volonte + legumes frais du souk", animalId: neigeId },
    { foodName: "Salade verte mixte", foodBrand: "Marche Tunis", quantity: 50.0, unit: "GRAMS", scheduledTime: timeStr(11,0), notes: "Laitue, courgette, carotte rapee, pissenlit", animalId: dragoId },
    { foodName: "Mix hamster complet", foodBrand: "Vitakraft", quantity: 10.0, unit: "GRAMS", scheduledTime: timeStr(18,0), notes: "+ morceaux de fruits secs en friandise", animalId: oscarId },
  ];
  await db.collection("meals").insertMany(meals);
  console.log(`Inserted ${meals.length} meals`);

  // =============================================
  // SUIVI DU POIDS
  // =============================================
  const weightRecords = [
    // Rex
    { weight: 30.0, date: daysAgo(300), notes: "Poids a l'adoption", animalId: rexId },
    { weight: 31.5, date: daysAgo(240), animalId: rexId },
    { weight: 32.8, date: daysAgo(180), animalId: rexId },
    { weight: 33.2, date: daysAgo(120), animalId: rexId },
    { weight: 33.8, date: daysAgo(60), animalId: rexId },
    { weight: 34.0, date: daysAgo(5), notes: "Poids stable, bon etat", animalId: rexId },
    // Mimi
    { weight: 3.5, date: daysAgo(250), animalId: mimiId },
    { weight: 3.9, date: daysAgo(180), notes: "Avant sterilisation", animalId: mimiId },
    { weight: 4.2, date: daysAgo(120), notes: "Apres sterilisation, prise normale", animalId: mimiId },
    { weight: 4.4, date: daysAgo(60), animalId: mimiId },
    { weight: 4.5, date: daysAgo(5), animalId: mimiId },
    // Sultan
    { weight: 22.0, date: daysAgo(300), animalId: sultanId },
    { weight: 23.5, date: daysAgo(200), animalId: sultanId },
    { weight: 24.2, date: daysAgo(120), animalId: sultanId },
    { weight: 24.8, date: daysAgo(60), animalId: sultanId },
    { weight: 25.0, date: daysAgo(3), notes: "Poids ideal pour Sloughi", animalId: sultanId },
    // Bella
    { weight: 4.5, date: daysAgo(200), animalId: bellaId },
    { weight: 4.8, date: daysAgo(120), animalId: bellaId },
    { weight: 5.0, date: daysAgo(60), animalId: bellaId },
    { weight: 5.2, date: daysAgo(4), animalId: bellaId },
    // Rocky
    { weight: 25.0, date: daysAgo(180), animalId: rockyId },
    { weight: 26.5, date: daysAgo(120), animalId: rockyId },
    { weight: 27.2, date: daysAgo(60), animalId: rockyId },
    { weight: 28.0, date: daysAgo(6), animalId: rockyId },
    // Luna
    { weight: 3.0, date: daysAgo(200), notes: "A l'adoption", animalId: lunaId },
    { weight: 3.5, date: daysAgo(100), animalId: lunaId },
    { weight: 3.8, date: daysAgo(8), animalId: lunaId },
    // Princesse
    { weight: 4.2, date: daysAgo(200), animalId: princesseId },
    { weight: 4.5, date: daysAgo(120), animalId: princesseId },
    { weight: 4.6, date: daysAgo(60), animalId: princesseId },
    { weight: 4.8, date: daysAgo(2), animalId: princesseId },
    // Simba
    { weight: 5.0, date: daysAgo(120), animalId: simbaId },
    { weight: 6.0, date: daysAgo(60), animalId: simbaId },
    { weight: 6.5, date: daysAgo(9), animalId: simbaId },
    // Balto
    { weight: 21.0, date: daysAgo(300), animalId: baltoId },
    { weight: 22.0, date: daysAgo(200), animalId: baltoId },
    { weight: 22.8, date: daysAgo(120), animalId: baltoId },
    { weight: 23.2, date: daysAgo(60), animalId: baltoId },
    { weight: 23.5, date: daysAgo(1), notes: "Poids stable malgre la chaleur", animalId: baltoId },
    // Caramel
    { weight: 5.0, date: daysAgo(150), animalId: caramelId },
    { weight: 5.5, date: daysAgo(60), notes: "Un peu en surpoids", animalId: caramelId },
    { weight: 5.8, date: daysAgo(3), notes: "Regime conseille", animalId: caramelId },
    // Max
    { weight: 28.0, date: daysAgo(300), animalId: maxId },
    { weight: 30.0, date: daysAgo(200), animalId: maxId },
    { weight: 31.5, date: daysAgo(120), animalId: maxId },
    { weight: 32.0, date: daysAgo(60), animalId: maxId },
    { weight: 32.5, date: daysAgo(1), notes: "Poids ideal", animalId: maxId },
    // Minette
    { weight: 3.2, date: daysAgo(250), notes: "A l'adoption pres de la Medina", animalId: minetteId },
    { weight: 3.5, date: daysAgo(150), animalId: minetteId },
    { weight: 3.8, date: daysAgo(60), animalId: minetteId },
    { weight: 4.0, date: daysAgo(5), animalId: minetteId },
    // Neige
    { weight: 1.2, date: daysAgo(150), notes: "Jeune lapin", animalId: neigeId },
    { weight: 1.6, date: daysAgo(60), animalId: neigeId },
    { weight: 1.9, date: daysAgo(3), animalId: neigeId },
  ];
  await db.collection("weightRecords").insertMany(weightRecords);
  console.log(`Inserted ${weightRecords.length} weight records`);

  // =============================================
  // SUMMARY
  // =============================================
  console.log("\n=== Donnees de demonstration initialisees (contexte Tunis) ===");
  console.log("7 utilisateurs | 18 animaux | 20 dossiers medicaux");
  console.log("26 vaccinations | 15 rendez-vous | 15 rappels | 24 repas | 53 pesees");
  console.log("=== Comptes ===");
  console.log("Demo:     demo@petcare.tn / demo1234");
  console.log("Amine:    amine@petcare.tn / amine1234");
  console.log("Yasmine:  yasmine@petcare.tn / yasmine1234");
  console.log("Khalil:   khalil@petcare.tn / khalil1234");
  console.log("Fatma:    fatma@petcare.tn / fatma1234");
  console.log("Ahmed:    ahmed@petcare.tn / ahmed1234");
  console.log("Vet:      vet@petcare.tn / vet1234");
  console.log("============================================");

  await client.close();
  console.log("\nDone! MongoDB connection closed.");
}

main().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});

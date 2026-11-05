import type { Animal, MedicalRecord, Vaccination, WeightEntry } from "@/types";
import { getSpeciesLabel, calculateAge, formatWeight } from "@/lib/utils";

function formatDateFR(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getMedicalTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    consultation: "Consultation",
    surgery: "Chirurgie",
    exam: "Examen",
    treatment: "Traitement",
    emergency: "Urgence",
  };
  return labels[type] || type;
}

function getVaccinationStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    up_to_date: "A jour",
    due_soon: "Bientot du",
    overdue: "En retard",
  };
  return labels[status] || status;
}

export function exportAnimalPDF(
  animal: Animal,
  medicalRecords: MedicalRecord[],
  vaccinations: Vaccination[],
  weightEntries: WeightEntry[]
): void {
  const brandColor = "#2D7A4F";
  const brandColorLight = "#E8F5EE";
  const borderColor = "#D1D5DB";
  const textColor = "#1F2937";
  const textLight = "#6B7280";

  const today = new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const medicalRows = medicalRecords
    .map(
      (r) => `
      <tr>
        <td style="padding: 8px 12px; border-bottom: 1px solid ${borderColor};">${formatDateFR(r.date)}</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid ${borderColor};">${getMedicalTypeLabel(r.type)}</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid ${borderColor};">${r.title}</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid ${borderColor};">${r.description}</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid ${borderColor};">${r.veterinarian}</td>
      </tr>`
    )
    .join("");

  const vaccinationRows = vaccinations
    .map(
      (v) => `
      <tr>
        <td style="padding: 8px 12px; border-bottom: 1px solid ${borderColor};">${v.name}</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid ${borderColor};">${formatDateFR(v.date)}</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid ${borderColor};">${formatDateFR(v.nextDueDate)}</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid ${borderColor};">${getVaccinationStatusLabel(v.status)}</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid ${borderColor};">${v.veterinarian}</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid ${borderColor};">${v.batchNumber || "-"}</td>
      </tr>`
    )
    .join("");

  const weightRows = weightEntries
    .map(
      (w) => `
      <tr>
        <td style="padding: 8px 12px; border-bottom: 1px solid ${borderColor};">${formatDateFR(w.date)}</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid ${borderColor};">${w.weight.toFixed(1)} ${w.unit}</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid ${borderColor};">${w.notes || "-"}</td>
      </tr>`
    )
    .join("");

  const htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Dossier de sante - ${animal.name}</title>
  <style>
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .page-break { page-break-before: always; }
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      color: ${textColor};
      font-size: 12px;
      line-height: 1.5;
      padding: 0;
    }
    .header {
      background: ${brandColor};
      color: white;
      padding: 24px 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .header h1 { font-size: 22px; font-weight: 700; }
    .header .subtitle { font-size: 12px; opacity: 0.85; margin-top: 2px; }
    .header .date { font-size: 11px; opacity: 0.75; text-align: right; }
    .content { padding: 24px 32px; }
    .section { margin-bottom: 28px; }
    .section-title {
      font-size: 15px;
      font-weight: 700;
      color: ${brandColor};
      border-bottom: 2px solid ${brandColor};
      padding-bottom: 6px;
      margin-bottom: 14px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
    }
    .info-item { padding: 10px 14px; background: ${brandColorLight}; border-radius: 8px; }
    .info-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; color: ${textLight}; font-weight: 600; }
    .info-value { font-size: 13px; font-weight: 600; color: ${textColor}; margin-top: 2px; }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 11px;
    }
    th {
      background: ${brandColorLight};
      color: ${brandColor};
      font-weight: 700;
      text-align: left;
      padding: 10px 12px;
      border-bottom: 2px solid ${brandColor};
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
    td { vertical-align: top; }
    .empty-msg {
      text-align: center;
      padding: 20px;
      color: ${textLight};
      font-style: italic;
    }
    .footer {
      text-align: center;
      padding: 16px 32px;
      font-size: 10px;
      color: ${textLight};
      border-top: 1px solid ${borderColor};
      margin-top: 20px;
    }
    .notes-box {
      background: #FFFBEB;
      border-left: 3px solid #F59E0B;
      padding: 10px 14px;
      border-radius: 0 6px 6px 0;
      margin-top: 8px;
      font-size: 11px;
      color: #92400E;
    }
  </style>
</head>
<body>

  <div class="header">
    <div>
      <h1>PetCare - Dossier de sante</h1>
      <div class="subtitle">${animal.name} - ${getSpeciesLabel(animal.species)}${animal.breed ? " - " + animal.breed : ""}</div>
    </div>
    <div class="date">
      Document genere le<br><strong>${today}</strong>
    </div>
  </div>

  <div class="content">

    <!-- Animal Info -->
    <div class="section">
      <div class="section-title">Informations de l'animal</div>
      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">Nom</div>
          <div class="info-value">${animal.name}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Espece</div>
          <div class="info-value">${getSpeciesLabel(animal.species)}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Race</div>
          <div class="info-value">${animal.breed || "-"}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Date de naissance</div>
          <div class="info-value">${animal.birthDate ? formatDateFR(animal.birthDate) : "-"}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Age</div>
          <div class="info-value">${animal.birthDate ? calculateAge(animal.birthDate) : "-"}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Sexe</div>
          <div class="info-value">${animal.gender === "male" ? "Male" : "Femelle"}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Poids</div>
          <div class="info-value">${animal.weight > 0 ? formatWeight(animal.weight) : "-"}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Couleur</div>
          <div class="info-value">${animal.color || "-"}</div>
        </div>
        <div class="info-item">
          <div class="info-label">N° de puce</div>
          <div class="info-value">${animal.microchipNumber || "-"}</div>
        </div>
      </div>
      ${animal.notes ? `<div class="notes-box"><strong>Notes :</strong> ${animal.notes}</div>` : ""}
    </div>

    <!-- Medical Records -->
    <div class="section">
      <div class="section-title">Historique medical</div>
      ${
        medicalRecords.length > 0
          ? `<table>
              <thead>
                <tr>
                  <th style="width: 15%;">Date</th>
                  <th style="width: 13%;">Type</th>
                  <th style="width: 20%;">Titre</th>
                  <th style="width: 35%;">Description</th>
                  <th style="width: 17%;">Veterinaire</th>
                </tr>
              </thead>
              <tbody>${medicalRows}</tbody>
            </table>`
          : '<div class="empty-msg">Aucun dossier medical enregistre</div>'
      }
    </div>

    <!-- Vaccinations -->
    <div class="section page-break">
      <div class="section-title">Vaccinations</div>
      ${
        vaccinations.length > 0
          ? `<table>
              <thead>
                <tr>
                  <th style="width: 22%;">Vaccin</th>
                  <th style="width: 15%;">Date</th>
                  <th style="width: 15%;">Prochain rappel</th>
                  <th style="width: 12%;">Statut</th>
                  <th style="width: 18%;">Veterinaire</th>
                  <th style="width: 18%;">N° lot</th>
                </tr>
              </thead>
              <tbody>${vaccinationRows}</tbody>
            </table>`
          : '<div class="empty-msg">Aucune vaccination enregistree</div>'
      }
    </div>

    <!-- Weight History -->
    <div class="section">
      <div class="section-title">Historique du poids</div>
      ${
        weightEntries.length > 0
          ? `<table>
              <thead>
                <tr>
                  <th style="width: 30%;">Date</th>
                  <th style="width: 30%;">Poids</th>
                  <th style="width: 40%;">Notes</th>
                </tr>
              </thead>
              <tbody>${weightRows}</tbody>
            </table>`
          : '<div class="empty-msg">Aucune entree de poids enregistree</div>'
      }
    </div>

  </div>

  <div class="footer">
    PetCare - Dossier de sante de ${animal.name} - Genere le ${today} - Ce document est un recapitulatif, il ne remplace pas un avis veterinaire.
  </div>

</body>
</html>`;

  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "none";
  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentWindow?.document;
  if (!iframeDoc) {
    document.body.removeChild(iframe);
    return;
  }

  iframeDoc.open();
  iframeDoc.write(htmlContent);
  iframeDoc.close();

  // Wait for content to render, then trigger print
  setTimeout(() => {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
    // Clean up after print dialog is closed
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);
  }, 500);
}

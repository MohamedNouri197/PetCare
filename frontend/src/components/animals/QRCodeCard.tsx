"use client";

import React, { useRef, useCallback } from "react";
import type { Animal } from "@/types";
import { getSpeciesLabel } from "@/lib/utils";
import { PawPrint, Download } from "lucide-react";
import Button from "@/components/ui/Button";

interface QRCodeCardProps {
  animal: Animal;
  ownerName: string;
}

/**
 * Generates a deterministic grid pattern from a string,
 * producing a QR-code-like visual based on the animal's ID.
 */
function generatePatternFromId(id: string): boolean[][] {
  const size = 21;
  const grid: boolean[][] = Array.from({ length: size }, () =>
    Array(size).fill(false)
  );

  // Seed a simple hash from the id string
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) & 0xffffffff;
  }

  function nextRand(): number {
    hash = (hash * 1103515245 + 12345) & 0x7fffffff;
    return hash;
  }

  // Draw the three finder patterns (top-left, top-right, bottom-left)
  function drawFinder(startRow: number, startCol: number) {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const isOuter = r === 0 || r === 6 || c === 0 || c === 6;
        const isInner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        grid[startRow + r][startCol + c] = isOuter || isInner;
      }
    }
  }

  drawFinder(0, 0);
  drawFinder(0, size - 7);
  drawFinder(size - 7, 0);

  // Timing patterns
  for (let i = 7; i < size - 7; i++) {
    grid[6][i] = i % 2 === 0;
    grid[i][6] = i % 2 === 0;
  }

  // Fill data area with pseudo-random pattern based on id
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      // Skip finder pattern areas and timing patterns
      const inTopLeftFinder = r < 8 && c < 8;
      const inTopRightFinder = r < 8 && c >= size - 8;
      const inBottomLeftFinder = r >= size - 8 && c < 8;
      const isTiming = r === 6 || c === 6;

      if (inTopLeftFinder || inTopRightFinder || inBottomLeftFinder || isTiming) {
        continue;
      }

      grid[r][c] = nextRand() % 3 !== 0; // ~67% fill for dense look
    }
  }

  return grid;
}

function QRPatternSVG({ id, size = 160 }: { id: string; size?: number }) {
  const grid = generatePatternFromId(id);
  const modules = grid.length;
  const moduleSize = size / modules;

  const rects: React.ReactNode[] = [];
  for (let r = 0; r < modules; r++) {
    for (let c = 0; c < modules; c++) {
      if (grid[r][c]) {
        rects.push(
          <rect
            key={`${r}-${c}`}
            x={c * moduleSize}
            y={r * moduleSize}
            width={moduleSize}
            height={moduleSize}
            fill="#1F2937"
          />
        );
      }
    }
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width={size} height={size} fill="white" />
      {rects}
    </svg>
  );
}

export default function QRCodeCard({ animal, ownerName }: QRCodeCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return;

    const cardEl = cardRef.current;
    const canvas = document.createElement("canvas");
    const scale = 2; // Retina quality
    const width = cardEl.offsetWidth;
    const height = cardEl.offsetHeight;
    canvas.width = width * scale;
    canvas.height = height * scale;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.scale(scale, scale);

    // Serialize card to SVG foreignObject for canvas rendering
    const serializer = new XMLSerializer();
    const clonedNode = cardEl.cloneNode(true) as HTMLElement;

    // Inline all computed styles
    const originalElements = cardEl.querySelectorAll("*");
    const clonedElements = clonedNode.querySelectorAll("*");
    const cardStyles = window.getComputedStyle(cardEl);

    // Apply root styles
    let inlineStyle = "";
    for (let i = 0; i < cardStyles.length; i++) {
      const prop = cardStyles[i];
      inlineStyle += `${prop}:${cardStyles.getPropertyValue(prop)};`;
    }
    clonedNode.setAttribute("style", inlineStyle);

    originalElements.forEach((origEl, index) => {
      const computed = window.getComputedStyle(origEl);
      let style = "";
      for (let i = 0; i < computed.length; i++) {
        const prop = computed[i];
        style += `${prop}:${computed.getPropertyValue(prop)};`;
      }
      (clonedElements[index] as HTMLElement).setAttribute("style", style);
    });

    const svgDataUri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
        <foreignObject width="100%" height="100%">
          <div xmlns="http://www.w3.org/1999/xhtml">
            ${serializer.serializeToString(clonedNode)}
          </div>
        </foreignObject>
      </svg>`
    )}`;

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, width, height);
      const link = document.createElement("a");
      link.download = `petcare-carte-${animal.name.toLowerCase().replace(/\s+/g, "-")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    img.onerror = () => {
      // Fallback: draw a simpler version with canvas API directly
      drawCardToCanvas(ctx, animal, ownerName, width, height);
      const link = document.createElement("a");
      link.download = `petcare-carte-${animal.name.toLowerCase().replace(/\s+/g, "-")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    img.src = svgDataUri;
  }, [animal, ownerName]);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* The card itself */}
      <div
        ref={cardRef}
        className="w-full max-w-sm bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200"
        style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
      >
        {/* Header band */}
        <div
          className="px-5 py-3 flex items-center justify-between"
          style={{ backgroundColor: "#2D7A4F" }}
        >
          <div className="flex items-center gap-2">
            <PawPrint className="w-5 h-5 text-white" />
            <span className="text-white font-bold text-sm tracking-wide">
              PetCare
            </span>
          </div>
          <span className="text-white/80 text-xs font-medium">
            Carte d&apos;identite
          </span>
        </div>

        {/* Body */}
        <div className="p-5 flex gap-4">
          {/* Left: photo or icon */}
          <div className="flex flex-col items-center gap-3 flex-shrink-0">
            <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-200">
              {animal.photoUrl ? (
                <img
                  src={animal.photoUrl}
                  alt={animal.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <PawPrint className="w-10 h-10 text-gray-400" />
              )}
            </div>
            {/* QR Pattern */}
            <div className="rounded-lg overflow-hidden border border-gray-200 p-1 bg-white">
              <QRPatternSVG id={animal.id} size={80} />
            </div>
          </div>

          {/* Right: info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 truncate">
              {animal.name}
            </h3>
            <div className="mt-2 space-y-1.5">
              <InfoRow label="Espece" value={getSpeciesLabel(animal.species)} />
              {animal.breed && <InfoRow label="Race" value={animal.breed} />}
              {animal.gender && (
                <InfoRow
                  label="Sexe"
                  value={animal.gender === "male" ? "Male" : "Femelle"}
                />
              )}
              {animal.color && <InfoRow label="Couleur" value={animal.color} />}
              {animal.microchipNumber && (
                <InfoRow label="Puce" value={animal.microchipNumber} />
              )}
              <InfoRow label="Proprietaire" value={ownerName} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="px-5 py-2.5 text-center border-t border-gray-100"
          style={{ backgroundColor: "#F0FDF4" }}
        >
          <p className="text-xs font-medium" style={{ color: "#2D7A4F" }}>
            Scannez pour voir le profil
          </p>
        </div>
      </div>

      {/* Download button */}
      <Button variant="outline" size="sm" onClick={handleDownload}>
        <Download className="w-4 h-4 mr-1.5" />
        Telecharger
      </Button>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex text-sm">
      <span className="text-gray-500 w-24 flex-shrink-0 text-xs">{label}</span>
      <span className="text-gray-900 font-medium text-xs truncate">{value}</span>
    </div>
  );
}

/**
 * Fallback: draws a simplified version of the card directly onto a canvas context,
 * in case the foreignObject SVG approach fails (e.g., CORS or browser restrictions).
 */
function drawCardToCanvas(
  ctx: CanvasRenderingContext2D,
  animal: Animal,
  ownerName: string,
  width: number,
  height: number
) {
  const brandColor = "#2D7A4F";

  // Background
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, width, height);

  // Header
  ctx.fillStyle = brandColor;
  ctx.fillRect(0, 0, width, 44);
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 14px system-ui, sans-serif";
  ctx.fillText("PetCare - Carte d'identite", 16, 28);

  // Animal name
  ctx.fillStyle = "#1F2937";
  ctx.font = "bold 18px system-ui, sans-serif";
  ctx.fillText(animal.name, 16, 76);

  // Info lines
  ctx.font = "12px system-ui, sans-serif";
  const lines = [
    `Espece: ${getSpeciesLabel(animal.species)}`,
    animal.breed ? `Race: ${animal.breed}` : "",
    `Sexe: ${animal.gender === "male" ? "Male" : "Femelle"}`,
    animal.color ? `Couleur: ${animal.color}` : "",
    animal.microchipNumber ? `Puce: ${animal.microchipNumber}` : "",
    `Proprietaire: ${ownerName}`,
  ].filter(Boolean);

  let y = 98;
  ctx.fillStyle = "#4B5563";
  for (const line of lines) {
    ctx.fillText(line, 16, y);
    y += 20;
  }

  // QR pattern area
  const grid = generatePatternFromId(animal.id);
  const qrSize = 80;
  const moduleSize = qrSize / grid.length;
  const qrX = width - qrSize - 20;
  const qrY = 56;

  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(qrX - 4, qrY - 4, qrSize + 8, qrSize + 8);
  ctx.strokeStyle = "#D1D5DB";
  ctx.strokeRect(qrX - 4, qrY - 4, qrSize + 8, qrSize + 8);

  ctx.fillStyle = "#1F2937";
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c]) {
        ctx.fillRect(
          qrX + c * moduleSize,
          qrY + r * moduleSize,
          moduleSize,
          moduleSize
        );
      }
    }
  }

  // Footer
  ctx.fillStyle = "#F0FDF4";
  ctx.fillRect(0, height - 32, width, 32);
  ctx.fillStyle = brandColor;
  ctx.font = "11px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Scannez pour voir le profil", width / 2, height - 12);
  ctx.textAlign = "start";
}

"use client";

import React from "react";
import type { MedicalRecord } from "@/types";
import { formatDate, getMedicalTypeBadge } from "@/lib/utils";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Stethoscope, FileText } from "lucide-react";

interface MedicalRecordCardProps {
  record: MedicalRecord;
}

export default function MedicalRecordCard({ record }: MedicalRecordCardProps) {
  const badge = getMedicalTypeBadge(record.type);

  return (
    <Card hoverable>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0">
          <Stethoscope className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-sm text-textColor dark:text-textColor-dark">{record.title}</h3>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
              {badge.label}
            </span>
          </div>
          <p className="text-xs text-textColor-light dark:text-textColor-dark-light mt-1 line-clamp-2">
            {record.description}
          </p>
          <div className="flex items-center gap-3 mt-2 text-xs text-textColor-light dark:text-textColor-dark-light">
            <span>{formatDate(record.date)}</span>
            {record.veterinarian && (
              <>
                <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                <span>Dr. {record.veterinarian}</span>
              </>
            )}
            {record.clinic && (
              <>
                <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                <span>{record.clinic}</span>
              </>
            )}
          </div>
          {record.notes && (
            <div className="mt-2 flex items-start gap-1.5 text-xs text-textColor-light dark:text-textColor-dark-light bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2">
              <FileText className="w-3 h-3 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-2">{record.notes}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

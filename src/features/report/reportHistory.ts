import type { DailyReportDraft, SavedReport } from "../../entities/report/types";
import { readLocalStorageJson, writeLocalStorageJson } from "../../shared/lib/storage";

export const REPORTS_STORAGE_KEY = "drb.reports.v1";

export function getSavedReports(): SavedReport[] {
  const reports = readLocalStorageJson<SavedReport[]>(REPORTS_STORAGE_KEY);
  if (!reports || !Array.isArray(reports)) return [];
  return reports;
}

export function saveSentReport(report: DailyReportDraft, projectName: string): SavedReport {
  const next: SavedReport = {
    ...report,
    id: crypto.randomUUID(),
    projectName,
    savedAt: new Date().toISOString(),
  };

  const prev = getSavedReports();
  const updated = [next, ...prev];
  writeLocalStorageJson(REPORTS_STORAGE_KEY, updated);
  return next;
}

export function getSavedReportById(id: string): SavedReport | null {
  return getSavedReports().find((r) => r.id === id) ?? null;
}


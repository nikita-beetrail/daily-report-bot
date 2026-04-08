export type TaskStatus = "done" | "in_progress" | "blocked";

export type ReportTask = {
  title: string;
  status: TaskStatus;
};

export type DailyReportDraft = {
  employeeName: string;
  date: string; // YYYY-MM-DD
  projectId: string;
  tasks: ReportTask[];
  blockers: string;
  plan: string;
  comment: string;
};

export type SavedReport = DailyReportDraft & {
  id: string;
  projectName: string;
  savedAt: string; // ISO datetime
};


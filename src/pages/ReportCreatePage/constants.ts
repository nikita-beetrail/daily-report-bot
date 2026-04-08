import type { SelectOption } from "../../shared/ui/Select";

export const PROJECT_OPTIONS: SelectOption[] = [
  { value: "", label: "Выберите проект…" },
  { value: "internal", label: "Внутренние задачи" },
  { value: "project-a", label: "Проект А" },
  { value: "project-b", label: "Проект Б" },
];

export const DRAFT_STORAGE_KEY = "drb.draft.v1";


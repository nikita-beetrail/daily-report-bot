import type { SelectOption } from "../../shared/ui/Select";

export const PROJECT_OPTIONS: SelectOption[] = [
  { value: "", label: "Выберите проект…" },
  { value: "site", label: "Сайт" },
  { value: "mamasmile", label: "MamaSmile" },
  { value: "aversev", label: "Aversev" },
  { value: "raids", label: "Рейды" },
];

export const DRAFT_STORAGE_KEY = "drb.draft.v1";


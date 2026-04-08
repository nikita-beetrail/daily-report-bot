import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { Card } from "../../shared/ui/Card";
import { Input } from "../../shared/ui/Input";
import { Select } from "../../shared/ui/Select";
import { Textarea } from "../../shared/ui/Textarea";
import { Button } from "../../shared/ui/Button";
import type { DailyReportDraft, TaskStatus } from "../../entities/report/types";
import { readLocalStorageJson, writeLocalStorageJson } from "../../shared/lib/storage";
import { DRAFT_STORAGE_KEY, PROJECT_OPTIONS } from "./constants";
import { sendTelegramReport } from "../../features/report/sendTelegramReport";
import { saveSentReport } from "../../features/report/reportHistory";

function todayIsoDate(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function statusLabel(status: TaskStatus) {
  switch (status) {
    case "done":
      return "✅ выполнено";
    case "in_progress":
      return "🔄 в процессе";
    case "blocked":
      return "🚫 заблокировано";
  }
}

const STATUS_OPTIONS = [
  { value: "done", label: statusLabel("done") },
  { value: "in_progress", label: statusLabel("in_progress") },
  { value: "blocked", label: statusLabel("blocked") },
] as const;

type FormValues = DailyReportDraft;
type SendStatus = "success" | "error" | null;
const DRAFT_INFO_TIMEOUT_MS = 120_000;

const EMPTY_DRAFT: DailyReportDraft = {
  employeeName: "",
  date: todayIsoDate(),
  projectId: "",
  tasks: [{ title: "", status: "done" }],
  blockers: "",
  plan: "",
  comment: "",
};

function isEffectivelyEmpty(values: FormValues) {
  const hasEmployeeName = values.employeeName.trim().length > 0;
  const hasTaskTitles = values.tasks.some((t) => t.title.trim().length > 0);
  const hasBlockers = values.blockers.trim().length > 0;
  const hasPlan = values.plan.trim().length > 0;
  const hasComment = values.comment.trim().length > 0;
  return !(hasEmployeeName || hasTaskTitles || hasBlockers || hasPlan || hasComment);
}

export function ReportCreatePage() {
  const form = useForm<FormValues>({
    defaultValues: EMPTY_DRAFT,
    mode: "onBlur",
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    watch,
    setError,
    clearErrors,
    reset,
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tasks",
  });

  const [message, setMessage] = React.useState<string | null>(null);
  const [sendStatus, setSendStatus] = React.useState<SendStatus>(null);
  const isHydratedRef = React.useRef(false);

  const values = watch();

  React.useEffect(() => {
    if (isHydratedRef.current) return;
    isHydratedRef.current = true;
    const storedDraft = readLocalStorageJson<FormValues>(DRAFT_STORAGE_KEY);
    if (storedDraft) {
      reset(storedDraft);
      setMessage("Черновик восстановлен автоматически");
      window.setTimeout(() => setMessage(null), DRAFT_INFO_TIMEOUT_MS);
    }
  }, [reset]);

  React.useEffect(() => {
    const id = window.setInterval(() => {
      writeLocalStorageJson(DRAFT_STORAGE_KEY, values);
      setMessage("Черновик автосохранён");
      window.setTimeout(() => setMessage(null), DRAFT_INFO_TIMEOUT_MS);
    }, 30_000);
    return () => window.clearInterval(id);
  }, [values]);

  const onSaveDraft = handleSubmit((v) => {
    writeLocalStorageJson(DRAFT_STORAGE_KEY, v);
    setMessage("Черновик сохранён");
    window.setTimeout(() => setMessage(null), DRAFT_INFO_TIMEOUT_MS);
  });

  const onSend = handleSubmit(async (v) => {
    clearErrors("root");
    if (isEffectivelyEmpty(v)) {
      setError("root", {
        type: "validate",
        message: "Нельзя отправить пустой отчёт. Заполните хотя бы одно поле.",
      });
      return;
    }
    if (!v.projectId) {
      setError("projectId", { type: "validate", message: "Выберите проект" });
      return;
    }
    if (!v.employeeName.trim()) {
      setError("employeeName", {
        type: "validate",
        message: "Укажите имя сотрудника",
      });
      return;
    }
    if (v.tasks.every((t) => !t.title.trim())) {
      setError("tasks", {
        type: "validate",
        message: "Добавьте хотя бы одну задачу (или удалите пустые строки)",
      });
      return;
    }

    const projectName =
      PROJECT_OPTIONS.find((p) => p.value === v.projectId)?.label ?? "Не выбран";

    try {
      await sendTelegramReport(v, projectName);
      saveSentReport(v, projectName);
      setSendStatus("success");
      window.setTimeout(() => setSendStatus(null), 3000);
    } catch {
      writeLocalStorageJson(DRAFT_STORAGE_KEY, v);
      setSendStatus("error");
      window.setTimeout(() => setSendStatus(null), 3000);
    }
  });

  const onReset = () => {
    reset(EMPTY_DRAFT);
    writeLocalStorageJson(DRAFT_STORAGE_KEY, EMPTY_DRAFT);
    setMessage("Форма очищена");
    window.setTimeout(() => setMessage(null), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-lg font-semibold">Создание отчёта</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Заполните день и сохраните черновик или “отправьте” (пока без интеграций).
          </p>
        </div>
        <Button type="button" variant="ghost" onClick={onReset} className="w-full sm:w-auto">
          Очистить
        </Button>
      </div>

      {message ? (
        <div className="rounded-xl border border-zinc-200 bg-zinc-100 px-4 py-3 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-200">
          {message}
        </div>
      ) : null}

      {"root" in errors && (errors as any).root?.message ? (
        <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-700 dark:text-rose-200">
          {(errors as any).root.message as string}
        </div>
      ) : null}

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <Card className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <div className="mb-1 text-sm font-medium">Имя сотрудника</div>
              <Input
                type="text"
                placeholder="Например: Никита"
                {...register("employeeName", {
                  required: "Укажите имя сотрудника",
                  validate: (value) =>
                    value.trim().length > 0 || "Укажите имя сотрудника",
                })}
                error={errors.employeeName?.message}
              />
            </div>
            <div>
              <div className="mb-1 text-sm font-medium">Дата</div>
              <Input type="date" {...register("date", { required: "Укажите дату" })} error={errors.date?.message} />
            </div>
            <div>
              <div className="mb-1 text-sm font-medium">Проект</div>
              <Select
                options={PROJECT_OPTIONS}
                {...register("projectId", { required: "Выберите проект" })}
                error={errors.projectId?.message}
              />
            </div>
          </div>
        </Card>

        <Card className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="text-sm font-semibold">Задачи</div>
              <div className="text-xs text-zinc-600 dark:text-zinc-400">
                Можно добавлять и удалять строки.
              </div>
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={() => append({ title: "", status: "done" })}
            >
              + Добавить
            </Button>
          </div>

          {(errors.tasks as any)?.message ? (
            <div className="text-xs text-rose-400">{(errors.tasks as any).message as string}</div>
          ) : null}

          {fields.length === 0 ? (
            <div className="rounded-xl border border-dashed border-zinc-300 p-4 text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
              Список задач пуст. Добавьте первую задачу.
            </div>
          ) : null}

          <div className="space-y-2">
            {fields.map((f, idx) => (
              <div
                key={f.id}
                className="grid grid-cols-1 gap-2 rounded-xl border border-zinc-200 bg-zinc-50 p-3 sm:grid-cols-[1fr_220px_auto] sm:items-start dark:border-zinc-800 dark:bg-zinc-950/40"
              >
                <div>
                  <div className="mb-1 text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    Задача
                  </div>
                  <Input
                    placeholder="Например: Подготовил план спринта"
                    {...register(`tasks.${idx}.title`, {
                      validate: (v) =>
                        v.trim().length > 0 || "Пустую задачу лучше удалить",
                    })}
                    error={errors.tasks?.[idx]?.title?.message}
                  />
                </div>
                <div>
                  <div className="mb-1 text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    Статус
                  </div>
                  <Select
                    options={STATUS_OPTIONS as any}
                    {...register(`tasks.${idx}.status`)}
                  />
                </div>
                <div className="sm:pt-6">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => remove(idx)}
                    className="w-full sm:w-auto"
                    title="Удалить задачу"
                  >
                    Удалить
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="space-y-4">
          <div>
            <div className="mb-1 text-sm font-medium">Проблемы и блокеры</div>
            <Textarea
              placeholder="Если что-то мешает — опишите кратко"
              {...register("blockers")}
            />
          </div>
          <div>
            <div className="mb-1 text-sm font-medium">План на завтра</div>
            <Textarea placeholder="Что планируете сделать завтра" {...register("plan")} />
          </div>
          <div>
            <div className="mb-1 text-sm font-medium">Комментарий (необязательно)</div>
            <Textarea placeholder="Любые детали, если нужно" {...register("comment")} />
          </div>
        </Card>

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={onSaveDraft} disabled={isSubmitting}>
            Сохранить черновик
          </Button>
          <Button type="button" onClick={onSend} disabled={isSubmitting}>
            Отправить отчёт
          </Button>
        </div>
      </form>

      {sendStatus ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div
            className={
              sendStatus === "success"
                ? "w-full max-w-md rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-8 text-center"
                : "w-full max-w-md rounded-xl border border-rose-500/40 bg-rose-500/10 p-8 text-center"
            }
          >
            {sendStatus === "success" ? (
              <>
                <div className="text-5xl">✅</div>
                <div className="mt-4 text-xl font-semibold text-emerald-300">
                  Отчёт успешно отправлен!
                </div>
              </>
            ) : (
              <>
                <div className="text-5xl">❌</div>
                <div className="mt-4 text-xl font-semibold text-rose-300">
                  Ошибка отправки ❌ Попробуйте ещё раз
                </div>
              </>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}


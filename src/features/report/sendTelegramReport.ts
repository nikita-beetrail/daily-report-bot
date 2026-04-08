import type { DailyReportDraft, TaskStatus } from "../../entities/report/types";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function formatDate(isoDate: string): string {
  const [yyyy, mm, dd] = isoDate.split("-");
  if (!yyyy || !mm || !dd) return isoDate;
  return `${dd}.${mm}.${yyyy}`;
}

function taskStatusEmoji(status: TaskStatus): string {
  switch (status) {
    case "done":
      return "✅";
    case "in_progress":
      return "🔄";
    case "blocked":
      return "🚫";
  }
}

function taskStatusText(status: TaskStatus): string {
  switch (status) {
    case "done":
      return "выполнено";
    case "in_progress":
      return "в процессе";
    case "blocked":
      return "заблокировано";
  }
}

export function formatTelegramMessage(
  report: DailyReportDraft,
  projectName: string,
): string {
  const tasks = report.tasks
    .filter((t) => t.title.trim())
    .map((t) => {
      const title = escapeHtml(t.title.trim());
      if (t.status === "done") {
        return `${taskStatusEmoji(t.status)} ${title}`;
      }
      return `${taskStatusEmoji(t.status)} ${title} (${taskStatusText(t.status)})`;
    });

  const blockers = report.blockers.trim()
    ? escapeHtml(report.blockers.trim())
    : "—";
  const plan = report.plan.trim() ? escapeHtml(report.plan.trim()) : "—";
  const comment = report.comment.trim() ? escapeHtml(report.comment.trim()) : "—";

  return [
    "📊 <b>Ежедневный отчёт</b>",
    `👤 Сотрудник: ${escapeHtml(report.employeeName)}`,
    `📅 Дата: ${escapeHtml(formatDate(report.date))}`,
    `📁 Проект: ${escapeHtml(projectName || "Не выбран")}`,
    "",
    "<b>Выполненные задачи:</b>",
    tasks.length > 0 ? tasks.join("\n") : "—",
    "",
    "<b>Проблемы/блокеры:</b>",
    blockers,
    "",
    "<b>План на завтра:</b>",
    plan,
    "",
    "<b>Комментарий:</b>",
    comment,
  ].join("\n");
}

export async function sendTelegramReport(
  report: DailyReportDraft,
  projectName: string,
) {
  const token = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
  const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    throw new Error("Не заданы переменные VITE_TELEGRAM_BOT_TOKEN/VITE_TELEGRAM_CHAT_ID");
  }

  const text = formatTelegramMessage(report, projectName);
  const endpoint = `https://api.telegram.org/bot${token}/sendMessage`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
    }),
  });

  if (!response.ok) {
    throw new Error("Ошибка HTTP при отправке");
  }

  const data = (await response.json()) as { ok?: boolean };
  if (!data.ok) {
    throw new Error("Telegram API вернул ошибку");
  }
}


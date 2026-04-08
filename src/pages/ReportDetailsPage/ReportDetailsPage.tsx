import { Link, useParams } from "react-router-dom";
import { getSavedReportById } from "../../features/report/reportHistory";
import { Card } from "../../shared/ui/Card";
import { formatRuDate } from "../../shared/lib/date";

function taskStatusLabel(status: "done" | "in_progress" | "blocked"): string {
  switch (status) {
    case "done":
      return "✅ выполнено";
    case "in_progress":
      return "🔄 в процессе";
    case "blocked":
      return "🚫 заблокировано";
  }
}

export function ReportDetailsPage() {
  const params = useParams<{ id: string }>();
  const report = params.id ? getSavedReportById(params.id) : null;

  if (!report) {
    return (
      <div className="space-y-4">
        <h1 className="text-lg font-semibold">Отчёт не найден</h1>
        <Link to="/history" className="text-sm text-indigo-400 hover:text-indigo-300">
          Вернуться в историю
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
        <h1 className="text-lg font-semibold">Отчёт за {formatRuDate(report.date)}</h1>
        <Link to="/history" className="text-sm text-indigo-400 hover:text-indigo-300">
          Назад к истории
        </Link>
      </div>

      <Card className="space-y-3">
        <div className="text-sm">
          <span className="text-zinc-600 dark:text-zinc-400">Сотрудник: </span>
          <span>{report.employeeName}</span>
        </div>
        <div className="text-sm">
          <span className="text-zinc-600 dark:text-zinc-400">Проект: </span>
          <span>{report.projectName}</span>
        </div>
        <div>
          <div className="mb-2 text-sm font-medium">Выполненные задачи</div>
          <div className="space-y-1">
            {report.tasks.map((task, idx) => (
              <div key={`${report.id}-${idx}`} className="text-sm">
                {taskStatusLabel(task.status)} {task.title}
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-1 text-sm font-medium">Проблемы/блокеры</div>
          <div className="text-sm text-zinc-700 dark:text-zinc-300">
            {report.blockers.trim() || "—"}
          </div>
        </div>
        <div>
          <div className="mb-1 text-sm font-medium">План на завтра</div>
          <div className="text-sm text-zinc-700 dark:text-zinc-300">
            {report.plan.trim() || "—"}
          </div>
        </div>
        <div>
          <div className="mb-1 text-sm font-medium">Комментарий</div>
          <div className="text-sm text-zinc-700 dark:text-zinc-300">
            {report.comment.trim() || "—"}
          </div>
        </div>
      </Card>
    </div>
  );
}


import React from "react";
import { Link } from "react-router-dom";
import { Card } from "../../shared/ui/Card";
import { getSavedReports } from "../../features/report/reportHistory";
import { formatRuDate } from "../../shared/lib/date";
import { Input } from "../../shared/ui/Input";
import { Select } from "../../shared/ui/Select";
import { PROJECT_OPTIONS } from "../ReportCreatePage/constants";

export function ReportHistoryPage() {
  const reports = getSavedReports();
  const [dateFrom, setDateFrom] = React.useState("");
  const [dateTo, setDateTo] = React.useState("");
  const [projectId, setProjectId] = React.useState("");

  const projectFilterOptions = React.useMemo(
    () => [
      { value: "", label: "Все проекты" },
      ...PROJECT_OPTIONS.filter((p) => p.value !== ""),
    ],
    [],
  );

  const filteredReports = React.useMemo(() => {
    return reports.filter((report) => {
      const matchFrom = !dateFrom || report.date >= dateFrom;
      const matchTo = !dateTo || report.date <= dateTo;
      const matchProject = !projectId || report.projectId === projectId;
      return matchFrom && matchTo && matchProject;
    });
  }, [reports, dateFrom, dateTo, projectId]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-semibold">История отчётов</h1>
        <p className="mt-1 text-sm text-zinc-400 light:text-zinc-600">
          Все отправленные отчёты, сохранённые локально.
        </p>
      </div>

      <Card className="space-y-3">
        <div className="text-sm font-medium">Фильтры</div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <div className="mb-1 text-xs text-zinc-400 light:text-zinc-600">От</div>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>
          <div>
            <div className="mb-1 text-xs text-zinc-400 light:text-zinc-600">До</div>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>
          <div>
            <div className="mb-1 text-xs text-zinc-400 light:text-zinc-600">Проект</div>
            <Select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              options={projectFilterOptions}
            />
          </div>
        </div>
      </Card>

      {reports.length === 0 ? (
        <Card>
          <div className="text-sm text-zinc-400 light:text-zinc-600">
            Пока нет отправленных отчётов.
          </div>
        </Card>
      ) : filteredReports.length === 0 ? (
        <Card>
          <div className="text-sm text-zinc-400 light:text-zinc-600">
            По выбранным фильтрам отчёты не найдены.
          </div>
        </Card>
      ) : (
        <div className="space-y-2">
          {filteredReports.map((report) => (
            <Link key={report.id} to={`/history/${report.id}`} className="block">
              <Card className="transition hover:border-zinc-600 light:hover:border-zinc-300">
                <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center sm:gap-4">
                  <div className="space-y-1">
                    <div className="text-sm font-semibold">
                      {formatRuDate(report.date)}
                    </div>
                    <div className="text-sm text-zinc-300 light:text-zinc-700">
                      {report.projectName}
                    </div>
                  </div>
                  <div className="text-sm text-zinc-400 light:text-zinc-600 sm:text-right">
                    Задач: {report.tasks.length}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}


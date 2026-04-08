import { createBrowserRouter } from "react-router-dom";
import { AppShell } from "./shared/layout/AppShell";
import { ReportCreatePage } from "./pages/ReportCreatePage";
import { ReportHistoryPage } from "./pages/ReportHistoryPage";
import { ReportDetailsPage } from "./pages/ReportDetailsPage";

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      {
        path: "/",
        element: <ReportCreatePage />,
      },
      {
        path: "/history",
        element: <ReportHistoryPage />,
      },
      {
        path: "/history/:id",
        element: <ReportDetailsPage />,
      },
    ],
  },
]);


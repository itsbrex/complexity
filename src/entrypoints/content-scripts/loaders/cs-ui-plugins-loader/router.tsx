import { createHashRouter, redirect } from "react-router-dom";

import { canvasPrePromptInstallationDialogRouterRoute } from "@/features/plugins/thread/canvas/components/PrePromptInstallationDialog";

export const createRouter = () =>
  createHashRouter([
    {
      path: "/",
      element: null,
      children: [canvasPrePromptInstallationDialogRouterRoute],
    },
    {
      path: "*",
      element: null,
      loader: () => {
        return redirect("");
      },
    },
  ]);

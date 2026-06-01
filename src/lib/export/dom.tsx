import { createRoot, type Root } from "react-dom/client";
import { flushSync } from "react-dom";
import type { ReactElement } from "react";

export type PageMount = {
  pageElement: HTMLElement;
  unmount: () => void;
};

/** Renders one export page off-screen (same CSS as preview). */
export function mountExportPage(page: ReactElement): PageMount {
  const container = document.createElement("div");
  container.className = "export-mount";
  container.setAttribute("aria-hidden", "true");
  document.body.appendChild(container);

  let root: Root | null = createRoot(container);

  flushSync(() => {
    root!.render(<div className="export-document">{page}</div>);
  });

  const pageElement = container.querySelector<HTMLElement>(".export-page");
  if (!pageElement) {
    root.unmount();
    container.remove();
    throw new Error("Не удалось подготовить страницу для экспорта");
  }

  return {
    pageElement,
    unmount: () => {
      root?.unmount();
      root = null;
      container.remove();
    },
  };
}

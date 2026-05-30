import { createRoot, type Root } from "react-dom/client";
import { flushSync } from "react-dom";
import { ExportDocument } from "../../components/ExportDocument";
import type { GeneratedBingo } from "../../types";

export type ExportMount = {
  container: HTMLElement;
  unmount: () => void;
};

export function mountExportDocument(data: GeneratedBingo): ExportMount {
  const container = document.createElement("div");
  container.className = "export-mount";
  container.setAttribute("aria-hidden", "true");
  document.body.appendChild(container);

  let root: Root | null = createRoot(container);

  flushSync(() => {
    root!.render(<ExportDocument data={data} />);
  });

  return {
    container,
    unmount: () => {
      root?.unmount();
      root = null;
      container.remove();
    },
  };
}

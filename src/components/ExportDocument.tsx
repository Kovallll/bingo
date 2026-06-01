import type { GeneratedBingo } from "../types";
import { getExportPages } from "../lib/export/layout";
import { ExportPageCard } from "./ExportPageCard";
import { ExportPageCaller } from "./ExportPageCaller";

type Props = {
  data: GeneratedBingo;
};

export function ExportDocument({ data }: Props) {
  const pages = getExportPages(data);

  return (
    <div className="export-document">
      {pages.map((cards, pageIndex) => (
        <ExportPageCard
          key={pageIndex}
          cards={cards}
          gridSize={data.settings.gridSize}
        />
      ))}
      <ExportPageCaller sheet={data.callerSheet} />
    </div>
  );
}

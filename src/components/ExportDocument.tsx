import type { CSSProperties } from "react";
import type { GeneratedBingo } from "../types";
import { BingoCard } from "./BingoCard";
import { CallerSheet } from "./CallerSheet";
import {
  callerExportMetrics,
  exportMetrics,
  getExportPages,
} from "../lib/export/layout";

type Props = {
  data: GeneratedBingo;
};

export function ExportDocument({ data }: Props) {
  const pages = getExportPages(data);
  const callerMetrics = callerExportMetrics(
    data.callerSheet.grid.length,
    data.callerSheet.columns,
  );
  const callerPageStyle = {
    "--caller-cell-size": `${callerMetrics.cellSizePx}px`,
    "--caller-cell-font": `${callerMetrics.cellFontPx}px`,
  } as CSSProperties;

  return (
    <div className="export-document">
      {pages.map((cards, pageIndex) => {
        const metrics = exportMetrics(data.settings.gridSize, cards.length);
        const pageStyle = {
          "--cell-size": `${metrics.cellSizePx}px`,
          "--cell-font": `${metrics.cellFontPx}px`,
          "--header-font": `${metrics.headerFontPx}px`,
        } as CSSProperties;

        return (
        <div
          key={pageIndex}
          className="export-page export-page-card"
          style={pageStyle}
        >
          <div
            className={
              cards.length > 1 ? "export-cards-row" : "export-cards-single"
            }
          >
            {cards.map((card) => (
              <BingoCard key={card.id} card={card} exportMode />
            ))}
          </div>
        </div>
        );
      })}
      <div className="export-page export-page-caller" style={callerPageStyle}>
        <CallerSheet sheet={data.callerSheet} exportMode />
      </div>
    </div>
  );
}

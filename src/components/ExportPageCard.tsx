import type { CSSProperties } from "react";
import type { BingoCard as BingoCardType } from "../types";
import { BingoCard } from "./BingoCard";
import { exportMetrics } from "../lib/export/layout";

type Props = {
  cards: BingoCardType[];
  gridSize: number;
};

export function ExportPageCard({ cards, gridSize }: Props) {
  const metrics = exportMetrics(gridSize, cards.length);
  const pageStyle = {
    "--cell-size": `${metrics.cellSizePx}px`,
    "--cell-font": `${metrics.cellFontPx}px`,
    "--header-font": `${metrics.headerFontPx}px`,
  } as CSSProperties;

  return (
    <div className="export-page export-page-card" style={pageStyle}>
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
}

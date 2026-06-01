import type { CSSProperties } from "react";
import type { CallerSheet as CallerSheetType } from "../types";
import { CallerSheet } from "./CallerSheet";
import { callerExportMetrics } from "../lib/export/layout";

type Props = {
  sheet: CallerSheetType;
};

export function ExportPageCaller({ sheet }: Props) {
  const metrics = callerExportMetrics(sheet.grid.length, sheet.columns);
  const pageStyle = {
    "--caller-cell-size": `${metrics.cellSizePx}px`,
    "--caller-cell-font": `${metrics.cellFontPx}px`,
  } as CSSProperties;

  return (
    <div className="export-page export-page-caller" style={pageStyle}>
      <CallerSheet sheet={sheet} exportMode />
    </div>
  );
}

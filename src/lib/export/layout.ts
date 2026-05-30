import type { GeneratedBingo } from "../../types";

/** A4 at 96 DPI — must match export CSS */
export const A4_WIDTH_PX = 794;
export const A4_HEIGHT_PX = 1123;
export const EXPORT_PADDING_PX = 32;

export type ExportMetrics = {
  cellSizePx: number;
  cellFontPx: number;
  headerFontPx: number;
};

export function cardsPerPage(gridSize: number): number {
  return gridSize <= 4 ? 2 : 1;
}

export function exportMetrics(
  gridSize: number,
  cardsOnPage: number,
): ExportMetrics {
  const contentW = A4_WIDTH_PX - EXPORT_PADDING_PX * 2;
  const contentH = A4_HEIGHT_PX - EXPORT_PADDING_PX * 2;
  const gap = cardsOnPage === 2 ? 24 : 0;
  const headerRowRatio = 0.42;

  const availW =
    cardsOnPage === 2 ? (contentW - gap) / 2 : contentW;
  const availH = contentH;

  const cellByW = Math.floor(availW / gridSize);
  const cellByH = Math.floor(availH / (gridSize + headerRowRatio));
  const cellSizePx = Math.max(28, Math.min(cellByW, cellByH));

  return {
    cellSizePx,
    cellFontPx: Math.max(14, Math.round(cellSizePx * 0.36)),
    headerFontPx: Math.max(16, Math.round(cellSizePx * 0.4)),
  };
}

/** Word A4: twips (DXA) — 1440 per inch, page 8.27×11.69 in */
export const DOCX_PAGE = {
  width: 11906,
  height: 16838,
  margin: 720,
} as const;

/** Slightly smaller cells than max fit — room for larger text */
const DOCX_CELL_SCALE = 0.9;

export type DocxBingoLayout = {
  cellWidthDxa: number;
  cellHeightDxa: number;
  headerHeightDxa: number;
  tableWidthDxa: number;
  bodyFont: number;
  headerFont: number;
};

export function docxContentArea(cardsOnPage: number) {
  const fullW = DOCX_PAGE.width - DOCX_PAGE.margin * 2;
  const fullH = DOCX_PAGE.height - DOCX_PAGE.margin * 2;
  const gap = cardsOnPage === 2 ? 360 : 0;
  const cardGapH = cardsOnPage === 2 ? 400 : 0;
  return {
    width: cardsOnPage === 2 ? Math.floor((fullW - gap) / 2) : fullW,
    height: cardsOnPage === 2 ? Math.floor((fullH - cardGapH) / 2) : fullH,
  };
}

/** Square grid sized like PDF export (min of width/height limits), centered on page */
export function docxBingoLayout(
  gridSize: number,
  cardsOnPage: number,
): DocxBingoLayout {
  const { width, height } = docxContentArea(cardsOnPage);
  const headerRowRatio = 0.42;

  const cellByW = Math.floor(width / gridSize);
  const cellByH = Math.floor(height / (gridSize + headerRowRatio));
  const cellDxa = Math.floor(Math.min(cellByW, cellByH) * DOCX_CELL_SCALE);

  const headerHeightDxa = Math.max(320, Math.floor(cellDxa * headerRowRatio));

  return {
    cellWidthDxa: cellDxa,
    cellHeightDxa: cellDxa,
    headerHeightDxa,
    tableWidthDxa: cellDxa * gridSize,
    bodyFont: Math.min(56, Math.max(24, Math.round(cellDxa / 40))),
    headerFont: Math.min(50, Math.max(22, Math.round(cellDxa / 44))),
  };
}

export type DocxCallerLayout = {
  cellWidthDxa: number;
  cellHeightDxa: number;
  tableWidthDxa: number;
  font: number;
};

export function docxCallerLayout(
  rows: number,
  columns: number,
): DocxCallerLayout {
  const { width, height } = docxContentArea(1);

  const cellByW = Math.floor(width / columns);
  const cellByH = Math.floor(height / Math.max(rows, 1));
  const cellDxa = Math.floor(Math.min(cellByW, cellByH) * DOCX_CELL_SCALE);

  return {
    cellWidthDxa: cellDxa,
    cellHeightDxa: cellDxa,
    tableWidthDxa: cellDxa * columns,
    font: Math.min(44, Math.max(18, Math.round(cellDxa / 42))),
  };
}

export type CallerExportMetrics = {
  cellSizePx: number;
  cellFontPx: number;
};

export function callerExportMetrics(
  rows: number,
  columns: number,
): CallerExportMetrics {
  const contentW = A4_WIDTH_PX - EXPORT_PADDING_PX * 2;
  const contentH = A4_HEIGHT_PX - EXPORT_PADDING_PX * 2;
  const cellByW = Math.floor(contentW / columns);
  const cellByH = Math.floor(contentH / Math.max(rows, 1));
  const cellSizePx = Math.max(28, Math.min(cellByW, cellByH));

  return {
    cellSizePx,
    cellFontPx: Math.max(14, Math.round(cellSizePx * 0.38)),
  };
}

export function chunkCards<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

export function getExportPages(data: GeneratedBingo) {
  const perPage = cardsPerPage(data.settings.gridSize);
  return chunkCards(data.cards, perPage);
}

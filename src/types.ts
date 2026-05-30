export type ExportFormat = "pdf" | "docx";

export type BingoSettings = {
  gridSize: number;
  minNumber: number;
  maxNumber: number;
  cardCount: number;
  freeCenter: boolean;
  exportFormat: ExportFormat;
};

export type CellValue = number | "Free!";

export type BingoCard = {
  id: number;
  headers: string[];
  grid: CellValue[][];
};

export type CallerSheet = {
  columns: number;
  grid: (number | null)[][];
};

export type GeneratedBingo = {
  cards: BingoCard[];
  callerSheet: CallerSheet;
  settings: BingoSettings;
};

export const DEFAULT_SETTINGS: BingoSettings = {
  gridSize: 5,
  minNumber: 1,
  maxNumber: 50,
  cardCount: 4,
  freeCenter: true,
  exportFormat: "pdf",
};

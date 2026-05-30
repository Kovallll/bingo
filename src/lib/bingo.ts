import type { BingoCard, BingoSettings, CallerSheet, CellValue, GeneratedBingo } from "../types";
import { numbersPerCard } from "./validation";

const BINGO_HEADERS = ["B", "I", "N", "G", "O"];
export const CALLER_COLUMNS = 7;

export function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = result[i]!;
    result[i] = result[j]!;
    result[j] = tmp;
  }
  return result;
}

function pickUnique(count: number, min: number, max: number): number[] {
  const pool = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  return shuffle(pool).slice(0, count);
}

export function getColumnHeaders(gridSize: number): string[] {
  if (gridSize === 5) {
    return [...BINGO_HEADERS];
  }
  return Array.from({ length: gridSize }, (_, i) =>
    String.fromCharCode(65 + i),
  );
}

function buildCardGrid(
  gridSize: number,
  min: number,
  max: number,
  freeCenter: boolean,
): CellValue[][] {
  const count = numbersPerCard(gridSize, freeCenter);
  const numbers = pickUnique(count, min, max);
  const mid = Math.floor(gridSize / 2);
  let index = 0;

  const grid: CellValue[][] = [];
  for (let row = 0; row < gridSize; row++) {
    const rowCells: CellValue[] = [];
    for (let col = 0; col < gridSize; col++) {
      if (freeCenter && row === mid && col === mid) {
        rowCells.push("Free!");
      } else {
        rowCells.push(numbers[index]!);
        index++;
      }
    }
    grid.push(rowCells);
  }
  return grid;
}

export function generateCard(
  id: number,
  settings: Pick<BingoSettings, "gridSize" | "minNumber" | "maxNumber" | "freeCenter">,
): BingoCard {
  const { gridSize, minNumber, maxNumber, freeCenter } = settings;
  return {
    id,
    headers: getColumnHeaders(gridSize),
    grid: buildCardGrid(gridSize, minNumber, maxNumber, freeCenter),
  };
}

export function generateCallerSheet(
  min: number,
  max: number,
  columns: number = CALLER_COLUMNS,
): CallerSheet {
  const numbers = shuffle(
    Array.from({ length: max - min + 1 }, (_, i) => min + i),
  );
  const rows = Math.ceil(numbers.length / columns);
  const grid: (number | null)[][] = [];

  for (let r = 0; r < rows; r++) {
    const row: (number | null)[] = [];
    for (let c = 0; c < columns; c++) {
      const value = numbers[r * columns + c];
      row.push(value ?? null);
    }
    grid.push(row);
  }

  return { columns, grid };
}

export function generateBingo(settings: BingoSettings): GeneratedBingo {
  const cards = Array.from({ length: settings.cardCount }, (_, i) =>
    generateCard(i + 1, settings),
  );
  const callerSheet = generateCallerSheet(
    settings.minNumber,
    settings.maxNumber,
  );

  return { cards, callerSheet, settings };
}

export function formatCell(value: CellValue | number | null): string {
  if (value === null) return "";
  if (value === "Free!") return "Free!";
  return String(value);
}

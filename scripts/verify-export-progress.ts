/**
 * Verifies export progress callbacks reach 100% for Word (no DOM).
 * Run: bun scripts/verify-export-progress.ts
 */
import { generateBingo } from "../src/lib/bingo";
import { generateDocx } from "../src/lib/export/docx";
import { DEFAULT_SETTINGS } from "../src/types";

const data = generateBingo({ ...DEFAULT_SETTINGS, cardCount: 12 });
const steps: { percent: number; label: string }[] = [];

await generateDocx(data, (p) => {
  steps.push(p);
  console.log(`${p.percent}% — ${p.label}`);
});

const last = steps[steps.length - 1];
if (!last || last.percent !== 100) {
  throw new Error(`Expected 100% at end, got ${last?.percent ?? "none"}`);
}

if (steps.length < 3) {
  throw new Error(`Expected multiple progress steps, got ${steps.length}`);
}

const hasPageLabel = steps.some((s) => s.label.includes("Word: страница"));
if (!hasPageLabel) {
  throw new Error("Missing page progress labels");
}

console.log(`\nOK: ${steps.length} progress updates, ended at 100%`);

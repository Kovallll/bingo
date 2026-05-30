import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
  AlignmentType,
  BorderStyle,
  PageBreak,
  TableLayoutType,
  HeightRule,
} from "docx";
import type { BingoCard, CallerSheet, CellValue, GeneratedBingo } from "../../types";
import { formatCell } from "../bingo";
import type { DocxBingoLayout, DocxCallerLayout } from "./layout";
import {
  DOCX_PAGE,
  cardsPerPage,
  docxBingoLayout,
  docxCallerLayout,
  getExportPages,
} from "./layout";

const fullBorder = {
  top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
  bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
  left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
  right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
};

const noBorder = {
  top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
};

const cellMargins = { top: 8, bottom: 8, left: 8, right: 8 };

const zeroSpacing = { before: 0, after: 0 };

function pageBreakParagraph(): Paragraph {
  return new Paragraph({
    children: [new PageBreak()],
    spacing: zeroSpacing,
  });
}

function numberCell(
  text: string,
  cellWidth: number,
  fontSize: number,
): TableCell {
  return new TableCell({
    width: { size: cellWidth, type: WidthType.DXA },
    borders: fullBorder,
    verticalAlign: AlignmentType.CENTER,
    margins: cellMargins,
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { line: 240, ...zeroSpacing },
        children: [
          new TextRun({
            text,
            font: "Arial",
            size: fontSize,
          }),
        ],
      }),
    ],
  });
}

function headerCell(
  text: string,
  cellWidth: number,
  headerFont: number,
): TableCell {
  return new TableCell({
    width: { size: cellWidth, type: WidthType.DXA },
    borders: noBorder,
    verticalAlign: AlignmentType.CENTER,
    margins: { top: 8, bottom: 24, left: 8, right: 8 },
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: zeroSpacing,
        children: [
          new TextRun({
            text,
            font: "Arial",
            size: headerFont,
            color: "888888",
          }),
        ],
      }),
    ],
  });
}

function buildCardTable(card: BingoCard, layout: DocxBingoLayout): Table {
  const {
    cellWidthDxa,
    cellHeightDxa,
    headerHeightDxa,
    tableWidthDxa,
    bodyFont,
    headerFont,
  } = layout;
  const columnWidths = card.headers.map(() => cellWidthDxa);

  const headerRow = new TableRow({
    height: { value: headerHeightDxa, rule: HeightRule.EXACT },
    cantSplit: true,
    children: card.headers.map((h) => headerCell(h, cellWidthDxa, headerFont)),
  });

  const bodyRows = card.grid.map(
    (row) =>
      new TableRow({
        height: { value: cellHeightDxa, rule: HeightRule.EXACT },
        cantSplit: true,
        children: row.map((cell: CellValue) =>
          numberCell(formatCell(cell), cellWidthDxa, bodyFont),
        ),
      }),
  );

  return new Table({
    alignment: AlignmentType.CENTER,
    layout: TableLayoutType.FIXED,
    width: { size: tableWidthDxa, type: WidthType.DXA },
    columnWidths,
    rows: [headerRow, ...bodyRows],
  });
}

function buildCallerTable(sheet: CallerSheet, layout: DocxCallerLayout): Table {
  const { cellWidthDxa, cellHeightDxa, tableWidthDxa, font } = layout;
  const columnWidths = Array.from({ length: sheet.columns }, () => cellWidthDxa);

  const rows = sheet.grid.map(
    (row) =>
      new TableRow({
        height: { value: cellHeightDxa, rule: HeightRule.EXACT },
        cantSplit: true,
        children: row.map((cell) => {
          const text = cell === null ? "" : formatCell(cell);
          return new TableCell({
            width: { size: cellWidthDxa, type: WidthType.DXA },
            borders: fullBorder,
            verticalAlign: AlignmentType.CENTER,
            margins: cellMargins,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { line: 240, ...zeroSpacing },
                children: [
                  new TextRun({ text, font: "Arial", size: font }),
                ],
              }),
            ],
          });
        }),
      }),
  );

  return new Table({
    alignment: AlignmentType.CENTER,
    layout: TableLayoutType.FIXED,
    width: { size: tableWidthDxa, type: WidthType.DXA },
    columnWidths,
    rows,
  });
}

const sectionProperties = {
  page: {
    size: {
      width: DOCX_PAGE.width,
      height: DOCX_PAGE.height,
    },
    margin: {
      top: DOCX_PAGE.margin,
      right: DOCX_PAGE.margin,
      bottom: DOCX_PAGE.margin,
      left: DOCX_PAGE.margin,
    },
  },
};

export async function generateDocx(data: GeneratedBingo): Promise<Blob> {
  const children: (Paragraph | Table)[] = [];
  const pages = getExportPages(data);
  const perPage = cardsPerPage(data.settings.gridSize);
  const gridSize = data.settings.gridSize;

  pages.forEach((cards, pageIndex) => {
    if (pageIndex > 0) {
      children.push(pageBreakParagraph());
    }

    const layout = docxBingoLayout(gridSize, cards.length);

    cards.forEach((card, cardIndex) => {
      if (cardIndex > 0 && perPage === 1) {
        children.push(pageBreakParagraph());
      } else if (cardIndex > 0) {
        children.push(new Paragraph({ text: "", spacing: zeroSpacing }));
      }

      children.push(buildCardTable(card, layout));
    });
  });

  children.push(pageBreakParagraph());
  children.push(
    buildCallerTable(
      data.callerSheet,
      docxCallerLayout(
        data.callerSheet.grid.length,
        data.callerSheet.columns,
      ),
    ),
  );

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: "Arial", size: 24 },
          paragraph: { spacing: zeroSpacing },
        },
      },
    },
    sections: [{ properties: sectionProperties, children }],
  });

  return Packer.toBlob(doc);
}

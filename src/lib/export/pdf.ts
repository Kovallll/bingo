import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { createElement } from "react";
import { ExportPageCard } from "../../components/ExportPageCard";
import { ExportPageCaller } from "../../components/ExportPageCaller";
import type { GeneratedBingo } from "../../types";
import { getExportPages } from "./layout";
import { mountExportPage } from "./dom";
import type { ExportProgressCallback } from "./progress";
import { yieldToMain } from "./progress";

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

/** 2 = max quality; 1.35 ≈ 2× faster with sharp print */
const CAPTURE_SCALE = 1.35;
const JPEG_QUALITY = 0.9;

async function capturePageToJpeg(page: HTMLElement): Promise<string> {
  const canvas = await html2canvas(page, {
    scale: CAPTURE_SCALE,
    backgroundColor: "#ffffff",
    logging: false,
    useCORS: true,
    imageTimeout: 0,
  });
  return canvas.toDataURL("image/jpeg", JPEG_QUALITY);
}

export async function generatePdf(
  data: GeneratedBingo,
  onProgress?: ExportProgressCallback,
): Promise<Blob> {
  const pages = getExportPages(data);
  const totalPages = pages.length + 1;
  const gridSize = data.settings.gridSize;

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  onProgress?.({ percent: 2, label: "PDF: подготовка…" });

  for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
    const cards = pages[pageIndex]!;
    const pageNum = pageIndex + 1;

    onProgress?.({
      percent: Math.round(3 + ((pageNum - 1) / totalPages) * 88),
      label: `PDF: страница ${pageNum} / ${totalPages}`,
    });

    const { pageElement, unmount } = mountExportPage(
      createElement(ExportPageCard, { cards, gridSize }),
    );

    try {
      const imgData = await capturePageToJpeg(pageElement);

      if (pageIndex > 0) {
        pdf.addPage();
      }

      pdf.addImage(
        imgData,
        "JPEG",
        0,
        0,
        A4_WIDTH_MM,
        A4_HEIGHT_MM,
        undefined,
        "FAST",
      );
    } finally {
      unmount();
    }

    await yieldToMain();
  }

  onProgress?.({
    percent: Math.round(92),
    label: `PDF: страница ${totalPages} / ${totalPages}`,
  });

  const { pageElement, unmount } = mountExportPage(
    createElement(ExportPageCaller, { sheet: data.callerSheet }),
  );

  try {
    const imgData = await capturePageToJpeg(pageElement);
    pdf.addPage();
    pdf.addImage(
      imgData,
      "JPEG",
      0,
      0,
      A4_WIDTH_MM,
      A4_HEIGHT_MM,
      undefined,
      "FAST",
    );
  } finally {
    unmount();
  }

  onProgress?.({ percent: 98, label: "PDF: сохранение файла…" });
  const blob = pdf.output("blob");
  onProgress?.({ percent: 100, label: "Готово" });
  return blob;
}

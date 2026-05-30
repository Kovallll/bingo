import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import type { GeneratedBingo } from "../../types";
import { mountExportDocument } from "./dom";

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

export async function generatePdf(data: GeneratedBingo): Promise<Blob> {
  const { container, unmount } = mountExportDocument(data);

  try {
    const pages = container.querySelectorAll<HTMLElement>(".export-page");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i]!;
      const canvas = await html2canvas(page, {
        scale: 2,
        backgroundColor: "#ffffff",
        logging: false,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");

      if (i > 0) {
        pdf.addPage();
      }

      pdf.addImage(imgData, "PNG", 0, 0, A4_WIDTH_MM, A4_HEIGHT_MM);
    }

    return pdf.output("blob");
  } finally {
    unmount();
  }
}

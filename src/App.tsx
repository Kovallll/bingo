import { useState } from "react";
import { SettingsForm } from "./components/SettingsForm";
import { BingoCard } from "./components/BingoCard";
import { CallerSheet } from "./components/CallerSheet";
import { ProgressBar } from "./components/ProgressBar";
import { generateBingo } from "./lib/bingo";
import { validateSettings } from "./lib/validation";
import { generatePdf } from "./lib/export/pdf";
import { generateDocx } from "./lib/export/docx";
import { downloadBlob } from "./lib/export/download";
import { DEFAULT_SETTINGS, type BingoSettings, type GeneratedBingo } from "./types";
import "./index.css";

export function App() {
  const [settings, setSettings] = useState<BingoSettings>(DEFAULT_SETTINGS);
  const [generated, setGenerated] = useState<GeneratedBingo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState({
    percent: 0,
    label: "",
  });

  const handleGenerate = () => {
    const validationError = validateSettings(settings);
    if (validationError) {
      setError(validationError);
      setGenerated(null);
      return;
    }

    setError(null);
    setGenerated(generateBingo(settings));
  };

  const handleDownload = async () => {
    if (!generated || isExporting) return;

    const timestamp = new Date().toISOString().slice(0, 10);
    const formatLabel = settings.exportFormat === "pdf" ? "PDF" : "Word";

    setIsExporting(true);
    setExportProgress({ percent: 0, label: `${formatLabel}: старт…` });

    try {
      const blob =
        settings.exportFormat === "pdf"
          ? await generatePdf(generated, setExportProgress)
          : await generateDocx(generated, setExportProgress);

      const ext = settings.exportFormat === "pdf" ? "pdf" : "docx";
      downloadBlob(blob, `bingo-${timestamp}.${ext}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Не удалось создать файл. Попробуйте ещё раз.",
      );
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Генератор бинго</h1>
        <p className="subtitle">
          Настройте параметры, сгенерируйте карточки и лист бочонков, затем
          скачайте PDF или Word для печати.
        </p>
      </header>

      <SettingsForm
        settings={settings}
        onChange={setSettings}
        onGenerate={handleGenerate}
        onDownload={handleDownload}
        canDownload={generated !== null}
        isExporting={isExporting}
      />

      {isExporting && (
        <ProgressBar
          percent={exportProgress.percent}
          label={exportProgress.label}
        />
      )}

      {error && <p className="error-message">{error}</p>}

      {generated && (
        <section className="preview">
          <h2 className="section-title">Карточки</h2>
          <div className="cards-grid">
            {generated.cards.map((card) => (
              <BingoCard key={card.id} card={card} />
            ))}
          </div>
          <CallerSheet sheet={generated.callerSheet} />
        </section>
      )}
    </div>
  );
}

export default App;

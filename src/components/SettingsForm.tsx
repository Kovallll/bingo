import type { BingoSettings } from "../types";

type Props = {
  settings: BingoSettings;
  onChange: (settings: BingoSettings) => void;
  onGenerate: () => void;
  onDownload: () => void | Promise<void>;
  canDownload: boolean;
  isExporting: boolean;
};

export function SettingsForm({
  settings,
  onChange,
  onGenerate,
  onDownload,
  canDownload,
  isExporting,
}: Props) {
  const update = <K extends keyof BingoSettings>(
    key: K,
    value: BingoSettings[K],
  ) => {
    const next = { ...settings, [key]: value };
    if (key === "gridSize" && Number(value) % 2 === 0) {
      next.freeCenter = false;
    }
    onChange(next);
  };

  const freeDisabled = settings.gridSize % 2 === 0;

  return (
    <form
      className="settings-form"
      onSubmit={(e) => {
        e.preventDefault();
        onGenerate();
      }}
    >
      <div className="form-row">
        <label htmlFor="gridSize">Размер сетки</label>
        <input
          id="gridSize"
          type="number"
          min={3}
          max={10}
          value={settings.gridSize}
          onChange={(e) => update("gridSize", Number(e.target.value))}
          disabled={isExporting}
        />
      </div>

      <div className="form-row form-row-range">
        <label>Диапазон чисел</label>
        <div className="range-inputs">
          <input
            type="number"
            value={settings.minNumber}
            onChange={(e) => update("minNumber", Number(e.target.value))}
            aria-label="Минимум"
            disabled={isExporting}
          />
          <span>—</span>
          <input
            type="number"
            value={settings.maxNumber}
            onChange={(e) => update("maxNumber", Number(e.target.value))}
            aria-label="Максимум"
            disabled={isExporting}
          />
        </div>
      </div>

      <div className="form-row">
        <label htmlFor="cardCount">Количество карточек</label>
        <input
          id="cardCount"
          type="number"
          min={1}
          value={settings.cardCount}
          onChange={(e) => update("cardCount", Number(e.target.value))}
          disabled={isExporting}
        />
      </div>

      <div className="form-row checkbox-row">
        <label htmlFor="freeCenter">
          <input
            id="freeCenter"
            type="checkbox"
            checked={settings.freeCenter}
            disabled={freeDisabled || isExporting}
            onChange={(e) => update("freeCenter", e.target.checked)}
          />
          Центр Free
        </label>
        {freeDisabled && (
          <span className="hint">Только для нечётного размера сетки</span>
        )}
      </div>

      <div className="form-row">
        <label htmlFor="exportFormat">Формат экспорта</label>
        <select
          id="exportFormat"
          value={settings.exportFormat}
          onChange={(e) =>
            update(
              "exportFormat",
              e.target.value as BingoSettings["exportFormat"],
            )
          }
          disabled={isExporting}
        >
          <option value="pdf">PDF</option>
          <option value="docx">Word (.docx)</option>
        </select>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={isExporting}>
          Сгенерировать
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          disabled={!canDownload || isExporting}
          onClick={() => void onDownload()}
        >
          {isExporting ? "Создание файла…" : "Скачать"}
        </button>
      </div>
    </form>
  );
}

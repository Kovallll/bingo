type Props = {
  percent: number;
  label?: string;
};

export function ProgressBar({ percent, label }: Props) {
  const clamped = Math.min(100, Math.max(0, percent));

  return (
    <div className="progress-block" role="status" aria-live="polite">
      <div className="progress-header">
        <span className="progress-label">{label ?? "Загрузка…"}</span>
        <span className="progress-percent">{clamped}%</span>
      </div>
      <div
        className="progress-track"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="progress-fill" style={{ width: `${clamped}%` }} />
      </div>
    </div>
  );
}

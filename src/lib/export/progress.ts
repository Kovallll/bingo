export type ExportProgress = {
  percent: number;
  label: string;
};

export type ExportProgressCallback = (progress: ExportProgress) => void;

export function yieldToMain(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
}

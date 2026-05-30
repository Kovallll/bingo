import type { BingoSettings } from "../types";

export function numbersPerCard(gridSize: number, freeCenter: boolean): number {
  const total = gridSize * gridSize;
  return freeCenter ? total - 1 : total;
}

export function validateSettings(settings: BingoSettings): string | null {
  const { gridSize, minNumber, maxNumber, cardCount, freeCenter } = settings;

  if (gridSize < 3 || gridSize > 10) {
    return "Размер сетки должен быть от 3 до 10.";
  }

  if (!Number.isInteger(minNumber) || !Number.isInteger(maxNumber)) {
    return "Диапазон должен содержать целые числа.";
  }

  if (minNumber >= maxNumber) {
    return "Минимум диапазона должен быть меньше максимума.";
  }

  if (cardCount < 1) {
    return "Количество карточек должно быть больше 0.";
  }

  if (freeCenter && gridSize % 2 === 0) {
    return "Центр Free доступен только при нечётном размере сетки (3, 5, 7…).";
  }

  const needed = numbersPerCard(gridSize, freeCenter);
  const poolSize = maxNumber - minNumber + 1;

  if (poolSize < needed) {
    return `Диапазон слишком мал: нужно минимум ${needed} уникальных чисел на карточку, в диапазоне только ${poolSize}.`;
  }

  return null;
}

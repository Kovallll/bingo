import type { BingoCard as BingoCardType } from "../types";
import { formatCell } from "../lib/bingo";

type Props = {
  card: BingoCardType;
  exportMode?: boolean;
};

export function BingoCard({ card, exportMode = false }: Props) {
  return (
    <div className={exportMode ? "bingo-card bingo-card-export" : "bingo-card"}>
      <table className="bingo-table">
        <thead>
          <tr>
            {card.headers.map((header) => (
              <th key={header} className="bingo-header">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {card.grid.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                <td
                  key={colIndex}
                  className={cell === "Free!" ? "bingo-cell free-cell" : "bingo-cell"}
                >
                  {formatCell(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

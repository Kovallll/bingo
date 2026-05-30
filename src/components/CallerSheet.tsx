import type { CallerSheet as CallerSheetType } from "../types";
import { formatCell } from "../lib/bingo";

type Props = {
  sheet: CallerSheetType;
  exportMode?: boolean;
};

export function CallerSheet({ sheet, exportMode = false }: Props) {
  return (
    <div className={exportMode ? "caller-sheet caller-sheet-export" : "caller-sheet"}>
      <table className="caller-table">
        <tbody>
          {sheet.grid.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                <td key={colIndex} className="caller-cell">
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

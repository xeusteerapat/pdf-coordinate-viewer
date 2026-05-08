import type { PdfCoordinates, TooltipPosition, CoordinateUnit } from '../types/pdf';

interface Props {
  coords: PdfCoordinates | null;
  position: TooltipPosition;
  unit: CoordinateUnit;
}

const DECIMALS: Record<CoordinateUnit, number> = { pt: 2, mm: 3, inch: 4 };

export function CoordinateTooltip({ coords, position, unit }: Props) {
  if (!coords) return null;

  const d = DECIMALS[unit];

  return (
    <div
      style={{
        position: 'fixed',
        left: position.x + 18,
        top: position.y + 18,
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    >
      <div className="bg-gray-900/95 border border-gray-600 rounded px-2.5 py-1 shadow-xl">
        <span className="font-mono text-xs text-green-400 whitespace-nowrap">
          X: {coords.x.toFixed(d)}&nbsp;&nbsp;Y: {coords.y.toFixed(d)}&nbsp;
          <span className="text-gray-500">{unit}</span>
        </span>
      </div>
    </div>
  );
}

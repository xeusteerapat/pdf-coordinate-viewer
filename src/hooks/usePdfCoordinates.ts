import { useState, useCallback } from 'react';
import type { PdfCoordinates, TooltipPosition, CoordinateUnit } from '../types/pdf';

// PDF points to other units: 1 pt = 1/72 inch = 25.4/72 mm
const PT_TO_MM = 25.4 / 72;
const PT_TO_INCH = 1 / 72;

export function usePdfCoordinates(
  pageHeightPt: number | null,
  scale: number,
  unit: CoordinateUnit,
) {
  const [coords, setCoords] = useState<PdfCoordinates | null>(null);
  const [tooltipPos, setTooltipPos] = useState<TooltipPosition>({ x: 0, y: 0 });

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      if (!pageHeightPt) return;

      const rect = event.currentTarget.getBoundingClientRect();

      // Step 1: mouse position relative to canvas in CSS pixels
      const cssX = event.clientX - rect.left;
      const cssY = event.clientY - rect.top;

      // Step 2: CSS pixels → PDF points by dividing by zoom scale
      const ptX = cssX / scale;
      // Step 3: flip Y — PDF origin is bottom-left, browser origin is top-left
      const ptY = pageHeightPt - cssY / scale;

      // Step 4: convert PDF points to the selected display unit
      const factor = unit === 'mm' ? PT_TO_MM : unit === 'inch' ? PT_TO_INCH : 1;

      setCoords({ x: ptX * factor, y: ptY * factor });
      setTooltipPos({ x: event.clientX, y: event.clientY });
    },
    [pageHeightPt, scale, unit],
  );

  const handleMouseLeave = useCallback(() => {
    setCoords(null);
  }, []);

  return { coords, tooltipPos, handleMouseMove, handleMouseLeave };
}

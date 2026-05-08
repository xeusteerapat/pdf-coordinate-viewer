import type { PdfCoordinates, CoordinateUnit } from '../types/pdf';

const PT_TO_MM = 25.4 / 72;
const PT_TO_INCH = 1 / 72;

export function computePdfCoordinates(
  clientX: number,
  clientY: number,
  canvasRect: DOMRect,
  pageHeightPt: number,
  scale: number,
  unit: CoordinateUnit,
): PdfCoordinates {
  // Step 1: mouse position relative to canvas in CSS pixels
  const cssX = clientX - canvasRect.left;
  const cssY = clientY - canvasRect.top;

  // Step 2: CSS pixels → PDF points by dividing out the zoom scale
  const ptX = cssX / scale;
  // Step 3: flip Y — PDF origin is bottom-left, browser origin is top-left
  const ptY = pageHeightPt - cssY / scale;

  // Step 4: convert PDF points to the selected display unit
  const factor = unit === 'mm' ? PT_TO_MM : unit === 'inch' ? PT_TO_INCH : 1;

  return { x: ptX * factor, y: ptY * factor };
}

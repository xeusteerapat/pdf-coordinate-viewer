import * as pdfjsLib from 'pdfjs-dist';
import type { CoordinateUnit, PdfCoordinates, TooltipPosition } from '../types/pdf';
import { usePdfPageRenderer } from '../hooks/usePdfPageRenderer';
import { computePdfCoordinates } from '../hooks/usePdfCoordinates';

interface Props {
  pdfDoc: pdfjsLib.PDFDocumentProxy;
  pageNumber: number;
  totalPages: number;
  zoom: number;
  unit: CoordinateUnit;
  onCoords: (coords: PdfCoordinates | null, pos: TooltipPosition) => void;
}

export function PdfPage({ pdfDoc, pageNumber, totalPages, zoom, unit, onCoords }: Props) {
  const { canvasRef, pageSize, rendering } = usePdfPageRenderer(pdfDoc, pageNumber, zoom);

  return (
    <div className="relative mb-8">
      {totalPages > 1 && (
        <div className="text-xs text-gray-400 font-mono mb-1 text-center">
          Page {pageNumber} / {totalPages}
        </div>
      )}
      <div className="relative shadow-2xl">
        {rendering && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800/60 z-10">
            <span className="text-gray-300 text-sm">Rendering…</span>
          </div>
        )}
        <canvas
          ref={canvasRef}
          className="block cursor-crosshair"
          onMouseMove={(e) => {
            if (!pageSize) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const coords = computePdfCoordinates(
              e.clientX,
              e.clientY,
              rect,
              pageSize.height,
              zoom,
              unit,
            );
            onCoords(coords, { x: e.clientX, y: e.clientY });
          }}
          onMouseLeave={() => onCoords(null, { x: 0, y: 0 })}
        />
      </div>
    </div>
  );
}

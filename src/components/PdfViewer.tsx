import * as pdfjsLib from 'pdfjs-dist';
import { usePdfPageRenderer } from '../hooks/usePdfPageRenderer';
import { usePdfCoordinates } from '../hooks/usePdfCoordinates';
import { CoordinateTooltip } from './CoordinateTooltip';
import type { CoordinateUnit } from '../types/pdf';

interface Props {
  pdfDoc: pdfjsLib.PDFDocumentProxy | null;
  zoom: number;
  unit: CoordinateUnit;
}

export function PdfViewer({ pdfDoc, zoom, unit }: Props) {
  const { canvasRef, pageSize, rendering } = usePdfPageRenderer(pdfDoc, 1, zoom);
  const { coords, tooltipPos, handleMouseMove, handleMouseLeave } = usePdfCoordinates(
    pageSize?.height ?? null,
    zoom,
    unit,
  );

  return (
    <div className="flex-1 overflow-auto bg-gray-600 flex items-start justify-center p-8">
      {!pdfDoc ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3 mt-24">
          <svg className="w-16 h-16 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-sm">Open a PDF file to get started</p>
        </div>
      ) : (
        <div className="relative shadow-2xl">
          {rendering && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800/50 rounded z-10">
              <span className="text-gray-300 text-sm">Rendering…</span>
            </div>
          )}
          <canvas
            ref={canvasRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="block cursor-crosshair"
          />
        </div>
      )}

      <CoordinateTooltip coords={coords} position={tooltipPos} unit={unit} />
    </div>
  );
}

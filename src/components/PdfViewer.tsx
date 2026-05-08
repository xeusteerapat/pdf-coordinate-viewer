import { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import type { CoordinateUnit, PdfCoordinates, TooltipPosition } from '../types/pdf';
import { PdfPage } from './PdfPage';
import { CoordinateTooltip } from './CoordinateTooltip';

interface Props {
  pdfDoc: pdfjsLib.PDFDocumentProxy | null;
  zoom: number;
  unit: CoordinateUnit;
}

export function PdfViewer({ pdfDoc, zoom, unit }: Props) {
  const [coords, setCoords] = useState<PdfCoordinates | null>(null);
  const [tooltipPos, setTooltipPos] = useState<TooltipPosition>({ x: 0, y: 0 });

  const handleCoords = (c: PdfCoordinates | null, pos: TooltipPosition) => {
    setCoords(c);
    if (pos.x !== 0 || pos.y !== 0) setTooltipPos(pos);
  };

  const pageCount = pdfDoc?.numPages ?? 0;

  return (
    <div className="flex-1 overflow-auto bg-gray-600 flex flex-col items-center py-8 px-4">
      {!pdfDoc ? (
        <div className="flex flex-col items-center justify-center mt-24 text-gray-400 gap-3">
          <svg
            className="w-16 h-16 opacity-40"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-sm">Open a PDF file to get started</p>
        </div>
      ) : (
        Array.from({ length: pageCount }, (_, i) => i + 1).map((pageNum) => (
          <PdfPage
            key={pageNum}
            pdfDoc={pdfDoc}
            pageNumber={pageNum}
            totalPages={pageCount}
            zoom={zoom}
            unit={unit}
            onCoords={handleCoords}
          />
        ))
      )}

      <CoordinateTooltip coords={coords} position={tooltipPos} unit={unit} />
    </div>
  );
}

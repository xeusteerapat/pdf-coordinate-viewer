import { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { usePdfDocument } from './hooks/usePdfDocument';
import { Toolbar } from './components/Toolbar';
import { PdfViewer } from './components/PdfViewer';
import type { CoordinateUnit } from './types/pdf';

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

const MIN_ZOOM = 0.25;
const MAX_ZOOM = 5;
const ZOOM_STEP = 0.25;

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [zoom, setZoom] = useState(1.0);
  const [unit, setUnit] = useState<CoordinateUnit>('pt');

  const { pdfDoc, loading, error } = usePdfDocument(file);

  const zoomIn = () => setZoom((z) => Math.min(+(z + ZOOM_STEP).toFixed(2), MAX_ZOOM));
  const zoomOut = () => setZoom((z) => Math.max(+(z - ZOOM_STEP).toFixed(2), MIN_ZOOM));
  const resetZoom = () => setZoom(1.0);

  const handleFileChange = (f: File) => {
    setFile(f);
    setZoom(1.0);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <Toolbar
        onFileChange={handleFileChange}
        zoom={zoom}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onZoomReset={resetZoom}
        unit={unit}
        onUnitChange={setUnit}
        hasFile={!!pdfDoc}
      />

      {loading && (
        <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
          Loading PDF…
        </div>
      )}

      {error && (
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded text-sm">
            Error: {error}
          </div>
        </div>
      )}

      {!loading && !error && (
        <PdfViewer pdfDoc={pdfDoc} zoom={zoom} unit={unit} />
      )}
    </div>
  );
}

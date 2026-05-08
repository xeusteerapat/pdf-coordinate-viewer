import { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

export interface PageSize {
  width: number;
  height: number;
}

export function usePdfPageRenderer(
  pdfDoc: pdfjsLib.PDFDocumentProxy | null,
  pageNumber: number,
  scale: number,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pageSize, setPageSize] = useState<PageSize | null>(null);
  const [rendering, setRendering] = useState(false);
  const renderTaskRef = useRef<pdfjsLib.RenderTask | null>(null);

  useEffect(() => {
    if (!pdfDoc) {
      setPageSize(null);
      return;
    }

    let cancelled = false;

    async function renderPage() {
      if (!pdfDoc) return;

      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
        renderTaskRef.current = null;
      }

      setRendering(true);

      try {
        const page = await pdfDoc.getPage(pageNumber);
        if (cancelled) return;

        const viewport = page.getViewport({ scale });
        const canvas = canvasRef.current;
        if (!canvas || cancelled) return;

        const dpr = window.devicePixelRatio || 1;

        // Physical canvas pixels for crisp HiDPI rendering
        canvas.width = Math.floor(viewport.width * dpr);
        canvas.height = Math.floor(viewport.height * dpr);

        // CSS display size matches viewport at the current scale
        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;

        // Page size in PDF points (unscaled) for coordinate conversion
        const naturalViewport = page.getViewport({ scale: 1 });
        setPageSize({ width: naturalViewport.width, height: naturalViewport.height });

        const ctx = canvas.getContext('2d');
        if (!ctx || cancelled) return;

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        // pdfjs-dist v5 requires `canvas` alongside `canvasContext`
        const renderTask = page.render({ canvas, canvasContext: ctx, viewport });
        renderTaskRef.current = renderTask;

        await renderTask.promise;
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'RenderingCancelledException') return;
        console.error('PDF render error:', err);
      } finally {
        if (!cancelled) setRendering(false);
      }
    }

    renderPage();

    return () => {
      cancelled = true;
      renderTaskRef.current?.cancel();
      renderTaskRef.current = null;
    };
  }, [pdfDoc, pageNumber, scale]);

  return { canvasRef, pageSize, rendering };
}

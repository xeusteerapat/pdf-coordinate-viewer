import { useState, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

export function usePdfDocument(file: File | null) {
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPdfDoc(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
      if (cancelled) return;
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const doc = await loadingTask.promise;
        if (!cancelled) setPdfDoc(doc);
      } catch (err) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : 'Failed to load PDF');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    reader.readAsArrayBuffer(file);

    return () => {
      cancelled = true;
    };
  }, [file]);

  return { pdfDoc, loading, error };
}

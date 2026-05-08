import type { CoordinateUnit } from '../types/pdf';

interface Props {
  onFileChange: (file: File) => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  unit: CoordinateUnit;
  onUnitChange: (unit: CoordinateUnit) => void;
  hasFile: boolean;
}

const UNITS: { value: CoordinateUnit; label: string }[] = [
  { value: 'pt', label: 'pt (points)' },
  { value: 'mm', label: 'mm' },
  { value: 'inch', label: 'inch' },
];

export function Toolbar({
  onFileChange,
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  unit,
  onUnitChange,
  hasFile,
}: Props) {
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileChange(file);
    e.target.value = '';
  };

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-gray-800 border-b border-gray-700 shrink-0 select-none">
      <label className="cursor-pointer bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-sm px-3 py-1.5 rounded transition-colors font-medium">
        Open PDF
        <input type="file" accept=".pdf" className="hidden" onChange={handleFileInput} />
      </label>

      {hasFile && (
        <>
          <div className="h-5 w-px bg-gray-600" />

          <div className="flex items-center gap-1">
            <button
              onClick={onZoomOut}
              className="w-7 h-7 flex items-center justify-center bg-gray-700 hover:bg-gray-600 active:bg-gray-500 text-white rounded text-base"
              title="Zoom out (−)"
            >
              −
            </button>
            <button
              onClick={onZoomReset}
              className="min-w-[58px] h-7 px-2 bg-gray-700 hover:bg-gray-600 active:bg-gray-500 text-white text-xs rounded font-mono"
              title="Reset zoom"
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              onClick={onZoomIn}
              className="w-7 h-7 flex items-center justify-center bg-gray-700 hover:bg-gray-600 active:bg-gray-500 text-white rounded text-base"
              title="Zoom in (+)"
            >
              +
            </button>
          </div>

          <div className="h-5 w-px bg-gray-600" />

          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-xs">Unit</span>
            <select
              value={unit}
              onChange={(e) => onUnitChange(e.target.value as CoordinateUnit)}
              className="bg-gray-700 text-white text-xs px-2 py-1 rounded border border-gray-600 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              {UNITS.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>
        </>
      )}
    </div>
  );
}

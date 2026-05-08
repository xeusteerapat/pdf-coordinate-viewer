# Agent Prompt: PDF Viewer with Real-time Cursor Coordinates

You are helping me build a web application for viewing PDF files with a real-time cursor coordinate system, similar to how AutoCAD shows cursor coordinates while moving over a drawing.

## Goal

Build a web application that allows users to upload or open a PDF file, render the PDF in the browser, and show the cursor position as real-time coordinates when the mouse moves over the PDF page.

The coordinate display should feel similar to CAD software:

- When the user moves the mouse over the PDF page, show X/Y coordinates.
- The coordinate values should update in real time.
- The coordinates should be based on the PDF page coordinate system, not only browser pixels.
- The cursor coordinate label should be easy to read and visually follow or stay near the cursor.
- The application should support zooming and panning without breaking coordinate accuracy.

## Recommended Tech Stack

Use this stack unless there is a strong reason not to:

- React
- TypeScript
- Vite
- PDF.js / `pdfjs-dist`
- Tailwind CSS

Avoid using a heavy PDF viewer library unless necessary. Prefer using PDF.js directly so we can control rendering, mouse events, coordinate conversion, zoom, and overlays.

## Core Features

### 1. PDF Loading

Implement a simple PDF loading flow:

- User can upload a PDF file from local machine.
- Render the first page of the PDF.
- Keep the structure flexible so multiple pages can be added later.

Do not implement backend upload yet. Keep everything client-side.

### 2. PDF Rendering

Render the PDF page using PDF.js into a `<canvas>`.

Requirements:

- Use PDF.js to load and render the page.
- Render the PDF page at the current zoom scale.
- Re-render when zoom changes.
- Keep canvas size synchronized with the rendered PDF viewport.
- Support high-DPI screens using `devicePixelRatio` if possible.

### 3. Real-time Cursor Coordinates

Track mouse movement over the PDF canvas or overlay layer.

When the mouse moves:

- Read the mouse position relative to the PDF canvas.
- Convert screen/canvas coordinates into PDF page coordinates.
- Display the current coordinate as:

```txt
X: 123.45, Y: 678.90
```

Important:

- Browser mouse coordinates usually start from the top-left.
- PDF coordinate systems usually start from the bottom-left.
- Implement coordinate conversion clearly and comment it well.
- The displayed coordinate should represent PDF coordinate space as accurately as possible.

Example logic:

```ts
const rect = canvas.getBoundingClientRect();

const screenX = event.clientX - rect.left;
const screenY = event.clientY - rect.top;

const pdfX = screenX / scale;
const pdfY = pageHeight - screenY / scale;
```

Adjust this based on how PDF.js viewport transform is used.

### 4. Cursor Coordinate UI

Create an overlay UI similar to CAD software.

Requirements:

- Show a small floating coordinate tooltip near the cursor.
- Hide it when the cursor leaves the PDF page.
- Keep it readable and not too distracting.
- Use monospace font for coordinate values.
- Add subtle styling, for example dark background, light text, rounded corners.

Example visual:

```txt
┌─────────────────────┐
│ X: 123.45 Y: 678.90 │
└─────────────────────┘
```

### 5. Zoom Controls

Add simple zoom controls:

- Zoom in
- Zoom out
- Reset zoom

Requirements:

- Coordinates must remain accurate after zooming.
- Re-render the PDF page after zoom changes.
- Display current zoom level, for example `100%`.

### 6. Optional Pan Support

If it is simple, add pan support:

- User can drag the PDF area to pan.
- Use a scrollable container or transform-based pan.
- Coordinate calculation must still work correctly after panning.

If pan support makes the code too complex, implement the layout with a scrollable container first.

## UI Layout

Create a simple CAD-like layout:

- Top toolbar:
  - Upload PDF button
  - Zoom in
  - Zoom out
  - Reset zoom
  - Current zoom percentage

- Main viewer area:
  - Dark gray background
  - PDF page centered
  - Canvas for PDF page
  - Coordinate overlay above the canvas

The PDF page should look like a document placed on a dark workspace.

## Architecture

Structure the code cleanly.

Suggested files:

```txt
src/
  App.tsx
  components/
    PdfViewer.tsx
    Toolbar.tsx
    CoordinateTooltip.tsx
  hooks/
    usePdfDocument.ts
    usePdfPageRenderer.ts
    usePdfCoordinates.ts
  types/
    pdf.ts
```

If this is too much for the first implementation, start simpler, but keep the code easy to refactor.

## Code Quality Requirements

- Use TypeScript.
- Avoid `any` unless absolutely necessary.
- Add comments for coordinate conversion logic.
- Keep PDF rendering logic separate from UI components where possible.
- Handle loading and error states.
- Clean up PDF.js render tasks to avoid race conditions when zoom changes quickly.
- Avoid memory leaks when loading new PDF files.
- Make the first version functional before adding extra polish.

## Important Technical Notes

PDF.js viewport and canvas rendering can be tricky.

Please pay special attention to:

- `page.getViewport({ scale })`
- Canvas width and height
- CSS width and height
- `devicePixelRatio`
- Mouse position relative to the visible canvas
- Converting browser coordinates to PDF coordinates
- PDF Y-axis direction

When using high-DPI rendering, remember that the canvas internal pixel size may differ from its CSS display size. Mouse coordinates should be calculated using the canvas bounding rectangle, not raw canvas pixel dimensions.

## Implementation Steps

Please implement this incrementally.

### Step 1

Create a Vite + React + TypeScript app.

Install required dependencies:

```bash
npm install pdfjs-dist
```

Add Tailwind CSS if not already included.

### Step 2

Implement local PDF upload.

### Step 3

Render the first PDF page to canvas using PDF.js.

### Step 4

Track mouse position over the rendered PDF canvas.

### Step 5

Convert mouse position to PDF coordinates.

### Step 6

Show floating real-time coordinate tooltip.

### Step 7

Add zoom controls and make sure coordinate conversion still works.

### Step 8

Clean up structure and add comments.

## Expected Behavior

When I upload a PDF:

1. The first page appears in the viewer.
2. When I move my mouse over the page, a coordinate tooltip appears.
3. The coordinate tooltip updates in real time.
4. The coordinate value should change smoothly as the cursor moves.
5. When I zoom in/out, the cursor coordinate should still map correctly to the PDF.
6. When the cursor leaves the PDF page, the coordinate tooltip should disappear.

## Do Not Do Yet

Do not implement these unless the basic version is complete:

- Backend API
- Database
- User login
- Annotation saving
- Multi-page navigation
- Drawing tools
- Measurement tools
- Export modified PDF

## Nice-to-have Later

After the MVP works, suggest how to add:

- Multi-page support
- Crosshair cursor
- Ruler/grid overlay
- Measurement between two points
- Unit conversion, for example PDF points to mm/inch
- Calibration scale, for example map PDF units to real-world drawing units
- Annotation layer
- Save/load annotations
- Snap-to-grid
- Coordinate origin customization

## Extra Instruction for the Agent

Before writing code, briefly explain the coordinate conversion strategy.

Then implement only the MVP first:

- Upload PDF
- Render first page
- Real-time cursor coordinate
- Zoom controls

Do not add complex features until the MVP is working.

## Important Reminder

Do not display `clientX` and `clientY` directly as the final coordinates.

Those are browser viewport coordinates, not PDF coordinates.

Always convert cursor position through:

1. Canvas bounding rectangle
2. Current zoom scale
3. PDF page viewport/page height
4. PDF Y-axis direction

The coordinate calculation should remain correct after zooming.

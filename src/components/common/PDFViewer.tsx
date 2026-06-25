import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// react-pdf v10 + pdfjs-dist v5 — worker MUST be loaded from a URL
// Use unpkg CDN to serve the correct ESM worker for pdfjs-dist v5.x
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
  pdfUrl: string;
  onClose: () => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl, onClose }) => {
  const [numPages, setNumPages]   = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale]         = useState(1.0);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const containerRef              = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(800);

  // Measure the container width so the PDF page fills it properly
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth - 48);
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
    setLoading(false);
    setError(null);
  }, []);

  const onDocumentLoadError = useCallback((err: Error) => {
    setLoading(false);
    setError(err.message || 'Failed to load PDF. Please try downloading it instead.');
  }, []);

  const prevPage = () => setPageNumber(p => Math.max(1, p - 1));
  const nextPage = () => setPageNumber(p => Math.min(numPages, p + 1));

  const zoomIn  = () => setScale(s => Math.min(2.5, +(s + 0.2).toFixed(1)));
  const zoomOut = () => setScale(s => Math.max(0.5, +(s - 0.2).toFixed(1)));

  // Close on backdrop click
  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      onClick={handleBackdrop}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.88)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        style={{
          background: '#1C1C28',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '900px',
          maxHeight: '95vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 24px 80px rgba(0,0,0,0.7)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* ── Header toolbar ── */}
        <div style={{
          background: '#13131f',
          borderBottom: '1px solid #2A2A3D',
          padding: '12px 20px',
          display: 'flex', alignItems: 'center', gap: '12px',
          flexShrink: 0,
        }}>
          {/* Page navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={prevPage}
              disabled={pageNumber <= 1}
              style={btnStyle(pageNumber <= 1)}
              title="Previous page"
            >‹</button>
            <span style={{ color: '#aaa', fontSize: '13px', minWidth: '80px', textAlign: 'center' }}>
              {numPages > 0 ? `${pageNumber} / ${numPages}` : '—'}
            </span>
            <button
              onClick={nextPage}
              disabled={pageNumber >= numPages}
              style={btnStyle(pageNumber >= numPages)}
              title="Next page"
            >›</button>
          </div>

          <div style={{ width: '1px', height: '24px', background: '#2A2A3D' }} />

          {/* Zoom */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button onClick={zoomOut} style={btnStyle(scale <= 0.5)} title="Zoom out">−</button>
            <span style={{ color: '#aaa', fontSize: '12px', minWidth: '44px', textAlign: 'center' }}>
              {Math.round(scale * 100)}%
            </span>
            <button onClick={zoomIn} style={btnStyle(scale >= 2.5)} title="Zoom in">+</button>
          </div>

          <div style={{ flex: 1 }} />

          {/* Close */}
          <button
            onClick={onClose}
            style={{
              background: '#e94560', border: 'none', color: '#fff',
              width: '34px', height: '34px', borderRadius: '8px',
              cursor: 'pointer', fontSize: '16px', fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            title="Close"
          >✕</button>
        </div>

        {/* ── PDF area ── */}
        <div
          ref={containerRef}
          style={{
            flex: 1, overflowY: 'auto', overflowX: 'auto',
            padding: '24px', display: 'flex',
            flexDirection: 'column', alignItems: 'center', gap: '16px',
          }}
        >
          {error ? (
            <div style={{
              background: '#2A2A3D', borderRadius: '12px', padding: '40px',
              textAlign: 'center', color: '#e94560', maxWidth: '400px',
            }}>
              <p style={{ fontSize: '40px', marginBottom: '16px' }}>⚠️</p>
              <p style={{ fontWeight: 600, marginBottom: '8px' }}>Could not load PDF</p>
              <p style={{ color: '#6B6B8A', fontSize: '13px' }}>{error}</p>
            </div>
          ) : (
            <Document
              file={pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={
                <div style={{ color: '#6B6B8A', padding: '60px', textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>📄</div>
                  <p>Loading PDF…</p>
                </div>
              }
            >
              {!loading && numPages > 0 && (
                <Page
                  pageNumber={pageNumber}
                  scale={scale}
                  width={containerWidth}
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                />
              )}
            </Document>
          )}
        </div>

        {/* ── Footer page jump ── */}
        {numPages > 0 && (
          <div style={{
            background: '#13131f', borderTop: '1px solid #2A2A3D',
            padding: '10px 20px', display: 'flex', justifyContent: 'center',
            alignItems: 'center', gap: '10px', flexShrink: 0,
          }}>
            <span style={{ color: '#6B6B8A', fontSize: '12px' }}>Go to page:</span>
            <input
              type="number"
              min={1}
              max={numPages}
              value={pageNumber}
              onChange={e => {
                const val = parseInt(e.target.value, 10);
                if (!isNaN(val) && val >= 1 && val <= numPages) setPageNumber(val);
              }}
              style={{
                width: '60px', padding: '4px 8px', borderRadius: '6px',
                background: '#2A2A3D', border: '1px solid #3A3A55',
                color: '#fff', fontSize: '13px', textAlign: 'center', outline: 'none',
              }}
            />
            <span style={{ color: '#6B6B8A', fontSize: '12px' }}>of {numPages}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Shared button style helper
const btnStyle = (disabled: boolean): React.CSSProperties => ({
  background: disabled ? '#1C1C28' : '#2A2A3D',
  border: '1px solid #3A3A55',
  color: disabled ? '#3A3A55' : '#aaa',
  width: '30px', height: '30px', borderRadius: '6px',
  cursor: disabled ? 'not-allowed' : 'pointer',
  fontSize: '16px', fontWeight: 700,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  transition: 'background 0.15s, color 0.15s',
});

export default PDFViewer;

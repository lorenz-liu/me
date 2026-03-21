'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
  file: string;
}

export default function PDFViewer({ file }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [isToolbarVisible, setIsToolbarVisible] = useState(true);
  const hideToolbarTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetToolbarHideTimer = useCallback(() => {
    if (hideToolbarTimeoutRef.current) {
      clearTimeout(hideToolbarTimeoutRef.current);
    }

    hideToolbarTimeoutRef.current = setTimeout(() => {
      setIsToolbarVisible(false);
    }, 2000);
  }, []);

  const wakeToolbar = useCallback(() => {
    setIsToolbarVisible(true);
    resetToolbarHideTimer();
  }, [resetToolbarHideTimer]);

  useEffect(() => {
    resetToolbarHideTimer();

    return () => {
      if (hideToolbarTimeoutRef.current) {
        clearTimeout(hideToolbarTimeoutRef.current);
      }
    };
  }, [resetToolbarHideTimer]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = file;
    link.download = 'resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative h-full overflow-auto bg-gray-100 rounded-xl">
      <div
        className="flex items-center-safe justify-center min-h-full py-2.5"
        onClick={wakeToolbar}
      >
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
        >
          <Page
            pageNumber={pageNumber}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            width={Math.min(window.innerWidth - 68, 700)}
          />
        </Document>
      </div>

      <div
        className={`fixed bottom-18 left-1/2 transform -translate-x-1/2 flex items-center gap-2 px-2 py-2 bg-gray-900/50 rounded-full shadow-lg z-10 transition-opacity duration-500 ${isToolbarVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={resetToolbarHideTimer}
      >
        {numPages > 1 && (
          <>
            <button
              onClick={() => {
                setPageNumber(page => Math.max(1, page - 1));
                resetToolbarHideTimer();
              }}
              disabled={pageNumber <= 1}
              className="p-2 hover:bg-white/10 text-white rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-sm text-white px-2 min-w-[3rem] text-center">
              {pageNumber}/{numPages}
            </span>
            <button
              onClick={() => {
                setPageNumber(page => Math.min(numPages, page + 1));
                resetToolbarHideTimer();
              }}
              disabled={pageNumber >= numPages}
              className="p-2 hover:bg-white/10 text-white rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <div className="w-px h-6 bg-white/20 mx-1" />
          </>
        )}
        <button
          onClick={() => {
            handleDownload();
            resetToolbarHideTimer();
          }}
          className="p-2 hover:bg-white/10 text-white rounded-full transition-colors"
          aria-label="Download PDF"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </button>
      </div>
    </div>
  );
}

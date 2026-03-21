'use client';

import dynamic from 'next/dynamic';

const PDFViewer = dynamic(() => import('@/components/PDFViewer'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full">Loading PDF...</div>
});

export default function Resume() {
  return (
    <div className="w-full h-[calc(100vh-12rem)] md:h-[calc(100vh-200px)]">
      <PDFViewer file="/pdf/zhaoxun-lorenz-liu.pdf" />
    </div>
  );
}

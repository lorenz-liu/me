import PDFViewer from '@/components/PDFViewer';

export default function Resume() {
  return (
    <div className="w-full h-[calc(100vh-12rem)] md:h-[calc(100vh-200px)]">
      <PDFViewer file="/pdf/zhaoxun-lorenz-liu.pdf" />
    </div>
  );
}

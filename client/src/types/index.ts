export interface PdfFile {
  file: File | null;
  serverPath: string | null;
}

export interface PdfPageProps {
  pdfPath: string;
}

export interface SideBarProps {
  onPageSelect: number[];
  onGeneratePDF: (selectedPages: string) => void;
  downloadLink: string | null;
  onInputChange: (input: string) => void;
  totalPages: number;
  isImagesLoaded: boolean;
}

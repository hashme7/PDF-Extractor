import { createContext, useContext, useState, ReactNode } from "react";
import { PdfFile } from "../types";

interface PdfContextType {
  pdfFile: PdfFile;
  setPdfFile: (pdfFile: PdfFile) => void;
  isUploading: boolean;
  setIsUploading: (isUploading: boolean) => void;
}

const PdfContext = createContext<PdfContextType | undefined>(undefined);

export const PdfProvider = ({ children }: { children: ReactNode }) => {
  const [pdfFile, setPdfFile] = useState<PdfFile>({
    file: null,
    serverPath: null,
  });
  const [isUploading, setIsUploading] = useState<boolean>(false);

  return (
    <PdfContext.Provider
      value={{ pdfFile, setPdfFile, isUploading, setIsUploading }}
    >
      {children}
    </PdfContext.Provider>
  );
};

export const usePdfContext = () => {
  const context = useContext(PdfContext);
  if (!context) {
    throw new Error("usePdfContext must be used within a PdfProvider");
  }
  return context;
};

import { useEffect, useState, useCallback } from "react";
import * as pdfjsLib from "pdfjs-dist";
import axios from "axios";

interface PdfPageHookProps {
  pdfPath: string;
}

interface PdfPageHookReturn {
  images: string[];
  selectedImage: string[];
  generatedPdfLink: string | null;
  selectedPreviewImage: number;
  totalPdfPage: number;
  selectedPages: number[];
  isModalOpen: boolean;
  isLoading: boolean;
  showPageSelector: boolean;
  error: string | null;
  setSelectedPreviewImage: React.Dispatch<React.SetStateAction<number>>;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setShowPageSelector: React.Dispatch<React.SetStateAction<boolean>>;
  generatePdf: (selectedPages: string) => Promise<void>;
  inputChange: (input: string) => void;
  handleImageSelection: (image: string, index: number) => void;
}

export const usePdfPage = ({
  pdfPath,
}: PdfPageHookProps): PdfPageHookReturn => {
  const [images, setImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string[]>([]);
  const [generatedPdfLink, setGeneratedPdfLink] = useState<string | null>(null);
  const [selectedPreviewImage, setSelectedPreviewImage] = useState<number>(0);
  const [totalPdfPage, setTotalPdfPage] = useState(0);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPageSelector, setShowPageSelector] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use environment variable for API URL
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  // Generate PDF via API
  const generatePdf = useCallback(
    async (selectedPages: string) => {
      if (!selectedPages) {
        setError("No pages selected");
        return;
      }
      try {
        const res = await axios.post<{ generatedDownloadLink: string }>(
          `${API_URL}/generatepdf`,
          {
            selectedPages,
            pdfPath,
          }
        );
        setGeneratedPdfLink(res.data.generatedDownloadLink);
        setError(null);
      } catch (err: any) {
        console.error("Error generating PDF:", err);
        setError("Failed to generate PDF");
      }
    },
    [pdfPath, API_URL]
  );

  // Handle page range input (e.g., "1,3-5")
  const inputChange = useCallback(
    (input: string) => {
      if (!input.trim()) return;

      const numArr = input.split(",").map((s) => s.trim());
      const newSelectedPages: number[] = [];
      const newSelectedImages: string[] = [];

      for (const str of numArr) {
        if (str.includes("-")) {
          const [start, end] = str
            .split("-")
            .map((s) => Number(s.trim()))
            .filter((n) => !isNaN(n));
          if (
            start &&
            end &&
            start <= end &&
            start > 0 &&
            end <= totalPdfPage
          ) {
            for (let i = start; i <= end; i++) {
              newSelectedPages.push(i);
              if (images[i - 1]) {
                newSelectedImages.push(images[i - 1]);
              }
            }
          }
        } else {
          const num = Number(str);
          if (!isNaN(num) && num > 0 && num <= totalPdfPage) {
            newSelectedPages.push(num);
            if (images[num - 1]) {
              newSelectedImages.push(images[num - 1]);
            }
          }
        }
      }

      setSelectedPages(newSelectedPages);
      setSelectedImage(newSelectedImages);
      setError(null);
    },
    [images, totalPdfPage]
  );

  // Handle individual page selection
  const handleImageSelection = useCallback(
    (image: string, index: number) => {
      if (!images[index]) return;

      setSelectedImage((prev) => {
        if (prev.includes(image)) {
          if (selectedPreviewImage > 0) {
            setSelectedPreviewImage((prev) => prev - 1);
          }
          return prev.filter((img) => img !== image);
        }
        return [...prev, image];
      });

      setSelectedPages((prev) =>
        prev.includes(index + 1)
          ? prev.filter((num) => num !== index + 1)
          : [...prev, index + 1]
      );
    },
    [images, selectedPreviewImage]
  );

  // Load and render PDF pages
  useEffect(() => {
    let isCancelled = false;

    const loadPdf = async () => {
      if (!pdfPath) {
        setError("No PDF path provided");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;

      try {
        const loadingTask = pdfjsLib.getDocument(pdfPath);
        const pdfDoc = await loadingTask.promise;
        if (isCancelled) return;

        const numPages = pdfDoc.numPages;
        setTotalPdfPage(numPages);

        const pageImages: string[] = [];
        for (let i = 1; i <= numPages && !isCancelled; i++) {
          const page = await pdfDoc.getPage(i);
          const viewport = page.getViewport({ scale: 1.5 });
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          if (!context) continue;

          canvas.height = viewport.height;
          canvas.width = viewport.width;

          await page.render({ canvasContext: context, viewport }).promise;
          pageImages.push(canvas.toDataURL("image/png"));
        }

        if (!isCancelled) {
          setImages(pageImages);
        }
      } catch (err: any) {
        console.error("Error loading PDF:", err);
        if (!isCancelled) {
          setError("Failed to load PDF");
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    loadPdf();

    return () => {
      isCancelled = true;
    };
  }, [pdfPath]);

  return {
    images,
    selectedImage,
    generatedPdfLink,
    selectedPreviewImage,
    totalPdfPage,
    selectedPages,
    isModalOpen,
    isLoading,
    showPageSelector,
    error,
    setSelectedPreviewImage,
    setIsModalOpen,
    setShowPageSelector,
    generatePdf,
    inputChange,
    handleImageSelection,
  };
};

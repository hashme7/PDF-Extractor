import { useEffect, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import axios from "axios";
import SideBar from "./Sidebar";
import Loader from "./Loader";
import { PdfPageProps } from "../types";
import placeholderImage from "../assets/placeholder.png";
import {
  FaChevronRight,
  FaChevronLeft,
  FaEye,
  FaCheck,
  FaTimes,
} from "react-icons/fa";

const PdfPage: React.FC<PdfPageProps> = ({ pdfPath }) => {
  const [images, setImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string[]>([]);
  const [generatedPdfLink, setGeneratedPdfLink] = useState<string | null>(null);
  const [selectedPreviewImage, setSelectedPreviewImage] = useState<number>(0);
  const [totalPdfPage, setTotalPdfPage] = useState(0);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPageSelector, setShowPageSelector] = useState(false);

  const generatePdf = async (selectedPages: string) => {
    try {
      const res = await axios.post("http://localhost:3000/generatepdf", {
        selectedPages,
        pdfPath,
      });
      setGeneratedPdfLink(res.data.generatedDownloadLink);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const inputChange = (input: string) => {
    const numArr = input.split(",");
    setSelectedPages([]);
    const newSelectedImages: string[] = [];
    for (const str of numArr) {
      if (str.includes("-")) {
        const arr = str.split("-");
        for (let i = Number(arr[0]); i <= Number(arr[1]); i++) {
          setSelectedPages((prev) => [...prev, i]);
          newSelectedImages.push(images[i - 1]);
        }
      } else {
        setSelectedPages((prev) => [...prev, Number(str)]);
        newSelectedImages.push(images[Number(str) - 1]);
      }
    }
    setSelectedImage(newSelectedImages);
  };

  const handleImageSelection = (image: string, index: number) => {
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
  };

  useEffect(() => {
    const loadPdf = async () => {
      setIsLoading(true);
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;

      try {
        const loadingTask = pdfjsLib.getDocument(pdfPath);
        const pdfDoc = await loadingTask.promise;
        const numPages = pdfDoc.numPages;
        setTotalPdfPage(numPages);

        const pageImages: string[] = [];
        for (let i = 1; i <= numPages; i++) {
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
        setImages(pageImages);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading PDF:", error);
        setIsLoading(false);
      }
    };

    loadPdf();
  }, [pdfPath]);

  return (
    <div className="flex flex-col sm:flex-row h-screen bg-white text-gray-800">
      {/* Page Selection Button - Toggles the page selector panel */}
      <div className="fixed top-4 left-4 z-40">
        <button
          onClick={() => setShowPageSelector(!showPageSelector)}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          {showPageSelector ? "Hide" : "Show"} Page Selector
        </button>
      </div>

      {/* Page Selection Panel - Hidden by default, toggleable */}
      <div
        className={`fixed top-0 left-0 z-30 bg-white shadow-lg w-64 h-screen overflow-y-auto transition-transform duration-300 transform ${
          showPageSelector ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="sticky top-0 z-10 bg-white py-4 px-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800 text-center">
            Select Pages
          </h1>

          {isLoading && (
            <div className="flex flex-col items-center justify-center p-6">
              <Loader />
              <h1 className="text-lg text-gray-600 mt-3">Loading Pages...</h1>
            </div>
          )}
        </div>

        {!isLoading && (
          <div className="grid grid-cols-2 gap-3 p-4">
            {images.map((image, index) => (
              <div
                key={index}
                className="relative cursor-pointer"
                onClick={() => handleImageSelection(image, index)}
              >
                <div className="relative overflow-hidden rounded-md shadow-sm border border-gray-200">
                  <img
                    className={`w-full h-32 object-cover ${
                      selectedPages.includes(index + 1)
                        ? "ring-2 ring-blue-500"
                        : ""
                    }`}
                    src={image}
                    alt={`Page ${index + 1}`}
                  />

                  {selectedPages.includes(index + 1) && (
                    <div className="absolute top-1 right-1 bg-blue-500 rounded-full p-1">
                      <FaCheck className="w-3 h-3 text-white" />
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 py-1">
                    <p className="text-white text-center text-xs">
                      Page {index + 1}
                    </p>
                  </div>
                </div>
              </div>
            ))}ggit
          </div>
        )}
      </div>

      {/* Main Content (Preview) */}
      <div className="flex-1 h-screen overflow-y-auto">
        <div className="flex flex-col items-center justify-center p-6 relative h-full">
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
            PDF Preview{" "}
            {selectedImage.length > 0
              ? `(${selectedPreviewImage + 1}/${selectedImage.length})`
              : ""}
          </h1>

          {selectedImage.length > 0 ? (
            <div className="relative flex items-center justify-center w-full max-w-4xl bg-gray-50 p-8 rounded-lg shadow-md">
              <div className="absolute left-4 z-10">
                {selectedPreviewImage > 0 && (
                  <button
                    className="p-2 rounded-full bg-gray-200 hover:bg-blue-100 transition-all"
                    onClick={() => setSelectedPreviewImage((prev) => prev - 1)}
                  >
                    <FaChevronLeft size={18} className="text-gray-700" />
                  </button>
                )}
              </div>

              <img
                src={selectedImage[selectedPreviewImage] || placeholderImage}
                alt="Preview"
                className="max-h-[70vh] max-w-full object-contain shadow-md"
              />

              <div className="absolute right-4 z-10">
                {selectedImage.length > 1 &&
                  selectedPreviewImage + 1 < selectedImage.length && (
                    <button
                      className="p-2 rounded-full bg-gray-200 hover:bg-blue-100 transition-all"
                      onClick={() =>
                        setSelectedPreviewImage((prev) => prev + 1)
                      }
                    >
                      <FaChevronRight size={18} className="text-gray-700" />
                    </button>
                  )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center bg-gray-50 p-10 rounded-lg shadow-md w-full max-w-4xl">
              <img
                src={placeholderImage}
                alt="Select pages to preview"
                className="max-h-[40vh] opacity-50"
              />
              <p className="text-xl mt-6 text-center text-gray-600">
                Select pages to preview
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Preview Button */}
      {selectedImage.length > 0 && (
        <div className="sm:hidden fixed bottom-4 right-4 z-40">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white py-3 px-6 rounded-full flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors shadow-md"
          >
            <FaEye className="w-4 h-4" />
            <span>Preview</span>
          </button>
        </div>
      )}

      {/* Mobile Preview Modal */}
      {isModalOpen && selectedImage.length > 0 && (
        <div className="fixed inset-0 z-50 bg-white flex items-center justify-center p-4 sm:hidden">
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-4 right-4 text-gray-800 bg-gray-200 rounded-full p-2 hover:bg-gray-300 transition-colors z-10"
          >
            <FaTimes className="w-5 h-5" />
          </button>
          <div className="relative w-full flex items-center justify-center">
            {selectedPreviewImage > 0 && (
              <button
                className="absolute left-2 p-2 rounded-full bg-gray-200 hover:bg-blue-100 transition-all"
                onClick={() => setSelectedPreviewImage((prev) => prev - 1)}
              >
                <FaChevronLeft className="text-gray-700" size={18} />
              </button>
            )}

            <img
              src={selectedImage[selectedPreviewImage] || placeholderImage}
              alt="Full Preview"
              className="max-w-full max-h-[80vh] object-contain"
            />

            {selectedImage.length > 1 &&
              selectedPreviewImage + 1 < selectedImage.length && (
                <button
                  className="absolute right-2 p-2 rounded-full bg-gray-200 hover:bg-blue-100 transition-all"
                  onClick={() => setSelectedPreviewImage((prev) => prev + 1)}
                >
                  <FaChevronRight className="text-gray-700" size={18} />
                </button>
              )}

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-200 px-3 py-1 rounded-full">
              <p className="text-gray-800 text-sm">
                {selectedPreviewImage + 1} / {selectedImage.length}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Right Sidebar (Controls) */}
      <div className="w-full sm:w-1/4 lg:w-1/5 border-l border-gray-200 bg-gray-50">
        <SideBar
          onGeneratePDF={generatePdf}
          onPageSelect={selectedPages}
          downloadLink={generatedPdfLink}
          onInputChange={inputChange}
          totalPages={totalPdfPage}
          isImagesLoaded={images.length > 0}
        />
      </div>
    </div>
  );
};

export default PdfPage;

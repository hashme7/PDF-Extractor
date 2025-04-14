import { PdfPageProps } from "../types";
import SideBar from "./Sidebar";
import Loader from "./Loader";
import placeholderImage from "../assets/placeholder.png";
import {
  FaChevronRight,
  FaChevronLeft,
  FaEye,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { usePdfPage } from "../hooks/usePdPagef";

const PdfPage: React.FC<PdfPageProps> = ({ pdfPath }) => {
  const {
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
  } = usePdfPage({ pdfPath });

  // Handle keyboard events for accessibility
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>,
    image: string,
    index: number
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleImageSelection(image, index);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row h-screen bg-gradient-to-r from-blue-100 to-white">
      {/* Page Selection Button - Toggles the page selector panel */}
      <div className="fixed top-4 left-4 z-40">
        <button
          onClick={() => setShowPageSelector((prev: any) => !prev)}
          className=" rounded-4xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2.5 px-5 shadow-md hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          aria-label={
            showPageSelector ? "Hide page selector" : "Show page selector"
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {showPageSelector ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
          {showPageSelector ? "Hide" : "Show"} Page Selector
        </button>
      </div>

      {/* Page Selection Panel - Hidden by default, toggleable */}
      <div
        className={`fixed top-0 left-0 z-30 bg-white shadow-md w-64 h-screen overflow-y-auto transition-transform duration-300 transform ${
          showPageSelector ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!showPageSelector}
      >
        <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-100 to-white">
          <h1 className="text-xl font-bold text-gray-800 text-center">
            {" ________"}
          </h1>

          {isLoading && (
            <div className="flex flex-col items-center justify-center p-6">
              <Loader />
              <p className="text-lg text-gray-600 mt-3">Loading Pages...</p>
            </div>
          )}

          {error && (
            <p className="text-red-500 text-center mt-4" role="alert">
              {error}
            </p>
          )}
        </div>

        {!isLoading && !error && (
          <div className="grid grid-cols-2 gap-3 p-4 ">
            {images.map((image: any, index: number) => (
              <div
                key={index}
                className="relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
                onClick={() => handleImageSelection(image, index)}
                onKeyDown={(e) => handleKeyDown(e, image, index)}
                role="button"
                tabIndex={0}
                aria-label={`Select page ${index + 1}`}
              >
                <div className="relative overflow-hidden rounded-md shadow-md border border-gray-200">
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
                      <FaCheck
                        className="w-3 h-3 text-white"
                        aria-hidden="true"
                      />
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 py-1">
                    <p className="text-white text-center text-xs">
                      Page {index + 1}
                    </p>
                  </div>
                </div>
              </div>
            ))}
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
                    className="p-2 rounded-full bg-gray-200 hover:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
                    onClick={() =>
                      setSelectedPreviewImage((prev: number) => prev - 1)
                    }
                    aria-label="Previous preview page"
                  >
                    <FaChevronLeft size={18} className="text-gray-700" />
                  </button>
                )}
              </div>

              <img
                src={selectedImage[selectedPreviewImage] || placeholderImage}
                alt="Preview"
                className="max-h-[70vh] max-w-full object-contain shadow-md"
                onError={(e) => (e.currentTarget.src = placeholderImage)}
              />

              <div className="absolute right-4 z-10">
                {selectedImage.length > 1 &&
                  selectedPreviewImage + 1 < selectedImage.length && (
                    <button
                      className="p-2 rounded-full bg-gray-200 hover:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
                      onClick={() =>
                        setSelectedPreviewImage((prev: number) => prev + 1)
                      }
                      aria-label="Next preview page"
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
                onError={(e) => (e.currentTarget.src = "/fallback-image.png")}
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
            className="bg-blue-500 text-white py-3 px-6 rounded-full flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Open preview"
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
            className="absolute top-4 right-4 text-gray-800 bg-gray-200 rounded-full p-2 hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 z-10"
            aria-label="Close preview"
          >
            <FaTimes className="w-5 h-5" />
          </button>
          <div className="relative w-full flex items-center justify-center">
            {selectedPreviewImage > 0 && (
              <button
                className="absolute left-2 p-2 rounded-full bg-gray-200 hover:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
                onClick={() =>
                  setSelectedPreviewImage((prev: number) => prev - 1)
                }
                aria-label="Previous preview page"
              >
                <FaChevronLeft className="text-gray-700" size={18} />
              </button>
            )}

            <img
              src={selectedImage[selectedPreviewImage] || placeholderImage}
              alt="Full Preview"
              className="max-w-full max-h-[80vh] object-contain"
              onError={(e) => (e.currentTarget.src = "/fallback-image.png")}
            />

            {selectedImage.length > 1 &&
              selectedPreviewImage + 1 < selectedImage.length && (
                <button
                  className="absolute right-2 p-2 rounded-full bg-gray-200 hover:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
                  onClick={() =>
                    setSelectedPreviewImage((prev: number) => prev + 1)
                  }
                  aria-label="Next preview page"
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

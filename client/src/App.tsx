import { useEffect, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { usePdfContext } from "./context/pdfContext";
import PdfPage from "./components/PdfPage";
import Loader from "./components/Loader";
import { Card } from "./components/card";

const App = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { pdfFile, setPdfFile, isUploading, setIsUploading } = usePdfContext();
  const dropZoneRef = useRef<HTMLDivElement | null>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] || null;
    if (!file) return;

    if (file.type !== "application/pdf") {
      Swal.fire({
        icon: "error",
        title: "Invalid File",
        text: "Please upload a PDF file!",
      });
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "http://localhost:3000/uploadpdf",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setPdfFile({ file, serverPath: res.data.filePath });
    } catch (error) {
      console.error("Error uploading PDF:", error);
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: "Could not upload the PDF. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Drag and Drop Handlers
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (!file || file.type !== "application/pdf") {
      Swal.fire({
        icon: "error",
        title: "Invalid File",
        text: "Please drop a PDF file!",
      });
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "http://localhost:3000/uploadpdf",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setPdfFile({ file, serverPath: res.data.filePath });
    } catch (error) {
      console.error("Error uploading PDF:", error);
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: "Could not upload the PDF. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    console.log(pdfFile, "pdfFile");
  }, [pdfFile]);

  return (
    <>
      {isUploading ? (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-100 to-white">
          <Loader />
          <p className="text-gray-700 mt-4">Uploading...</p>
        </div>
      ) : pdfFile.serverPath ? (
        <PdfPage pdfPath={pdfFile.serverPath} />
      ) : (
        <div className="min-h-screen bg-gradient-to-r from-blue-100 to-white p-6 flex items-center justify-center">
          <div className="max-w-3xl w-full">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                PDF Page Extractor
              </h1>
              <p className="text-gray-600 text-lg">
                Extract specific pages from your PDF documents instantly
              </p>
            </div>
            <Card className="bg-white shadow-lg rounded-lg p-8 border border-dashed border-gray-300">
              <div className="text-center space-y-6">
                <div
                  ref={dropZoneRef}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors"
                >
                  <input
                    id="fileupload"
                    type="file"
                    ref={fileInputRef}
                    accept="application/pdf"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <button
                    onClick={handleButtonClick}
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                  >
                    Upload Files
                  </button>
                  <p className="text-gray-500 text-sm mt-2">
                    or drag and drop PDF here
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="text-center p-4">
                    <h3 className="text-gray-800 font-medium">
                      Instant Extraction
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Quickly extract text and pages from PDFs
                    </p>
                  </div>
                  <div className="text-center p-4">
                    <h3 className="text-gray-800 font-medium">
                      Secure Uploads
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Your files are encrypted and never stored
                    </p>
                  </div>
                  <div className="text-center p-4">
                    <h3 className="text-gray-800 font-medium">
                      Clean & Simple UI
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Designed for easy and fast use
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </>
  );
};

export default App;

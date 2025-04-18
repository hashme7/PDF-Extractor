import { useEffect, useState, useCallback } from "react";
import { saveAs } from "file-saver";
import { debounce } from "lodash";
import { SideBarProps } from "../types";
// import { FileText, X } from "@radix-ui/react-icons"; // Re-added Radix UI icons

const SideBar: React.FC<SideBarProps> = ({
  onPageSelect,
  onGeneratePDF,
  downloadLink,
  onInputChange,
  totalPages,
  isImagesLoaded,
}) => {
  const [pageValue, setPageValue] = useState<string>("");
  const [isManualInput, setIsManualInput] = useState(false);
  const [isFullScreenOpen, setIsFullScreenOpen] = useState(false);

  const parseRangeString = (value: string): number[] | null => {
    if (!value.trim()) return [];

    const pages = new Set<number>();
    const ranges = value.split(",").map((r) => r.trim());

    for (const range of ranges) {
      if (range === "") continue;

      if (range.includes("-")) {
        const [start, end] = range.split("-").map(Number);
        if (
          isNaN(start) ||
          isNaN(end) ||
          start > end ||
          start < 1 ||
          end > totalPages
        ) {
          return null;
        }
        for (let i = start; i <= end; i++) {
          pages.add(i);
        }
      } else {
        const pageNum = Number(range);
        if (isNaN(pageNum) || pageNum < 1 || pageNum > totalPages) {
          return null;
        }
        pages.add(pageNum);
      }
    }
    return Array.from(pages);
  };

  const debouncedValidateAndProcess = useCallback(
    debounce((val: string) => {
      if (val.trim() === "") {
        onInputChange("");
        return;
      }

      const pages = parseRangeString(val);
      if (pages === null) {
        alert(`Please enter valid page numbers between 1 and ${totalPages}`);
        return;
      }

      onInputChange(val);
    }, 1500),
    [totalPages, onInputChange]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setIsManualInput(true);
    setPageValue(val);
    debouncedValidateAndProcess(val);
  };

  const handleBlur = () => {
    setIsManualInput(false);
    const pages = parseRangeString(pageValue);
    if (pages === null || pages.length === 0) {
      setPageValue("");
      return;
    }

    const sortedPages = [...pages].sort((a, b) => a - b);
    const ranges = [];
    let start = sortedPages[0];
    let end = start;

    for (let i = 1; i < sortedPages.length; i++) {
      if (sortedPages[i] === end + 1) {
        end = sortedPages[i];
      } else {
        ranges.push(start === end ? `${start}` : `${start}-${end}`);
        start = sortedPages[i];
        end = start;
      }
    }
    ranges.push(start === end ? `${start}` : `${start}-${end}`);
    setPageValue(ranges.join(", "));
  };

  useEffect(() => {
    if (!isManualInput) {
      const sortedPages = [...onPageSelect].sort((a, b) => a - b);
      if (sortedPages.length === 0) {
        setPageValue("");
        return;
      }
      const ranges = [];
      let start = sortedPages[0];
      let end = start;

      for (let i = 1; i < sortedPages.length; i++) {
        if (sortedPages[i] === end + 1) {
          end = sortedPages[i];
        } else {
          ranges.push(start === end ? `${start}` : `${start}-${end}`);
          start = sortedPages[i];
          end = start;
        }
      }
      ranges.push(start === end ? `${start}` : `${start}-${end}`);
      setPageValue(ranges.join(", "));
    }
  }, [onPageSelect, isManualInput]);

  const handleGeneratePDF = () => {
    onGeneratePDF(pageValue);
  };

  const handleDownload = () => {
    if (downloadLink) {
      saveAs(downloadLink, `extracted_pdf_${Date.now()}.pdf`);
    }
  };

  return (
    <>
      {/* Mobile Floating Button */}
      <div className="sm:hidden">
        {isImagesLoaded && (
          <button
            onClick={() => setIsFullScreenOpen(true)}
            className="fixed bottom-4 right-4 z-50 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
          >
            {/* <FileText className="w-6 h-6" /> Re-added icon */}
          </button>
        )}
      </div>

      {/* Mobile Full-Screen Sidebar */}
      {isFullScreenOpen && (
        <div className="fixed inset-0 z-[100] bg-white sm:hidden animate-fade-in">
          <div className="flex justify-end p-4">
            <button
              onClick={() => setIsFullScreenOpen(false)}
              className="text-gray-700 hover:text-blue-500 transition-colors"
            >
              {/* <X className="w-6 h-6" /> Re-added icon */}
            </button>
          </div>
          <div className="px-6 pb-6">
            <h3 className="text-center text-gray-800 text-xl font-semibold mb-6">
              PDF Options
            </h3>
            <div className="mb-6">
              <input
                type="text"
                placeholder={`Eg: 1-${totalPages}, 20`}
                value={pageValue}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className="w-full p-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-500 mt-2 text-center">
                Total Pages: {totalPages}
              </p>
            </div>
            <div className="space-y-4">
              {!downloadLink ? (
                <button
                  onClick={handleGeneratePDF}
                  className="w-full bg-blue-500 text-white py-4 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                >
                  Generate PDF
                </button>
              ) : (
                <button
                  onClick={handleDownload}
                  className="w-full bg-blue-500 text-white py-4 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                >
                  Download PDF
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden sm:block w-full max-w-sm bg-white p-8 shadow-lg rounded-2xl border border-gray-100">
        <h3 className="text-center text-gray-900 text-2xl font-bold mb-6">
          Select Pages to Extract
        </h3>
        <div className="mb-6">
          <input
            type="text"
            placeholder={`Eg: 1-${totalPages}, 20`}
            value={pageValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <p className="text-sm text-gray-600 mt-3">
            Total Pages Available:{" "}
            <span className="font-medium">{totalPages}</span>
          </p>
        </div>
        <div className="text-center">
          {!downloadLink ? (
            <button
              onClick={handleGeneratePDF}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-600 transition duration-300"
            >
              Generate PDF
            </button>
          ) : (
            <button
              onClick={handleDownload}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition duration-300"
            >
              Download PDF
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default SideBar;

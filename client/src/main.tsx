import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { PdfProvider } from "./context/pdfContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PdfProvider>
      <App />
    </PdfProvider>
  </React.StrictMode>
);

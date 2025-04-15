# 📄 PDF-Extractor

A modern web application for extracting and manipulating content from PDF files. Built with **React**, **TypeScript**, **Node.js**, and **Express**, this app provides a sleek and user-friendly experience for handling PDF documents.

---

## ✨ Features

- 📁 Upload PDF files and extract text content
- 📄 View and navigate through PDF documents
- 🔍 Extract specific pages or page ranges
- ⬇️ Download extracted content in various formats
- 💡 Real-time feedback with SweetAlert2
- 📱 Responsive design using Tailwind CSS
- 🧠 Intuitive, clean UI with consistent typography

---

## 🧰 Tech Stack

### 🖥 Frontend
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **PDF.js** (PDF rendering)
- **Axios** (API communication)
- **SweetAlert2** (notifications)

### ⚙️ Backend
- **Node.js**
- **Express 5**
- **PDF-lib** (PDF manipulation)
- **Multer** (file uploads)
- **CORS**
- **dotenv**

---

## 🔤 UI Typography & Font Sizes

We use Tailwind’s modern typography system to create an attractive and readable interface:

| Element            | Tailwind Class      | Size       | Usage                        |
|--------------------|---------------------|------------|------------------------------|
| Main Headings      | `text-3xl md:text-4xl font-bold` | 24–36px | Page titles, modals          |
| Subheadings        | `text-xl md:text-2xl font-semibold` | 18–24px | Section titles               |
| Body Text          | `text-base md:text-lg` | 16–18px | Paragraphs, regular content  |
| Labels / Small Text| `text-sm text-gray-600` | 14px      | Inputs, meta info            |
| Buttons            | `text-sm md:text-base font-medium` | 14–16px | CTA, secondary actions       |

Typography is clean and modern using a sans-serif font (e.g., Inter, Roboto, or system defaults).

---

## ⚙️ Prerequisites

- Node.js (v16.x or higher)
- npm or yarn
- Git

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/pdf-extractor.git
cd pdf-extractor
```
## backend setup
```bash
  cd backend

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your configurations

# Run backend server
npm run dev
```
## frontend setup
```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Run frontend server
npm run dev
```

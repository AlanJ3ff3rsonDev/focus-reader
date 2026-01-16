'use client';

import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = '';

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();

      const pageText = textContent.items
        .map((item) => {
          if ('str' in item) {
            return item.str;
          }
          return '';
        })
        .join(' ');

      fullText += pageText + '\n\n';
    }

    // Clean up the text
    return fullText
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n/g, '\n\n')
      .trim();
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF file. Please try a different file.');
  }
}

export function isValidPDFFile(file: File): boolean {
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
}

export function isValidTextFile(file: File): boolean {
  const validTypes = [
    'text/plain',
    'text/markdown',
    'text/html',
    'application/json',
  ];
  const validExtensions = ['.txt', '.md', '.markdown', '.text'];

  return (
    validTypes.includes(file.type) ||
    validExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
  );
}

export async function extractTextFromFile(file: File): Promise<string> {
  if (isValidPDFFile(file)) {
    return extractTextFromPDF(file);
  }

  if (isValidTextFile(file)) {
    return file.text();
  }

  throw new Error('Unsupported file type. Please use PDF or TXT files.');
}

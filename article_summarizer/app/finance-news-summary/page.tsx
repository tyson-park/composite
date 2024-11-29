"use client";

import { useState } from "react";

export default function SummarizePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [summaryHTML, setSummaryHTML] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const formData = new FormData();
      Array.from(e.target.files).forEach(file => formData.append('files', file));

      try {
        const res = await fetch('/api/upload-files', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to upload files");
        }

        const { filePaths } = await res.json();
        setFiles(filePaths);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      }
    }
  };

  const handleSummarize = async () => {
    try {
      const filePaths = files.map(file => `/path/to/uploads/${file.name}`); // Replace with actual paths
      const res = await fetch("/api/summarize-pdfs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filePaths }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to summarize");
      }

      const html = await res.text(); // Fetch the response as HTML
      setSummaryHTML(html);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">PDF Summarizer</h1>
      <input type="file" multiple onChange={handleFileChange} className="mb-4" />
      <button onClick={handleSummarize} className="bg-blue-500 text-white px-4 py-2 rounded">
        Summarize
      </button>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      <div className="mt-4" dangerouslySetInnerHTML={{ __html: summaryHTML }} />
    </div>
  );
}
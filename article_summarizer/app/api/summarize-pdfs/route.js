import { PDFDocument } from "pdf-lib";
import axios from "axios";
import tiktoken from "tiktoken";
import fs from "fs/promises";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Extract text from a single PDF
async function extractTextFromPDF(filePath) {
  const pdfBuffer = await fs.readFile(filePath);
  const pdfDoc = await PDFDocument.load(pdfBuffer);
  let text = "";

  const pages = pdfDoc.getPages();
  for (const page of pages) {
    text += page.getTextContent();
  }

  return text;
}

// Split text into chunks based on token limits
function splitTextIntoChunks(text, maxTokens = 3000) {
  const tokenizer = tiktoken.encodingForModel("gpt-3.5-turbo");
  const tokens = tokenizer.encode(text);

  const chunks = [];
  for (let i = 0; i < tokens.length; i += maxTokens) {
    chunks.push(tokens.slice(i, i + maxTokens));
  }

  return chunks.map(chunk => tokenizer.decode(chunk));
}

// Summarize a single chunk using OpenAI API
async function summarizeChunk(chunk) {
  const prompt = `Summarize the following text in valid HTML format, using <p> for paragraphs and other appropriate tags for structured content:\n${chunk}`;

  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful summarization assistant. Always format responses in valid HTML." },
        { role: "user", content: prompt },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.choices[0].message.content;
}

// Summarize a single PDF
async function summarizePDF(filePath, maxTokens = 3000) {
  const text = await extractTextFromPDF(filePath);
  const chunks = splitTextIntoChunks(text, maxTokens);

  const summaries = [];
  for (const chunk of chunks) {
    const summary = await summarizeChunk(chunk);
    summaries.push(summary);
  }

  return summaries.join(" ");
}

// Summarize multiple PDFs and find common themes
async function summarizeMultiplePDFs(filePaths) {
  const summaries = [];
  for (const filePath of filePaths) {
    console.log(`Processing file: ${filePath}`);
    const summary = await summarizePDF(filePath);
    summaries.push(summary);
  }

  const combinedSummaries = summaries.join("\n");
  const prompt = `Summarize the common themes and main points from the following summaries:\n${combinedSummaries}`;

  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant for extracting common themes." },
        { role: "user", content: prompt },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.choices[0].message.content;
}

export async function POST(req) {
  try {
    const { filePaths } = await req.json();

    if (!Array.isArray(filePaths) || filePaths.length === 0) {
      return new Response(JSON.stringify({ error: "Please provide an array of file paths." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const summaries = await summarizeMultiplePDFs(filePaths);

    return new Response(JSON.stringify({ summary: summaries }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing PDFs:", error);
    return new Response(JSON.stringify({ error: "An error occurred while processing the PDFs." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
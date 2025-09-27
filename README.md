📄 Multi-Part Input Distribution

Transform a single input into multiple outputs — PDFs, audio (MP3), images, and more.
This repo demonstrates how one uploaded file (like a PDF) can be processed, split, and redistributed into multiple formats using modern tooling.

🚀 Inspiration

This project came from the idea that one format doesn’t fit all. Some people prefer reading, others listening, and sometimes visuals make information easier to grasp. By distributing one input across different formats, the same content becomes more accessible, versatile, and engaging.

💡 What it does

Accepts an uploaded input file (currently PDFs).

Extracts and processes the content.

Generates outputs across multiple modalities:

Summarized PDF text.

Audio (MP3) narration (future).

Image visualizations (future).

Currently, the implementation focuses on PDF summarization using Google’s Gemini API.

🛠️ How we built it

Framework: Next.js
 serverless functions.

PDF Parsing: pdf-parse
.

AI Processing: Google GenAI
 (gemini-2.5-flash model).

Flow:

Upload a PDF via form data.

Convert the PDF into a buffer.

Extract the raw text using pdf-parse.

Send extracted text to Gemini for summarization.

Return a clean, JSON-formatted summary.

⚠️ Challenges we ran into

Handling large PDFs while avoiding memory issues.

Ensuring the summarization remained faithful to the source.

Integrating different formats without breaking the pipeline.

Keeping the system responsive while processing multiple outputs.

🎉 Accomplishments we’re proud of

Successfully built a pipeline where one input leads to multiple outputs.

Seamless PDF → AI Summary flow.

Designed a structure that can scale into audio, visuals, and real-time distribution.

📚 What we learned

How to work with multiple content formats in one pipeline.

The power of parallel processing and modular design.

The importance of accessibility-first thinking when designing tools.

🔮 What’s next for Multi-Part Input Distribution

✅ Support for audio narration (MP3).

✅ Image/diagram generation from extracted text.

🔄 Real-time streaming, so summaries/audio/visuals are created while content is still uploading.

☁️ Cloud integration to auto-save outputs into Google Drive or similar.

📊 User customization — let users choose which formats they want.

🧑‍💻 Usage
1. Install dependencies
npm install

2. Add your API key

Create a .env.local file in the root of your project:

GEMINI_API_KEY=your_api_key_here

3. Run the project
npm run dev

4. Send a request

POST a PDF file to the route:

curl -X POST http://localhost:3000/api/pdf \
  -F "pdf=@yourfile.pdf"


Expected response:

{
  "summary": "This document discusses..."
}

📂 Tech Stack

Frontend/Backend: Next.js

AI Models: Google Gemini (2.5-flash)

Parsing: pdf-parse

Output: JSON, with future support for PDF/MP3/Image

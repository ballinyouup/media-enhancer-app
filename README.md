# 📄 Multi-Part Input Distribution

Transform a single input into **multiple outputs** — PDFs, audio (MP3), images, and more.  
This project demonstrates a pipeline that accepts an uploaded PDF, extracts text, and generates a summarized output using Google Gemini. The architecture is modular so you can add audio, image generation, or streaming later.

---

## 🔖 One-liner
**Split one input into many outputs — PDFs, MP3s, images, and more.**

---

## 🚀 Features
- Upload a PDF and extract raw text.
- Summarize the content using Gemini (`gemini-2.5-flash`).
- Return the summary as JSON.
- Modular design to support additional outputs (audio, images, video).

---

## 🧠 Inspiration
Different people prefer different mediums — reading, listening, or viewing. This project was inspired by the idea of making the same content accessible across multiple formats simultaneously.

---

## 📦 Tech Stack
- **Framework**: Next.js (API routes / serverless functions)  
- **Parsing**: [pdf-parse](https://www.npmjs.com/package/pdf-parse)  
- **AI**: [Google GenAI](https://ai.google.dev) (Gemini models)  
- **Runtime**: Node.js  

---

## 🛠️ How it works
1. Upload a PDF via a form request.  
2. Convert the uploaded file into a buffer.  
3. Extract text using `pdf-parse`.  
4. Send the extracted text to Gemini for summarization.  
5. Return a clean JSON response.  

---

## 📂 Example File Structure

```text
/
├─ app/
│  └─ api/
│     └─ pdf/route.js   # API handler
├─ public/
├─ package.json
├─ README.md
└─ .env.local
```

---
## ⚙️ Installation

1. Clone the repo:
```bash
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>'''
2.Install dependencies:
npm install
# or
yarn install
3. Add your environment variable in `.env.local`:
```text
GEMINI_API_KEY=your_api_key_here
```

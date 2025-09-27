'use server';               // <-- make sure this file is in the app router

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, createPartFromUri } from '@google/genai';

export const runtime = 'nodejs';   // Force node runtime (needed for file upload)

// Helper: wait a bit
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function POST(req: NextRequest) {
  // 1️⃣  Get the form data (multipart/form-data)
  const form = await req.formData();
  const file = form.get('audio');

  if (!file || !(file instanceof File)) {
    return NextResponse.json(
      { error: 'No audio file found. Please use the "audio" form field.' },
      { status: 400 }
    );
  }

  // 2️⃣  Create a Blob (Node 18+ already supports Blob/ArrayBuffer)
  const arrayBuffer = await file.arrayBuffer();
  const blob = new Blob([new Uint8Array(arrayBuffer)], {
    type: file.type,
  });

  // 3️⃣  Initialise Gemini
  const ai = new GoogleGenAI({
    vertexai: false,
    apiKey: process.env.GEMINI_API_KEY,
  });

  // 4️⃣  Upload the file to Gemini
  const uploadedFile = await ai.files.upload({
    file: blob,
    config: { displayName: file.name ?? 'uploaded_audio' },
  });

  // 5️⃣  Wait until the file is processed
  let fileState = uploadedFile.state;
  let getFile = uploadedFile;

  while (fileState === 'PROCESSING') {
    // Wait 5 s before polling again
    await wait(5000);

    getFile = await ai.files.get({ name: getFile.name as string });
    fileState = getFile.state;
  }

  if (fileState === 'FAILED') {
    return NextResponse.json(
      { error: 'File processing failed on Gemini side.' },
      { status: 500 }
    );
  }

  // 6️⃣  Build the content that asks for transcription
  const content = [
    'Please transcribe the following audio file.',
  ];

  if (getFile.uri && getFile.mimeType) {
    const part = createPartFromUri(getFile.uri, getFile.mimeType);
    if(!part.text){
        return NextResponse.json(
      { error: 'File processing failed on Gemini side.' },
      { status: 500 }
    );
    }
    content.push(part.text);
  }

  // 7️⃣  Ask Gemini to transcribe
  const response = await ai.models.generateContent({
    model: 'gemini-1.5-flash-latest',
    contents: content,
  });

  // 8️⃣  Return the transcription
  return NextResponse.json({ transcription: response.text ?? '' });
}

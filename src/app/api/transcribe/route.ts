
import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const apiKey = process.env.GEMINI_API_KEY as string;
const ai = new GoogleGenAI({ apiKey: apiKey });
const MODEL_ID = "gemini-2.5-pro";

export async function POST(request: Request) {
    if (!apiKey) {
        return NextResponse.json(
            { error: 'GEMINI_API_KEY is not configured.' },
            { status: 500 }
        );
    }

    try {
        const formData = await request.formData();
        const AUDIO_URL = formData.get('link') as string | null;
        if(!AUDIO_URL) {
            return NextResponse.json(
                { error: 'No audio file uploaded.' },
                { status: 400 }
            );
        }
        // First, upload the file to Gemini's file API
        const audioResponse = await fetch(AUDIO_URL);
        if (!audioResponse.ok) {
            return NextResponse.json(
                { error: 'Failed to fetch audio from URL' },
                { status: 400 }
            );
        }
        
        const audioBlob = await audioResponse.blob();
        
        // Upload file to Gemini's file API
        const uploadResult = await ai.files.upload({
            file: audioBlob,
        });
        
        // Now use the uploaded file URI
        const response = await ai.models.generateContent({
            model: MODEL_ID,
            contents: [
                {
                    fileData: {
                        mimeType: "audio/mpeg",
                        fileUri: uploadResult.uri
                    }
                },
                "Please transcribe this audio file. Provide only the transcription text without any additional commentary."
            ]
        });


        return NextResponse.json({ transcription: response.text });
    } catch (error) {
        console.error('Error processing audio:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
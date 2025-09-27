
// Note: The current recommended package is @google/generative-ai
import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const apiKey = process.env.GEMINI_API_KEY as string;
const genAI = new GoogleGenAI({
    apiKey: apiKey,
});

export async function POST(request: Request) {
    if (!apiKey) {
        return NextResponse.json(
            { error: 'GEMINI_API_KEY is not configured.' },
            { status: 500 }
        );
    }

    try {
        const formData = await request.formData();
        const file = formData.get('audio') as File | null;

        if (!file) {
            return NextResponse.json(
                { error: 'No audio file uploaded.' },
                { status: 400 }
            );
        }

        // 1. Convert the audio file to a Buffer, then to a base64 string
        const audioBuffer = Buffer.from(await file.arrayBuffer());
        const base64Audio = audioBuffer.toString('base64');

        // 2. Use a model that supports audio input, like gemini-1.5-flash
        const model = genAI.chats.create({ model: 'gemini-2.5-flash' });

        // 3. Construct the prompt with the audio data included directly
        const audioPart = {
                mimeType: file.type,
                data: base64Audio,
        };

        // 4. Send the prompt and audio to Gemini in a single request
        const result = await model.sendMessage({
            message: {
                inlineData: audioPart,
            },
        });

        const text = result.text as string
        return NextResponse.json({ transcription: text });
    } catch (error) {
        console.error('Error processing audio:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
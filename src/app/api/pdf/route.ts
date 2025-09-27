import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import pdf from 'pdf-parse';

// Initialize the Gemini client
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenAI({vertexai: false, apiKey: apiKey || ''});

export async function POST(request: Request) {
    if (!apiKey) {
        return NextResponse.json(
            { error: 'GEMINI_API_KEY is not configured.' },
            { status: 500 }
        );
    }

    try {
        // 1. Receive the uploaded PDF file from the form data
        const formData = await request.formData();
        const file = formData.get('pdf') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No PDF file uploaded.' }, { status: 400 });
        }

        // 2. Convert the file into a Buffer
        const pdfBuffer = Buffer.from(await file.arrayBuffer());

        // 3. Use pdf-parse to extract text from the PDF Buffer
        const pdfData = await pdf(pdfBuffer);
        const extractedText = pdfData.text;

        // 4. Use a text-only model like gemini-2.0-flash for processing
        const chat = genAI.chats.create({
            model: "gemini-2.5-flash"
        });

        const prompt = `Please summarize the following document:\n\n${extractedText}`;

        // 5. Call Gemini with the extracted text
        const response = await chat.sendMessage({message: prompt});
        const summary = response.text;

        // 6. Return the summary from Gemini
        return NextResponse.json({ summary });

    } catch (error) {
        console.error('Error processing PDF:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}


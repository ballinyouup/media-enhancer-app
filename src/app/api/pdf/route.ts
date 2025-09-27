import { NextResponse } from 'next/server';
import pdf from 'pdf-parse';

export async function POST(request: Request) {

    try {
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
        return NextResponse.json({ extractedText });

    } catch (error) {
        console.error('Error processing PDF:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}


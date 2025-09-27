import { NextResponse } from 'next/server';
import pdf from 'pdf-parse';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        // const file = formData.get('pdf') as File | null;
        const pdfUrl = formData.get('link') as string | null;

        let pdfBuffer: Buffer;

        if (pdfUrl) {
            // Handle URL-based PDF processing
            const pdfResponse = await fetch(pdfUrl);
            if (!pdfResponse.ok) {
                return NextResponse.json(
                    { error: 'Failed to fetch PDF from URL' },
                    { status: 400 }
                );
            }
            
            const pdfArrayBuffer = await pdfResponse.arrayBuffer();
            pdfBuffer = Buffer.from(pdfArrayBuffer);

        } else {
            return NextResponse.json(
                { error: 'No PDF file uploaded or URL provided.' },
                { status: 400 }
            );
        }

        // Use pdf-parse to extract text from the PDF Buffer
        const pdfData = await pdf(pdfBuffer);
        const extractedText = pdfData.text;
        return NextResponse.json({ extractedText });

    } catch (error) {
        console.error('Error processing PDF:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}


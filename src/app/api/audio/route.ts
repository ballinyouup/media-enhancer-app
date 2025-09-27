import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

// Environment variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GOOGLE_CLOUD_PROJECT = process.env.GOOGLE_CLOUD_PROJECT;
const GOOGLE_CLOUD_LOCATION = process.env.GOOGLE_CLOUD_LOCATION;
const GOOGLE_GENAI_USE_VERTEXAI = process.env.GOOGLE_GENAI_USE_VERTEXAI === 'true';

// Type definitions
interface TranscriptionResponse {
  success: boolean;
  transcription?: string;
  error?: string;
}

interface AudioData {
  inlineData: {
    data: string;
    mimeType: string;
  };
}

// Helper function to determine MIME type based on file extension or Content-Type
function getMimeType(fileName?: string, contentType?: string): string {
  if (contentType && contentType.startsWith('audio/')) {
    return contentType;
  }

  if (fileName) {
    const ext = fileName.toLowerCase().split('.').pop();
    const mimeTypes: Record<string, string> = {
      'mp3': 'audio/mpeg',
      'wav': 'audio/wav',
      'm4a': 'audio/mp4',
      'aac': 'audio/aac',
      'ogg': 'audio/ogg',
      'flac': 'audio/flac',
      'webm': 'audio/webm',
      'opus': 'audio/opus'
    };
    return mimeTypes[ext || ''] || 'audio/mpeg';
  }

  return 'audio/mpeg'; // default
}

// Function to transcribe audio using Google GenAI
async function transcribeAudio(audioData: AudioData): Promise<string> {
  try {
    const ai = GOOGLE_GENAI_USE_VERTEXAI 
      ? new GoogleGenAI({
          vertexai: true,
          project: GOOGLE_CLOUD_PROJECT,
          location: GOOGLE_CLOUD_LOCATION,
        })
      : new GoogleGenAI({
          vertexai: false,
          apiKey: GEMINI_API_KEY
        });

    const chat = ai.chats.create({ model: 'gemini-2.0-flash' });
    
    const response = await chat.sendMessage({
      message: [
        {
          text: 'Please transcribe this audio file. Return only the transcription text without any additional formatting or commentary.'
        },
        audioData
      ]
    });

    if (!response || !response.text) {
        throw new Error('Transcription failed');
    }

    return response.text;
  } catch (error) {
    console.error('Transcription error:', error);
    throw new Error(`Transcription failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Function to transcribe audio with streaming
async function transcribeAudioStream(audioData: AudioData): Promise<string> {
  try {
    const ai = GOOGLE_GENAI_USE_VERTEXAI 
      ? new GoogleGenAI({
          vertexai: true,
          project: GOOGLE_CLOUD_PROJECT,
          location: GOOGLE_CLOUD_LOCATION,
        })
      : new GoogleGenAI({
          vertexai: false,
          apiKey: GEMINI_API_KEY
        });

    const chat = ai.chats.create({ model: 'gemini-2.0-flash' });
    
    const response = await chat.sendMessageStream({
      message: [
        {
          text: 'Please transcribe this audio file. Return only the transcription text without any additional formatting or commentary.'
        },
        audioData
      ]
    });

    let fullTranscription = '';
    for await (const chunk of response) {
      fullTranscription += chunk.text;
    }

    return fullTranscription;
  } catch (error) {
    console.error('Stream transcription error:', error);
    throw new Error(`Stream transcription failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Main API handler
export async function POST(request: NextRequest): Promise<NextResponse<TranscriptionResponse>> {
  try {
    // Validate environment variables
    if (!GEMINI_API_KEY && !GOOGLE_GENAI_USE_VERTEXAI) {
      return NextResponse.json(
        { success: false, error: 'GEMINI_API_KEY is required when not using Vertex AI' },
        { status: 500 }
      );
    }

    if (GOOGLE_GENAI_USE_VERTEXAI && (!GOOGLE_CLOUD_PROJECT || !GOOGLE_CLOUD_LOCATION)) {
      return NextResponse.json(
        { success: false, error: 'GOOGLE_CLOUD_PROJECT and GOOGLE_CLOUD_LOCATION are required for Vertex AI' },
        { status: 500 }
      );
    }

    // Parse form data to get the audio file
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    const useStreaming = formData.get('streaming') === 'true';

    if (!audioFile) {
      return NextResponse.json(
        { success: false, error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Validate file size (e.g., max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (audioFile.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File size too large. Maximum size is 10MB' },
        { status: 400 }
      );
    }

    // Convert file to base64
    const arrayBuffer = await audioFile.arrayBuffer();
    const base64Audio = Buffer.from(arrayBuffer).toString('base64');
    const mimeType = getMimeType(audioFile.name, audioFile.type);

    const audioData: AudioData = {
      inlineData: {
        data: base64Audio,
        mimeType: mimeType
      }
    };

    // Transcribe audio
    const transcription = useStreaming 
      ? await transcribeAudioStream(audioData)
      : await transcribeAudio(audioData);

    return NextResponse.json({
      success: true,
      transcription: transcription.trim()
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
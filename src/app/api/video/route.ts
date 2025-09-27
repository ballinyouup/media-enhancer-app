// app/api/extract-audio/route.js
import { NextRequest, NextResponse } from 'next/server';
import ffmpeg from 'ffmpeg';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';

export async function POST(request: NextRequest) {
  try {
    // Get the uploaded file from form data
    const formData = await request.formData();
    const videoFile = formData.get('video') as File | null;
    
    if (!videoFile) {
      return NextResponse.json({ error: 'No video file provided' }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await videoFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create temporary file paths
    const tempDir = tmpdir();
    const inputPath = join(tempDir, `input_${Date.now()}.mp4`);
    const outputPath = join(tempDir, `output_${Date.now()}.mp3`);

    try {
      // Save uploaded video to temporary file
      await writeFile(inputPath, buffer);

      // Extract audio using ffmpeg
      await new Promise((resolve, reject) => {
        new (ffmpeg as any)(inputPath)
          .then((video: any) => {
            video
              .noVideo()
              .audioCodec('libmp3lame')
              .save(outputPath, (error: any, file: any) => {
                if (error) {
                  return reject(error);
                }
                resolve(file);
              });
          })
          .catch(reject);
      });

      // Read the extracted audio file
      const audioBuffer = await require('fs').promises.readFile(outputPath);

      // Clean up temporary files
      await unlink(inputPath);
      await unlink(outputPath);

      // Return the audio file
      return new NextResponse(audioBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'audio/mpeg',
          'Content-Disposition': 'attachment; filename="extracted_audio.mp3"',
        },
      });

    } catch (ffmpegError) {
      // Clean up files if they exist
      try {
        await unlink(inputPath);
        await unlink(outputPath);
      } catch {}
      
      throw ffmpegError;
    }

  } catch (error) {
    console.error('Audio extraction error:', error);
    return NextResponse.json(
      { error: 'Failed to extract audio from video' }, 
      { status: 500 }
    );
  }
}

// Alternative version that returns a downloadable URL instead of direct file
export async function POST_WITH_URL(request: NextRequest) {
  try {
    const formData = await request.formData();
    const videoFile = formData.get('video') as File | null;
    
    if (!videoFile) {
      return NextResponse.json({ error: 'No video file provided' }, { status: 400 });
    }

    const bytes = await videoFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const tempDir = tmpdir();
    const inputPath = join(tempDir, `input_${Date.now()}.mp4`);
    const outputPath = join(tempDir, `output_${Date.now()}.mp3`);

    try {
      await writeFile(inputPath, buffer);

      await new Promise((resolve, reject) => {
        new (ffmpeg as any)(inputPath)
          .then((video: any) => {
            video
              .noVideo()
              .audioCodec('libmp3lame')
              .save(outputPath, (error: any, file: any) => {
                if (error) {
                  return reject(error);
                }
                resolve(file);
              });
          })
          .catch(reject);
      });

      // Convert to base64 for JSON response (for smaller files)
      const audioBuffer = await require('fs').promises.readFile(outputPath);
      const base64Audio = audioBuffer.toString('base64');

      await unlink(inputPath);
      await unlink(outputPath);

      return NextResponse.json({
        success: true,
        audio: `data:audio/mpeg;base64,${base64Audio}`,
        filename: 'extracted_audio.mp3'
      });

    } catch (ffmpegError) {
      try {
        await unlink(inputPath);
        await unlink(outputPath);
      } catch {}
      throw ffmpegError;
    }

  } catch (error) {
    console.error('Audio extraction error:', error);
    return NextResponse.json(
      { error: 'Failed to extract audio from video' }, 
      { status: 500 }
    );
  }
}
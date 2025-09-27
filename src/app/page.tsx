"use client"

import {useState} from "react"
import { FileUploadZone } from "@/components/file-upload-zone"
import { PromptInput } from "@/components/prompt-input"
import { MediaPlayer } from "@/components/media-player"
import { VideoPlayer } from "@/components/video-player"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface UploadedFile {
    id: string
    name: string
    size: number
    type: string
    url?: string
}

interface GeneratedMedia {
    id: string
    url: string
    type: string
}

export default function Home() {
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
    const [isProcessing, setIsProcessing] = useState(false)
    const [generatedState, setGeneratedState] = useState<boolean>(false)
    const [showVanishEffect, setShowVanishEffect] = useState(false)
    const [generatedMedia, setGeneratedMedia] = useState<GeneratedMedia[]>([]);
    const [generatedAudio, setGeneratedAudio] = useState<string | null>(null);
    const handlePromptSubmit = async (prompt: string, files: File[]) => {
        setIsProcessing(true)

        // Convert File objects to UploadedFile format and add to upload zone
        if (files.length > 0) {
            const newUploadedFiles = files.map((file) => ({
                id: Math.random().toString(36).substr(2, 9),
                name: file.name,
                size: file.size,
                type: file.type,
                url: URL.createObjectURL(file),
            }))

            // Add new files to existing uploaded files
            setUploadedFiles((prev) => [...prev, ...newUploadedFiles])
        }

        // Simulate processing
        setTimeout(() => {
            setIsProcessing(false)
        }, 2000)
    }

    const handleFilesChange = (files: UploadedFile[]) => {
        setUploadedFiles(files)
        if (files.length === 0) {
            setGeneratedState(true)
        }
    }

    const handleGenerate = async () => {
        try {
            // Fetch images
            const imageRes = await fetch("/api/mock-images", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ files: uploadedFiles })
            });
            const imageData = await imageRes.json();
            
            // Fetch videos
            const videoRes = await fetch("/api/mock-videos", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ files: uploadedFiles })
            });
            const videoData = await videoRes.json();
            
            // Fetch audio from mock voice API
            const audioRes = await fetch("/api/mock-voice", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ files: uploadedFiles })
            });
            const audioData = await audioRes.json();
            
            // Combine all media
            const allMedia = [
                ...imageData.images.map((url: string) => ({ 
                    id: Math.random().toString(36).substr(2, 9), 
                    url, 
                    type: 'image/jpeg' 
                })),
                ...videoData.videos.map((url: string) => ({ 
                    id: Math.random().toString(36).substr(2, 9), 
                    url, 
                    type: 'video/mp4' 
                }))
            ];
            
            // Set the first audio URL from the voice API response
            const firstAudioUrl = audioData.images && audioData.images.length > 0 ? audioData.images[0] : null;
            setGeneratedAudio(firstAudioUrl);
            
            setGeneratedMedia(allMedia);
            setShowVanishEffect(true);
            setGeneratedState(true);

            // Reset vanish effect after animation completes
            setTimeout(() => {
                setShowVanishEffect(false)
            }, 2500);
        } catch (error) {
            console.error('Error generating media:', error);
        }
    }

    const getFileCategory = (type: string) => {
        if (type.startsWith("image/")) return "image"
        if (type.startsWith("video/")) return "video"
        if (type.startsWith("audio/")) return "audio"
        if (type === "application/pdf") return "pdf"
        if (type.startsWith("text/") || type === "application/json" || type === "application/javascript") return "text"
        return "other"
    }

    // Helper function to get the first video URL from generated media
    const getFirstVideoUrl = () => {
        const videoMedia = generatedMedia.find(media => media.type.startsWith('video/'));
        return videoMedia?.url;
    };

    // Helper function to get image URLs from generated media
    const getImageUrls = () => {
        return generatedMedia.filter(media => media.type.startsWith('image/')).map(media => media.url);
    };

    const renderFileViewer = (file: UploadedFile) => {
        const category = getFileCategory(file.type)

        switch (category) {
            case "image":
                return (
                    <img
                        src={file.url || "/placeholder.svg"}
                        alt={file.name}
                        className="w-full h-full object-contain rounded-b-lg"
                    />
                )

            case "video":
                return (
                    <video src={file.url} controls className="w-full h-full rounded-b-lg" style={{ maxHeight: "100%" }}>
                        Your browser does not support the video tag.
                    </video>
                )

            case "audio":
                return (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 mx-auto bg-neon-cyan/20 rounded-full flex items-center justify-center">
                                <div className="w-8 h-8 bg-neon-cyan rounded-full animate-pulse"></div>
                            </div>
                            <audio src={file.url} controls className="w-full max-w-md">
                                Your browser does not support the audio tag.
                            </audio>
                            <p className="text-neon-cyan font-mono text-sm">{file.name}</p>
                        </div>
                    </div>
                )

            case "pdf":
                return <iframe src={file.url} className="w-full h-full rounded-b-lg" title={`PDF Viewer - ${file.name}`} />

            case "text":
                return (
                    <iframe
                        src={file.url}
                        className="w-full h-full rounded-b-lg bg-background/90"
                        title={`Text Viewer - ${file.name}`}
                    />
                )

            default:
                return (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 mx-auto border-2 border-dashed border-neon-purple/50 rounded-lg flex items-center justify-center">
                                <div className="w-8 h-8 bg-neon-purple/20 rounded animate-pulse"></div>
                            </div>
                            <p className="text-neon-purple font-mono text-sm">{file.name}</p>
                            <p className="text-neon-cyan/70 font-mono text-xs">File type: {file.type}</p>
                            <p className="text-neon-pink/70 font-mono text-xs">Size: {(file.size / 1024).toFixed(1)} KB</p>
                            <a
                                href={file.url}
                                download={file.name}
                                className="inline-block px-4 py-2 bg-neon-purple/20 border border-neon-purple/50 rounded text-neon-purple font-mono text-xs hover:bg-neon-purple/30 transition-colors"
                            >
                                DOWNLOAD_FILE
                            </a>
                        </div>
                    </div>
                )
        }
    }

    return (
        <div className="min-h-screen relative overflow-hidden">
            <div className="absolute inset-0 cyber-grid opacity-30"></div>
            <div className="flowing-line" style={{ top: "10%", left: "10%" }}></div>
            <div className="flowing-line" style={{ top: "30%", left: "60%" }}></div>
            <div className="flowing-line" style={{ top: "60%", left: "20%" }}></div>
            <div className="flowing-line" style={{ top: "80%", left: "70%" }}></div>

            <div className={`container mx-auto px-4 py-8 relative z-10 ${generatedState ? "max-w-7xl" : "max-w-4xl"}`}>
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <h1 className="text-4xl font-bold text-balance bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink bg-clip-text text-black">
                            NEURAL INTERFACE
                        </h1>
                    </div>
                    <p className="text-neon-cyan text-pretty font-mono tracking-wider">{"> INITIALIZE QUANTUM PROMPT SYSTEM_"}</p>
                    <div className="mt-4 h-px bg-gradient-to-r from-transparent via-neon-purple to-transparent"></div>
                </div>

                <div className={`flex gap-8 ${generatedState ? "flex-row" : "justify-center"}`}>
                    {generatedState && (
                        <div className="flex-1">
                            <Card className="bg-card/50 backdrop-blur-sm border-2 border-neon-cyan/30 hologram-effect neon-glow h-[600px]">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-neon-cyan font-mono">
                                        <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse"></div>
                                        FILE VIEWER
                                        <div className="w-2 h-2 bg-neon-pink rounded-full animate-pulse"></div>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="h-full p-0">
                                    {uploadedFiles[0].url ? (
                                        renderFileViewer(uploadedFiles[0])
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-neon-purple font-mono">
                                            <p>File preview not available</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    <div className={generatedState ? "flex-1 max-w-md" : "max-w-2xl"}>
                        <Card className="mb-8 bg-card/50 backdrop-blur-sm border-2 border-neon-purple/30 hologram-effect neon-glow">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-neon-cyan font-mono">
                                    <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse"></div>
                                    FILE UPLOAD
                                    <div className="w-2 h-2 bg-neon-pink rounded-full animate-pulse"></div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <FileUploadZone
                                    onFilesChange={handleFilesChange}
                                    onGenerate={handleGenerate}
                                    maxFiles={5}
                                    initialFiles={uploadedFiles}
                                />
                            </CardContent>
                        </Card>

                        {generatedState && (
                            <div className={`mb-8 ${showVanishEffect ? "vanish-in vanish-particles" : ""}`}>
                                {showVanishEffect && (
                                    <>
                                        <div className="dust-particle"></div>
                                        <div className="dust-particle"></div>
                                        <div className="dust-particle"></div>
                                    </>
                                )}
                                <VideoPlayer
                                    fileName={uploadedFiles[0]?.name || "Generated Video"}
                                    videoUrl={getFirstVideoUrl()}
                                />
                            </div>
                        )}
                    </div>

                    {generatedState && (
                        <div className={`flex-1 ${showVanishEffect ? "vanish-in vanish-particles" : ""}`}>
                            {showVanishEffect && (
                                <>
                                    <div className="dust-particle"></div>
                                    <div className="dust-particle"></div>
                                    <div className="dust-particle"></div>
                                </>
                            )}
                            <Card className="bg-card/50 backdrop-blur-sm border-2 border-neon-pink/30 hologram-effect neon-glow h-[600px]">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-neon-pink font-mono">
                                        <div className="w-2 h-2 bg-neon-pink rounded-full animate-pulse"></div>
                                        GENERATED IMAGES
                                        <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse"></div>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="h-full p-4">
                                    {getImageUrls().length > 0 ? (
                                        <div className="h-full overflow-y-auto space-y-4">
                                            {getImageUrls().map((imageUrl, index) => (
                                                <div key={index} className="relative group">
                                                    <img
                                                        src={imageUrl}
                                                        alt={`Generated image ${index + 1}`}
                                                        className="w-full h-auto rounded-lg border border-neon-pink/30 hover:border-neon-pink/60 transition-colors"
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            // Prevent infinite loop by checking if we've already tried the fallback
                                                            if (!target.src.includes('placeholder.svg')) {
                                                                target.src = "/placeholder.svg";
                                                            } else {
                                                                // If placeholder also fails, show a simple broken image state
                                                                target.style.display = 'none';
                                                                const parent = target.parentElement;
                                                                if (parent && !parent.querySelector('.error-placeholder')) {
                                                                    const errorDiv = document.createElement('div');
                                                                    errorDiv.className = 'error-placeholder w-full h-40 bg-neon-pink/10 border border-neon-pink/30 rounded-lg flex items-center justify-center';
                                                                    errorDiv.innerHTML = '<div class="text-center"><div class="w-8 h-8 mx-auto bg-neon-pink/20 rounded mb-2"></div><p class="text-neon-pink font-mono text-xs">IMAGE_ERROR</p></div>';
                                                                    parent.appendChild(errorDiv);
                                                                }
                                                            }
                                                        }}
                                                    />
                                                    <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded px-2 py-1 text-xs text-neon-pink font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                                                        IMAGE_{index + 1}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="h-full flex items-center justify-center">
                                            <div className="text-center space-y-4">
                                                <div className="w-16 h-16 mx-auto border-2 border-dashed border-neon-pink/50 rounded-lg flex items-center justify-center">
                                                    <div className="w-8 h-8 bg-neon-pink/20 rounded animate-pulse"></div>
                                                </div>
                                                <p className="text-neon-pink font-mono text-sm">IMAGES_LOADING</p>
                                                <div className="text-xs text-neon-cyan/70 font-mono">{">"} GENERATING_VISUALS</div>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>

                {generatedState && (
                    <div className={`mt-8 ${showVanishEffect ? "vanish-in vanish-particles" : ""}`}>
                        {showVanishEffect && (
                            <>
                                <div className="dust-particle"></div>
                                <div className="dust-particle"></div>
                                <div className="dust-particle"></div>
                            </>
                        )}
                        <MediaPlayer 
                            fileName={generatedAudio ? "Generated Audio Stream" : "Audio Stream Ready"} 
                            audioUrl={generatedAudio || undefined}
                        />
                    </div>
                )}

                <div className="fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-md border-t-2 border-neon-cyan/30 p-4">
                    <div className="container mx-auto max-w-4xl">
                        <div className="mb-2 flex items-center gap-2 text-xs text-neon-cyan font-mono">
                            <div className="w-1 h-1 bg-neon-cyan rounded-full animate-pulse"></div>
                            QUANTUM_TERMINAL_v2.1.0
                            <div className="flex-1 h-px bg-gradient-to-r from-neon-cyan/50 to-transparent"></div>
                            <span className="text-neon-pink">READY</span>
                        </div>
                        <PromptInput
                            onSubmit={handlePromptSubmit}
                            placeholder="> Enter neural command sequence..."
                            loading={isProcessing}
                        />
                    </div>
                </div>

                {/* Bottom spacing to account for fixed input */}
                <div className="h-40" />
            </div>
        </div>
    )
}

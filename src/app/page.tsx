"use client"

import { useState } from "react"
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

export default function Home() {
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
    const [isProcessing, setIsProcessing] = useState(false)
    const [generatedFile, setGeneratedFile] = useState<UploadedFile | null>(null)
    const [showVanishEffect, setShowVanishEffect] = useState(false)

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
            setGeneratedFile(null)
        }
    }

    const handleGenerate = (file: UploadedFile) => {
        setShowVanishEffect(true)
        setGeneratedFile(file)

        // Reset vanish effect after animation completes
        setTimeout(() => {
            setShowVanishEffect(false)
        }, 2500)
    }

    const getFileCategory = (type: string) => {
        if (type.startsWith("image/")) return "image"
        if (type.startsWith("video/")) return "video"
        if (type.startsWith("audio/")) return "audio"
        if (type === "application/pdf") return "pdf"
        if (type.startsWith("text/") || type === "application/json" || type === "application/javascript") return "text"
        return "other"
    }

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

            <div className={`container mx-auto px-4 py-8 relative z-10 ${generatedFile ? "max-w-7xl" : "max-w-4xl"}`}>
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <h1 className="text-4xl font-bold text-balance bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink bg-clip-text text-black">
                            NEURAL INTERFACE
                        </h1>
                    </div>
                    <p className="text-neon-cyan text-pretty font-mono tracking-wider">{"> INITIALIZE QUANTUM PROMPT SYSTEM_"}</p>
                    <div className="mt-4 h-px bg-gradient-to-r from-transparent via-neon-purple to-transparent"></div>
                </div>

                <div className={`flex gap-8 ${generatedFile ? "flex-row" : "justify-center"}`}>
                    {generatedFile && (
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
                                    {generatedFile.url ? (
                                        renderFileViewer(generatedFile)
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-neon-purple font-mono">
                                            <p>File preview not available</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    <div className={generatedFile ? "flex-1 max-w-md" : "max-w-2xl"}>
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

                        {generatedFile && (
                            <div className={`mb-8 ${showVanishEffect ? "vanish-in vanish-particles" : ""}`}>
                                {showVanishEffect && (
                                    <>
                                        <div className="dust-particle"></div>
                                        <div className="dust-particle"></div>
                                        <div className="dust-particle"></div>
                                    </>
                                )}
                                <VideoPlayer
                                    fileName={generatedFile.name}
                                    videoUrl={generatedFile.type.startsWith("video/") ? generatedFile.url : undefined}
                                />
                            </div>
                        )}
                    </div>

                    {generatedFile && (
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
                                        FILE PLACEHOLDER
                                        <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse"></div>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="h-full flex items-center justify-center">
                                    <div className="text-center space-y-4">
                                        <div className="w-16 h-16 mx-auto border-2 border-dashed border-neon-pink/50 rounded-lg flex items-center justify-center">
                                            <div className="w-8 h-8 bg-neon-pink/20 rounded animate-pulse"></div>
                                        </div>
                                        <p className="text-neon-pink font-mono text-sm">FILE_PLACEHOLDER_READY</p>
                                        <div className="text-xs text-neon-cyan/70 font-mono">{">"} AWAITING_DATA_STREAM</div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>

                {generatedFile && (
                    <div className={`mt-8 ${showVanishEffect ? "vanish-in vanish-particles" : ""}`}>
                        {showVanishEffect && (
                            <>
                                <div className="dust-particle"></div>
                                <div className="dust-particle"></div>
                                <div className="dust-particle"></div>
                            </>
                        )}
                        <MediaPlayer fileName="Audio Stream Ready" />
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

"use client"

import type React from "react"
import { Upload } from "lucide-react"
import { useState, useCallback, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface UploadedFile {
    id: string
    name: string
    size: number
    type: string
    url?: string
}

interface FileUploadZoneProps {
    onFilesChange?: (files: UploadedFile[]) => void
    onGenerate?: (file: UploadedFile) => void
    maxFiles?: number
    acceptedTypes?: string[]
    initialFiles?: UploadedFile[]
}

export function FileUploadZone({
                                   onFilesChange,
                                   onGenerate,
                                   maxFiles = 10,
                                   acceptedTypes = ["*/*"],
                                   initialFiles = [],
                               }: FileUploadZoneProps) {
    const [files, setFiles] = useState<UploadedFile[]>([])
    const [isDragOver, setIsDragOver] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        setFiles(initialFiles)
    }, [initialFiles])

    const getFileIcon = (type: string) => {
        if (type.startsWith("image/")) return <span className="text-sm">🖼️</span>
        if (type.startsWith("video/")) return <span className="text-sm">🎥</span>
        if (type.startsWith("audio/")) return <span className="text-sm">🎵</span>
        if (type.includes("text") || type.includes("document")) return <span className="text-sm">📄</span>
        return <span className="text-sm">📁</span>
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes"
        const k = 1024
        const sizes = ["Bytes", "KB", "MB", "GB"]
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    }

    const handleFiles = useCallback(
        (fileList: FileList) => {
            const newFiles: UploadedFile[] = Array.from(fileList).map((file) => ({
                id: Math.random().toString(36).substr(2, 9),
                name: file.name,
                size: file.size,
                type: file.type,
                url: URL.createObjectURL(file),
            }))

            const updatedFiles = [...files, ...newFiles].slice(0, maxFiles)
            setFiles(updatedFiles)
            onFilesChange?.(updatedFiles)
        },
        [files, maxFiles, onFilesChange],
    )

    const removeFile = (id: string) => {
        const updatedFiles = files.filter((file) => file.id !== id)
        setFiles(updatedFiles)
        onFilesChange?.(updatedFiles)
    }

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault()
            setIsDragOver(false)

            if (e.dataTransfer.files) {
                handleFiles(e.dataTransfer.files)
            }
        },
        [handleFiles],
    )

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
    }, [])

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            handleFiles(e.target.files)
        }
    }

    const handleButtonClick = (e: React.MouseEvent) => {
        e.preventDefault()
        fileInputRef.current?.click()
    }

    const handleGenerate = () => {
        if (files.length > 0) {
            // Generate with the first uploaded file
            onGenerate?.(files[0])
        }
    }

    return (
        <div className="space-y-4">
            {files.length === 0 && (
                <Card
                    className={cn(
                        "border-2 border-dashed transition-all duration-300 cursor-pointer relative overflow-hidden",
                        isDragOver
                            ? "border-neon-cyan bg-neon-cyan/5 shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                            : "border-neon-purple hover:border-neon-cyan hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] shadow-[0_0_10px_rgba(147,51,234,0.3)]",
                    )}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-purple/5 to-transparent transform -skew-x-12 animate-pulse"></div>

                    <label className="flex flex-col items-center justify-center p-8 cursor-pointer relative z-10">
                        <div className="relative">
                            <div
                                className={cn(
                                    "h-12 w-12 mb-4 transition-all duration-300 flex items-center justify-center",
                                    isDragOver
                                        ? "text-neon-cyan scale-110 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]"
                                        : "text-neon-purple",
                                )}
                            >
                                <Upload className="h-8 w-8" />
                            </div>
                            {isDragOver && <span className="absolute -top-1 -right-1 text-sm text-neon-pink animate-bounce">⚡</span>}
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-bold mb-1 font-mono text-neon-cyan">
                                {isDragOver ? "UPLOADING_DATA..." : "DRAG & DROP FILES"}
                            </p>
                            <p className="text-xs text-muted-foreground mb-3 font-mono">{"or click to browse quantum storage"}</p>
                            <Button
                                variant="outline"
                                size="sm"
                                type="button"
                                onClick={handleButtonClick}
                                className="border-neon-purple text-neon-purple hover:bg-neon-purple/10 hover:text-neon-cyan transition-all duration-300 font-mono bg-transparent"
                            >
                                UPLOAD FILE
                            </Button>
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            className="hidden"
                            onChange={handleFileInput}
                            accept={acceptedTypes.join(",")}
                        />
                    </label>
                </Card>
            )}

            {files.length > 0 && (
                <div className="space-y-2">
                    <div className="text-sm font-bold text-neon-cyan font-mono flex items-center gap-2">
                        <p className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse"></p>
                        UPLOADED FILES ({files.length})
                    </div>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                        {files.map((file) => (
                            <div
                                key={file.id}
                                className="flex items-center gap-3 p-3 bg-card/30 backdrop-blur-sm rounded-lg border border-neon-purple/30 hover:border-neon-cyan/50 transition-all duration-300"
                            >
                                <div className="text-neon-cyan">{getFileIcon(file.type)}</div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate font-mono text-foreground">{file.name}</p>
                                    <p className="text-xs text-neon-purple font-mono">{formatFileSize(file.size)}</p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeFile(file.id)}
                                    className="h-8 w-8 p-0 hover:bg-destructive/20 hover:text-destructive text-neon-pink border border-neon-pink/30 hover:border-destructive/50 transition-all duration-300"
                                >
                                    <span className="text-sm font-bold">×</span>
                                </Button>
                            </div>
                        ))}
                    </div>
                    <div className="pt-2">
                        <div className="flex justify-center">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleGenerate}
                                className="px-6 border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10 hover:text-neon-pink transition-all duration-300 font-mono bg-transparent shadow-[0_0_10px_rgba(6,182,212,0.3)] hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] rounded-full"
                            >
                                <span className="mr-2">⚡</span>
                                GENERATE
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

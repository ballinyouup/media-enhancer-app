"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Send, Paperclip, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface PromptInputProps {
    onSubmit?: (prompt: string, files: File[]) => void
    placeholder?: string
    disabled?: boolean
    loading?: boolean
}

export function PromptInput({
                                onSubmit,
                                placeholder = "Enter your prompt...",
                                disabled = false,
                                loading = false,
                            }: PromptInputProps) {
    const [prompt, setPrompt] = useState("")
    const [attachedFiles, setAttachedFiles] = useState<File[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const handleSubmit = () => {
        if (prompt.trim() || attachedFiles.length > 0) {
            onSubmit?.(prompt, attachedFiles)
            setPrompt("")
            setAttachedFiles([])
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSubmit()
        }
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files)
            setAttachedFiles((prev) => [...prev, ...newFiles])
        }
    }

    const removeFile = (index: number) => {
        setAttachedFiles((prev) => prev.filter((_, i) => i !== index))
    }

    const canSubmit = (prompt.trim() || attachedFiles.length > 0) && !disabled && !loading

    return (
        <div className="space-y-3">
            {/* Attached Files Preview */}
            {attachedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {attachedFiles.map((file, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-2 px-3 py-1.5 bg-neon-purple/20 border border-neon-purple/50 rounded-full text-sm font-mono backdrop-blur-sm"
                        >
                            <span className="truncate max-w-32 text-neon-cyan">{file.name}</span>
                            <button
                                onClick={() => removeFile(index)}
                                className="text-neon-pink hover:text-destructive transition-colors"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Input Area */}
            <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-pink rounded-full blur opacity-20"></div>
                <div className="relative">
                    <Textarea
                        ref={textareaRef}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        disabled={disabled}
                        className={cn(
                            "min-h-[60px] max-h-[200px] resize-none pr-20 py-4 font-mono",
                            "bg-card/50 backdrop-blur-sm border-2 border-neon-purple/50 focus:border-neon-cyan transition-all duration-300 rounded-full",
                            "placeholder:text-muted-foreground text-foreground",
                            "focus:shadow-[0_0_20px_rgba(119,198,255,0.3)]",
                        )}
                    />

                    {/* Action Buttons */}
                    <div className="absolute bottom-3 right-3 flex items-center gap-2">
                        <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileSelect} />

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={disabled}
                            className="h-8 w-8 p-0 text-neon-purple hover:text-neon-cyan transition-all duration-300 hover:bg-neon-purple/20 border border-neon-purple/30 hover:border-neon-cyan/50 rounded-full"
                        >
                            <Paperclip className="h-4 w-4" />
                        </Button>

                        <Button
                            onClick={handleSubmit}
                            disabled={!canSubmit}
                            size="sm"
                            className="cursor-pointer h-8 w-8 p-0 bg-gradient-to-r from-neon-purple to-neon-cyan hover:from-neon-cyan hover:to-neon-pink text-black border-0 shadow-[0_0_15px_rgba(120,119,198,0.5)] hover:shadow-[0_0_25px_rgba(119,198,255,0.7)] transition-all duration-300 rounded-full"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

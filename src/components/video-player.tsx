"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react"
import { useState, useRef } from "react"

interface VideoPlayerProps {
    fileName: string
    videoUrl?: string
}

export function VideoPlayer({ fileName, videoUrl }: VideoPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [isMuted, setIsMuted] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const videoRef = useRef<HTMLVideoElement>(null)

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause()
            } else {
                videoRef.current.play()
            }
            setIsPlaying(!isPlaying)
        }
    }

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted
            setIsMuted(!isMuted)
        }
    }

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime)
        }
    }

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration)
        }
    }

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = Number.parseFloat(e.target.value)
        if (videoRef.current) {
            videoRef.current.currentTime = time
            setCurrentTime(time)
        }
    }

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        return `${minutes}:${seconds.toString().padStart(2, "0")}`
    }

    return (
        <Card className="bg-card/50 backdrop-blur-sm border-2 border-neon-purple/30 hologram-effect neon-glow h-[300px] w-full">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-neon-purple font-mono text-sm">
                    <div className="w-2 h-2 bg-neon-purple rounded-full animate-pulse"></div>
                    VIDEO PLAYER
                    <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse"></div>
                </CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-60px)] pb-4">
                <div className="relative h-full bg-black/20 rounded-lg overflow-hidden border border-neon-purple/20">
                    {videoUrl ? (
                        <>
                            <video
                                ref={videoRef}
                                className="w-full h-full object-contain"
                                onTimeUpdate={handleTimeUpdate}
                                onLoadedMetadata={handleLoadedMetadata}
                                onEnded={() => setIsPlaying(false)}
                            >
                                <source src={videoUrl} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>

                            {/* Video Controls Overlay */}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                                <div className="flex items-center gap-3">
                                    <button onClick={togglePlay} className="text-neon-cyan hover:text-neon-purple transition-colors">
                                        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                                    </button>

                                    <div className="flex-1 flex items-center gap-2">
                                        <span className="text-xs text-neon-cyan font-mono">{formatTime(currentTime)}</span>
                                        <input
                                            type="range"
                                            min="0"
                                            max={duration || 0}
                                            value={currentTime}
                                            onChange={handleSeek}
                                            className="flex-1 h-1 bg-neon-purple/20 rounded-lg appearance-none cursor-pointer"
                                            style={{
                                                background: `linear-gradient(to right, rgb(6 182 212) 0%, rgb(6 182 212) ${(currentTime / duration) * 100}%, rgba(168, 85, 247, 0.2) ${(currentTime / duration) * 100}%, rgba(168, 85, 247, 0.2) 100%)`,
                                            }}
                                        />
                                        <span className="text-xs text-neon-cyan font-mono">{formatTime(duration)}</span>
                                    </div>

                                    <button onClick={toggleMute} className="text-neon-cyan hover:text-neon-purple transition-colors">
                                        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                                    </button>

                                    <button className="text-neon-cyan hover:text-neon-purple transition-colors">
                                        <Maximize size={20} />
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full text-center space-y-4">
                            <div>
                                <div className="w-16 h-16 mx-auto border-2 border-dashed border-neon-purple/50 rounded-lg flex items-center justify-center mb-4">
                                    <Play className="w-8 h-8 text-neon-purple/50" />
                                </div>
                                <p className="text-neon-purple font-mono text-sm">VIDEO_READY</p>
                                <div className="text-xs text-neon-cyan/70 font-mono">{">"} AWAITING_MP4_STREAM</div>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

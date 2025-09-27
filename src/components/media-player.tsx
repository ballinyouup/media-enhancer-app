"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface MediaPlayerProps {
    fileName: string
    audioUrl?: string
}

export function MediaPlayer({ fileName, audioUrl }: MediaPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [volume, setVolume] = useState(75)
    const [isMuted, setIsMuted] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const audioRef = useRef<HTMLAudioElement>(null)

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        return `${minutes}:${seconds.toString().padStart(2, "0")}`
    }

    const togglePlay = async () => {
        if (!audioRef.current || !audioUrl) return
        
        try {
            if (isPlaying) {
                audioRef.current.pause()
                setIsPlaying(false)
            } else {
                await audioRef.current.play()
                setIsPlaying(true)
            }
        } catch (error) {
            console.error('Error playing audio:', error)
        }
    }

    const toggleMute = () => {
        const newMuted = !isMuted
        setIsMuted(newMuted)
        if (audioRef.current) {
            audioRef.current.muted = newMuted
        }
    }

    const handleProgressChange = (value: number[]) => {
        if (audioRef.current) {
            audioRef.current.currentTime = value[0]
            setCurrentTime(value[0])
        }
    }

    const handleVolumeChange = (value: number[]) => {
        const newVolume = value[0]
        setVolume(newVolume)
        setIsMuted(false)
        if (audioRef.current) {
            audioRef.current.volume = newVolume / 100
        }
    }

    // Set up audio element event listeners
    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return

        const handleLoadedMetadata = () => {
            setDuration(audio.duration)
            setIsLoading(false)
        }

        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime)
        }

        const handleEnded = () => {
            setIsPlaying(false)
            setCurrentTime(0)
        }

        const handleLoadStart = () => {
            setIsLoading(true)
        }

        const handleCanPlay = () => {
            setIsLoading(false)
        }

        audio.addEventListener('loadedmetadata', handleLoadedMetadata)
        audio.addEventListener('timeupdate', handleTimeUpdate)
        audio.addEventListener('ended', handleEnded)
        audio.addEventListener('loadstart', handleLoadStart)
        audio.addEventListener('canplay', handleCanPlay)

        // Set initial volume
        audio.volume = volume / 100
        audio.muted = isMuted

        return () => {
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
            audio.removeEventListener('timeupdate', handleTimeUpdate)
            audio.removeEventListener('ended', handleEnded)
            audio.removeEventListener('loadstart', handleLoadStart)
            audio.removeEventListener('canplay', handleCanPlay)
        }
    }, [audioUrl, isMuted, volume])

    // Handle skip forward/backward
    const skipForward = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = Math.min(audioRef.current.currentTime + 10, duration)
        }
    }

    const skipBackward = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = Math.max(audioRef.current.currentTime - 10, 0)
        }
    }

    return (
        <Card className="bg-card/50 backdrop-blur-sm border-2 border-neon-purple/30 hologram-effect neon-glow vanish-in vibrate">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-neon-purple font-mono">
                    <div className="w-2 h-2 bg-neon-purple rounded-full animate-pulse"></div>
                    AUDIO STREAM
                    <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse"></div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-4">
                    {/* File Info */}
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                        <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse"></div>
                        <div className="w-1 h-1 bg-neon-pink rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                        <span className="text-neon-cyan font-mono text-sm truncate">{fileName}</span>
                        <div className="w-1 h-1 bg-neon-orange rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                    </div>

                    {/* Control Buttons */}
                    <div className="flex items-center gap-2">
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={skipBackward}
                            disabled={!audioUrl}
                            className="w-8 h-8 p-0 text-neon-cyan hover:text-neon-pink hover:bg-neon-cyan/10 transition-colors disabled:opacity-50"
                        >
                            <SkipBack className="w-4 h-4" />
                        </Button>

                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={togglePlay}
                            disabled={!audioUrl || isLoading}
                            className="w-10 h-10 p-0 text-neon-cyan hover:text-neon-pink hover:bg-neon-cyan/10 transition-colors border border-neon-cyan/30 rounded-full disabled:opacity-50"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin" />
                            ) : isPlaying ? (
                                <Pause className="w-5 h-5" />
                            ) : (
                                <Play className="w-5 h-5 ml-0.5" />
                            )}
                        </Button>

                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={skipForward}
                            disabled={!audioUrl}
                            className="w-8 h-8 p-0 text-neon-cyan hover:text-neon-pink hover:bg-neon-cyan/10 transition-colors disabled:opacity-50"
                        >
                            <SkipForward className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Progress Bar */}
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="text-xs text-neon-purple font-mono whitespace-nowrap">{formatTime(currentTime)}</span>
                        <div className="flex-1">
                            <Slider
                                value={[currentTime]}
                                max={duration || 100}
                                step={1}
                                onValueChange={handleProgressChange}
                                disabled={!audioUrl}
                                className="w-full [&_[role=slider]]:bg-neon-cyan [&_[role=slider]]:border-neon-cyan [&_.bg-primary]:bg-neon-cyan"
                            />
                        </div>
                        <span className="text-xs text-neon-purple font-mono whitespace-nowrap">{formatTime(duration)}</span>
                    </div>

                    {/* Volume Control */}
                    <div className="flex items-center gap-2">
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={toggleMute}
                            className="w-8 h-8 p-0 text-neon-cyan hover:text-neon-pink hover:bg-neon-cyan/10 transition-colors"
                        >
                            {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </Button>
                        <div className="w-20">
                            <Slider
                                value={[isMuted ? 0 : volume]}
                                max={100}
                                step={1}
                                onValueChange={handleVolumeChange}
                                className="[&_[role=slider]]:bg-neon-cyan [&_[role=slider]]:border-neon-cyan [&_.bg-primary]:bg-neon-cyan"
                            />
                        </div>
                    </div>
                </div>
                
                {/* Hidden audio element */}
                {audioUrl && (
                    <audio
                        ref={audioRef}
                        src={audioUrl}
                        preload="metadata"
                        className="hidden"
                    />
                )}
            </CardContent>
        </Card>
    )
}

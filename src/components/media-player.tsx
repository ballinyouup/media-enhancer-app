"use client"

import { useState, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface MediaPlayerProps {
    fileName: string
}

export function MediaPlayer({ fileName }: MediaPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [volume, setVolume] = useState(75)
    const [isMuted, setIsMuted] = useState(false)

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        return `${minutes}:${seconds.toString().padStart(2, "0")}`
    }

    const togglePlay = () => {
        setIsPlaying(!isPlaying)
    }

    const toggleMute = () => {
        setIsMuted(!isMuted)
    }

    const handleProgressChange = (value: number[]) => {
        setCurrentTime(value[0])
    }

    const handleVolumeChange = (value: number[]) => {
        setVolume(value[0])
        setIsMuted(false)
    }

    // Simulate media playback for demo
    useEffect(() => {
        setDuration(180) // 3 minutes demo duration
    }, [])

    useEffect(() => {
        let interval: NodeJS.Timeout
        if (isPlaying && currentTime < duration) {
            interval = setInterval(() => {
                setCurrentTime((prev) => Math.min(prev + 1, duration))
            }, 1000)
        }
        return () => clearInterval(interval)
    }, [isPlaying, currentTime, duration])

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
                            className="w-8 h-8 p-0 text-neon-cyan hover:text-neon-pink hover:bg-neon-cyan/10 transition-colors"
                        >
                            <SkipBack className="w-4 h-4" />
                        </Button>

                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={togglePlay}
                            className="w-10 h-10 p-0 text-neon-cyan hover:text-neon-pink hover:bg-neon-cyan/10 transition-colors border border-neon-cyan/30 rounded-full"
                        >
                            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                        </Button>

                        <Button
                            size="sm"
                            variant="ghost"
                            className="w-8 h-8 p-0 text-neon-cyan hover:text-neon-pink hover:bg-neon-cyan/10 transition-colors"
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
                                max={duration}
                                step={1}
                                onValueChange={handleProgressChange}
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
            </CardContent>
        </Card>
    )
}

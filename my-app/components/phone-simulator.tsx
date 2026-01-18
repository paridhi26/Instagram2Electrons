"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Camera, Heart, MessageCircle, Home, Search, PlusSquare, User, X, Loader2 } from "lucide-react"

type Screen = "feed" | "gallery" | "uploading"

type PhoneSimulatorProps = {
  onUploadStart?: () => void
  onUploadProgress?: (progress: number) => void
  onUploadComplete?: () => void
  onReset?: () => void
  onImageSelected?: (dataUrl: string) => void
  progressOverride?: number
}

export function PhoneSimulator({
  onUploadStart,
  onUploadProgress,
  onUploadComplete,
  onReset,
  onImageSelected,
  progressOverride,
}: PhoneSimulatorProps) {
  const [screen, setScreen] = useState<Screen>("feed")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const hasCompletedRef = useRef(false)
  const displayProgress = progressOverride ?? uploadProgress

  useEffect(() => {
    if (progressOverride === undefined) {
      return
    }
    setUploadProgress(progressOverride)
  }, [progressOverride])

  useEffect(() => {
    if (!onUploadProgress) {
      return
    }
    onUploadProgress(displayProgress)
  }, [displayProgress, onUploadProgress])

  useEffect(() => {
    if (screen !== "uploading") {
      return
    }
    if (displayProgress >= 100 && !hasCompletedRef.current) {
      hasCompletedRef.current = true
      onUploadComplete?.()
    }
  }, [displayProgress, screen, onUploadComplete])

  const handleCreatePost = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string
        setSelectedImage(dataUrl)
        onImageSelected?.(dataUrl)
        setScreen("gallery")
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpload = () => {
    setScreen("uploading")
    setUploadProgress(0)
    onUploadStart?.()
    hasCompletedRef.current = false
    if (progressOverride !== undefined) {
      return
    }

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        const next = Math.min(100, prev + Math.random() * 15)
        if (next >= 100) {
          clearInterval(interval)
        }
        return next
      })
    }, 200)
  }

  const handleCancel = () => {
    setScreen("feed")
    setSelectedImage(null)
    setUploadProgress(0)
    hasCompletedRef.current = false
    onReset?.()
  }

  return (
    <div className="relative">
      {/* Phone Frame */}
      <div className="w-[280px] h-[580px] bg-[#0a0a0a] rounded-[40px] p-2 shadow-2xl border border-[#2a2a2a]">
        {/* Phone Inner */}
        <div className="w-full h-full bg-[#000000] rounded-[32px] overflow-hidden flex flex-col relative">
          {/* Dynamic Island */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#0a0a0a] rounded-full z-50" />

          {/* Status Bar */}
          <div className="h-12 flex items-end justify-between px-6 pb-1 text-[10px] text-white/80">
            <span>9:41</span>
            <div className="flex gap-1 items-center">
              <div className="w-4 h-2 border border-white/80 rounded-sm">
                <div className="w-3/4 h-full bg-white/80 rounded-sm" />
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-hidden">
            {screen === "feed" && <FeedScreen />}
            {screen === "gallery" && selectedImage && (
              <GalleryScreen image={selectedImage} onUpload={handleUpload} onCancel={handleCancel} />
            )}
            {screen === "uploading" && selectedImage && (
              <UploadingScreen image={selectedImage} progress={displayProgress} />
            )}
          </div>

          {/* Bottom Navigation */}
          <div className="h-14 bg-[#000000] border-t border-[#262626] flex items-center justify-around px-4">
            <button className="p-2 text-white">
              <Home className="w-6 h-6" />
            </button>
            <button className="p-2 text-white/60">
              <Search className="w-6 h-6" />
            </button>
            <button className="p-2 text-white/60 hover:text-white transition-colors" onClick={handleCreatePost}>
              <PlusSquare className="w-6 h-6" />
            </button>
            <button className="p-2 text-white/60">
              <Heart className="w-6 h-6" />
            </button>
            <button className="p-2 text-white/60">
              <User className="w-6 h-6" />
            </button>
          </div>

          {/* Home Indicator */}
          <div className="h-5 flex items-center justify-center">
            <div className="w-32 h-1 bg-white/30 rounded-full" />
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
    </div>
  )
}

function FeedScreen() {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="h-11 flex items-center justify-between px-4 border-b border-[#262626]">
        <span className="text-white font-semibold text-lg tracking-tight" style={{ fontFamily: "system-ui" }}>
          Instagram
        </span>
        <div className="flex gap-4">
          <Heart className="w-5 h-5 text-white" />
          <MessageCircle className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* Stories */}
      <div className="h-24 border-b border-[#262626] flex items-center gap-3 px-3 overflow-x-auto">
        <div className="flex flex-col items-center gap-1 flex-shrink-0">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-0.5">
            <div className="w-full h-full rounded-full bg-[#000000] flex items-center justify-center">
              <Camera className="w-5 h-5 text-white/60" />
            </div>
          </div>
          <span className="text-[10px] text-white/60">Your story</span>
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col items-center gap-1 flex-shrink-0">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-0.5">
              <div className="w-full h-full rounded-full bg-[#262626]" />
            </div>
            <span className="text-[10px] text-white/60">user_{i}</span>
          </div>
        ))}
      </div>

      {/* Empty Feed State */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <div className="w-16 h-16 rounded-full border-2 border-white/20 flex items-center justify-center mb-4">
          <Camera className="w-8 h-8 text-white/40" />
        </div>
        <p className="text-white/60 text-xs">
          Tap <PlusSquare className="w-3 h-3 inline mx-1" /> to create a post
        </p>
        <p className="text-white/40 text-[10px] mt-2">Watch it travel through the network</p>
      </div>
    </div>
  )
}

function GalleryScreen({
  image,
  onUpload,
  onCancel,
}: {
  image: string
  onUpload: () => void
  onCancel: () => void
}) {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="h-11 flex items-center justify-between px-4 border-b border-[#262626]">
        <button onClick={onCancel} className="text-white">
          <X className="w-5 h-5" />
        </button>
        <span className="text-white font-semibold">New Post</span>
        <button
          onClick={onUpload}
          className="text-blue-500 font-semibold text-sm hover:text-blue-400 transition-colors"
        >
          Share
        </button>
      </div>

      {/* Selected Image Preview */}
      <div className="flex-1 flex flex-col">
        <div className="aspect-square w-full bg-[#1a1a1a] flex items-center justify-center overflow-hidden">
          <img src={image || "/placeholder.svg"} alt="Selected" className="w-full h-full object-cover" />
        </div>

        {/* Caption Area */}
        <div className="p-3 border-t border-[#262626]">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#262626]" />
            <input
              type="text"
              placeholder="Write a caption..."
              className="flex-1 bg-transparent text-white text-sm placeholder:text-white/40 outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function UploadingScreen({
  image,
  progress,
}: {
  image: string
  progress: number
}) {
  const isComplete = progress >= 100

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="h-11 flex items-center justify-center px-4 border-b border-[#262626]">
        <span className="text-white font-semibold">{isComplete ? "Shared!" : "Sharing..."}</span>
      </div>

      {/* Upload Progress */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <div className="relative w-32 h-32 mb-6">
          <img
            src={image || "/placeholder.svg"}
            alt="Uploading"
            className="w-full h-full object-cover rounded-lg opacity-60"
          />
          {!isComplete && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-[200px] h-1 bg-[#262626] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 transition-all duration-200"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        <p className="text-white/60 text-xs mt-3 font-mono">
          {isComplete ? "Upload complete" : `Uploading... ${Math.round(progress)}%`}
        </p>

        {!isComplete && (
          <p className="text-white/30 text-[10px] mt-4 text-center max-w-[180px]">
            Watch the right panel to see your data travel through the network stack →
          </p>
        )}
      </div>
    </div>
  )
}

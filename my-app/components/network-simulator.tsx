"use client"

import { useMemo, useRef, useState } from "react"

import { PhoneSimulator } from "./phone-simulator"

export function NetworkSimulator() {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [activeSlide, setActiveSlide] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  const slides = useMemo(
    () => [
      {
        id: "application",
        title: "Application Layer",
        subtitle: "UI → JavaScript → HTTP payload",
      },
      {
        id: "transport",
        title: "Transport Layer",
        subtitle: "HTTP bytes → TCP segments",
      },
      {
        id: "network-ethernet",
        title: "Network + Ethernet",
        subtitle: "IP packets → Ethernet frames",
      },
      {
        id: "routing",
        title: "Routing",
        subtitle: "A destination path is selected",
      },
      {
        id: "physical",
        title: "Physical Layer",
        subtitle: "Bits, photons, and physics",
      },
      {
        id: "exit-lan",
        title: "Leaving the LAN",
        subtitle: "Switches, routers, BGP handoffs",
      },
      {
        id: "internet",
        title: "Internet Backbone",
        subtitle: "Cross-ISP transit and peering",
      },
      {
        id: "meta-edge",
        title: "Meta Edge",
        subtitle: "Edge PoP → storage → post is live",
      },
    ],
    []
  )

  const statusLabel = isComplete
    ? "Arrived at edge"
    : isUploading
      ? "Transmitting"
      : "Awaiting upload"

  const handleUploadStart = () => {
    setIsUploading(true)
    setIsComplete(false)
    setUploadProgress(0)
  }

  const handleUploadProgress = (progress: number) => {
    setUploadProgress(progress)
  }

  const handleUploadComplete = () => {
    setIsComplete(true)
    setIsUploading(false)
  }

  const handleReset = () => {
    setIsUploading(false)
    setIsComplete(false)
    setUploadProgress(0)
  }

  const slideProgress = Math.round(((activeSlide + 1) / slides.length) * 100)
  const syncedProgress = isUploading || isComplete ? (isComplete ? 100 : slideProgress) : uploadProgress

  const handleScroll = () => {
    const container = scrollRef.current
    if (!container) {
      return
    }
    const height = container.clientHeight || 1
    const index = Math.round(container.scrollTop / height)
    const clamped = Math.min(slides.length - 1, Math.max(0, index))
    setActiveSlide(clamped)
  }

  const scrollToSlide = (index: number) => {
    const container = scrollRef.current
    if (!container) {
      return
    }
    const height = container.clientHeight || 1
    container.scrollTo({ top: index * height, behavior: "smooth" })
  }

  const bytePreview = useMemo(() => {
    if (!selectedImage) {
      return ""
    }
    const base64 = selectedImage.split(",")[1] || ""
    try {
      const raw = atob(base64.slice(0, 120))
      const bytes = Array.from(raw)
        .slice(0, 48)
        .map((char) => char.charCodeAt(0).toString(16).padStart(2, "0"))
      return bytes.join(" ")
    } catch {
      return ""
    }
  }, [selectedImage])

  const byteSizeBytes = useMemo(() => {
    if (!selectedImage) {
      return 0
    }
    const base64 = selectedImage.split(",")[1] || ""
    return Math.round((base64.length * 3) / 4)
  }, [selectedImage])

  const byteSizeLabel = useMemo(() => {
    if (!byteSizeBytes) {
      return "0 B"
    }
    if (byteSizeBytes < 1024) {
      return `${byteSizeBytes} B`
    }
    if (byteSizeBytes < 1024 * 1024) {
      return `${(byteSizeBytes / 1024).toFixed(1)} KB`
    }
    return `${(byteSizeBytes / (1024 * 1024)).toFixed(1)} MB`
  }, [byteSizeBytes])

  return (
    <div className="flex min-h-screen w-full flex-col lg:h-screen lg:flex-row">
      {/* Left 1/4 - Phone Simulator */}
      <div className="w-full border-b border-border flex items-center justify-center bg-background p-6 lg:w-1/4 lg:min-w-[240px] lg:border-b-0 lg:border-r">
        <PhoneSimulator
          onUploadStart={handleUploadStart}
          onUploadProgress={handleUploadProgress}
          onUploadComplete={handleUploadComplete}
          onReset={handleReset}
          onImageSelected={setSelectedImage}
          progressOverride={isUploading || isComplete ? syncedProgress : undefined}
        />
      </div>

      {/* Right 3/4 - Storytelling */}
      <div className="relative w-full flex-1 overflow-hidden story-panel lg:w-3/4">
        <div className="absolute inset-0 opacity-40 story-grid" />
        <img
          src="/globe.svg"
          alt=""
          className="pointer-events-none absolute -right-16 top-12 w-[420px] opacity-15"
        />
        <div className="relative z-10 flex h-full flex-col">
          <header className="story-header px-10 pt-10 pb-4">
            <p className="text-[11px] uppercase tracking-[0.4em] text-white/50">Instagram to Electrons</p>
            <h1 className="mt-3 text-3xl font-semibold text-white leading-tight">
              Identity online feels personal, but it rides the largest machine humanity has ever built.
            </h1>
            <p className="mt-3 text-sm text-white/60 leading-relaxed max-w-2xl">
              As you share a photo, the signal crosses protocols, hardware, and oceans. Each slide dives deeper into the
              stack.
            </p>
          </header>

          <div className="flex-1 min-h-0 flex">
            <div className="story-timeline">
              <div className="story-line" />
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => scrollToSlide(index)}
                  className={`story-dot ${activeSlide === index ? "is-active" : ""}`}
                  aria-label={`Go to ${slide.title}`}
                />
              ))}
            </div>
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="h-full w-full overflow-y-auto snap-y snap-mandatory"
            >
            <section className="story-slide snap-start">
              <div className="max-w-3xl">
                <p className="text-[11px] uppercase tracking-[0.4em] text-white/50">{slides[0].title}</p>
                <h1 className="mt-4 text-3xl font-semibold text-white leading-tight">
                  UI to encrypted payload, all in user space.
                </h1>
                <p className="mt-4 text-sm text-white/60 leading-relaxed">
                  When you press Share, the browser turns your image into bytes, builds an HTTP request, and encrypts
                  it with TLS. Every step happens inside the browser process before the OS ever sees a packet.
                </p>
              </div>

              <div className="mt-10 grid grid-cols-[1fr_1fr] gap-8">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <p className="text-xs uppercase tracking-[0.35em] text-white/40">Step 1 · JS heap</p>
                  <p className="mt-3 text-sm text-white/70 leading-relaxed">
                    JavaScript runs in the browser engine. The image is encoded to a string, then converted into a UTF-8
                    byte buffer.
                  </p>
                  <pre className="mt-4 rounded-xl border border-white/10 bg-black/70 p-4 text-[11px] text-amber-200 overflow-hidden">
                    {`const payload = JSON.stringify({
  caption: "identity",
  image: base64Data,
})

const bytes = new TextEncoder().encode(payload)`}
                  </pre>
                  <div className="mt-6 rounded-xl border border-white/10 bg-black/60 p-4">
                    <p className="text-[11px] text-white/40">Image bytes preview</p>
                    <p className="mt-2 font-mono text-[11px] text-emerald-200 break-all">
                      {isUploading || isComplete ? bytePreview || "No image selected" : "Press Share to build payload"}
                    </p>
                    <p className="mt-3 text-[11px] text-white/40">Approx size: {byteSizeLabel}</p>
                  </div>
                  {selectedImage && (
                    <div className="mt-5 flex items-center gap-4">
                      <img src={selectedImage} alt="Selected" className="h-20 w-20 rounded-xl object-cover" />
                      <div className="text-xs text-white/50">
                        <p>Status: {statusLabel}</p>
                        <p>Upload progress: {Math.round(syncedProgress)}%</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="rounded-2xl border border-white/10 bg-black/50 p-6">
                    <p className="text-xs uppercase tracking-[0.35em] text-white/40">Step 2 · HTTP request</p>
                    <p className="mt-3 text-sm text-white/70 leading-relaxed">
                      The browser networking stack assembles headers and body bytes for an HTTPS POST.
                    </p>
                    <pre className="mt-4 rounded-xl border border-white/10 bg-black/70 p-4 text-[11px] text-cyan-200 overflow-hidden">
                      {`POST /upload HTTP/1.1
Host: i.instagram.com
Content-Type: multipart/form-data; boundary=----9d7
Content-Length: ${byteSizeBytes}
User-Agent: Instagram/314.0

------9d7
Content-Disposition: form-data; name="media"; filename="identity.jpg"
Content-Type: image/jpeg

<byte stream…>`}
                    </pre>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                    <p className="text-xs uppercase tracking-[0.35em] text-white/40">Step 3 · TLS records</p>
                    <p className="mt-3 text-sm text-white/70 leading-relaxed">
                      TLS encrypts the HTTP bytes into records. Plaintext becomes encrypted payloads, still inside the
                      browser process.
                    </p>
                    <div className="mt-4 rounded-xl border border-white/10 bg-black/60 p-4">
                      <p className="text-[11px] text-white/40">Encrypted payload (preview)</p>
                      <p className="mt-2 font-mono text-[11px] text-purple-200 break-all">
                        17 03 03 00 9f 8b 41 7c 3e 2a 9a 51 6f d1 88 3c 1f 9d 6a 7b 0d 2f 4c 28 13 ...
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {slides.slice(1).map((slide) => (
              <section key={slide.id} className="story-slide snap-start">
                <div className="max-w-2xl">
                  <p className="text-[11px] uppercase tracking-[0.4em] text-white/50">{slide.title}</p>
                  <h2 className="mt-4 text-3xl font-semibold text-white leading-tight">{slide.subtitle}</h2>
                  <p className="mt-4 text-sm text-white/60 leading-relaxed">
                    This slide is queued up next. We will visualize how the payload is segmented, sequenced, and routed
                    across the globe.
                  </p>
                </div>
                <div className="mt-10 rounded-2xl border border-white/10 bg-black/40 p-8 text-sm text-white/50">
                  Coming soon.
                </div>
              </section>
            ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

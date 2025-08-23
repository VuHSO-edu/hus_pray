"use client"

import { useEffect, useRef } from "react"

declare global {
  interface Window {
    SmokeMachine: any
  }
}

interface SmokeEffectProps {
  isActive: boolean
}

export default function SmokeEffect({ isActive }: SmokeEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const smokeMachineRef = useRef<any>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!isActive) {
      // Cleanup when not active
      if (smokeMachineRef.current) {
        smokeMachineRef.current.stop()
        smokeMachineRef.current = null
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    const script = document.createElement("script")
    script.src = "/lib/smoke.js"
    script.onload = () => {
      if (window.SmokeMachine && canvasRef.current) {
        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d")

        if (ctx) {
          // Set canvas size
          canvas.width = window.innerWidth
          canvas.height = window.innerHeight

          // Create smoke machine with orange-ish color
          smokeMachineRef.current = new window.SmokeMachine(ctx, [255, 140, 0])

          // Start smoke effect
          smokeMachineRef.current.start()

          // Add smoke particles periodically around the temple area
          intervalRef.current = setInterval(() => {
            const centerX = canvas.width / 2
            const centerY = canvas.height * 0.4 // Around temple area

            // Add smoke particles with some randomness
            smokeMachineRef.current.addSmoke(
              centerX + (Math.random() - 0.5) * 100,
              centerY + (Math.random() - 0.5) * 50,
              Math.random() * 2 + 1,
            )
          }, 200)

          // Handle window resize
          const handleResize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
          }

          window.addEventListener("resize", handleResize)

          return () => {
            if (smokeMachineRef.current) {
              smokeMachineRef.current.stop()
            }
            if (intervalRef.current) {
              clearInterval(intervalRef.current)
            }
            window.removeEventListener("resize", handleResize)
          }
        }
      }
    }
    document.head.appendChild(script)

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [isActive]) // Added isActive to dependency array

  if (!isActive) {
    return null
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-10"
      style={{ background: "transparent" }}
    />
  )
}

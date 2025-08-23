"use client"

import { useEffect, useRef } from "react"

declare global {
  interface Window {
    Sakura: any
  }
}

interface SakuraEffectProps {
  isActive: boolean
}

export default function SakuraEffect({ isActive }: SakuraEffectProps) {
  const sakuraInstanceRef = useRef<any>(null)
  const scriptLoadedRef = useRef(false)

  useEffect(() => {
    if (!isActive) {
      // Stop and cleanup if not active
      if (sakuraInstanceRef.current) {
        try {
          sakuraInstanceRef.current.stop()
          console.log("[v0] Sakura stopped due to inactive state")
        } catch (error) {
          console.log("[v0] Sakura stop error:", error)
        }
        sakuraInstanceRef.current = null
      }

      const bodyElement = document.querySelector("body")
      if (bodyElement?.dataset.sakuraAnimId) {
        bodyElement.removeAttribute("data-sakura-anim-id")
      }
      return
    }

    const bodyElement = document.querySelector("body")
    if (bodyElement?.dataset.sakuraAnimId) {
      console.log("[v0] Sakura already running, skipping initialization")
      return
    }

    if (scriptLoadedRef.current) {
      return
    }

    if (window.Sakura && !sakuraInstanceRef.current) {
      try {
        sakuraInstanceRef.current = new window.Sakura("body", {
          className: "sakura",
          fallSpeed: 1,
          maxSize: 14,
          minSize: 10,
          delay: 300,
          gradientColorStart: "rgba(255, 183, 197, 0.9)",
          gradientColorEnd: "rgba(255, 197, 208, 0.9)",
          gradientColorDegree: 120,
        })
        sakuraInstanceRef.current.start()
        console.log("[v0] Sakura started successfully")
      } catch (error) {
        console.log("[v0] Sakura start error:", error)
      }
      return
    }

    // Load Sakura script dynamically
    const script = document.createElement("script")
    script.src = "/lib/sakura.js"
    script.onload = () => {
      scriptLoadedRef.current = true
      if (window.Sakura && !sakuraInstanceRef.current && isActive) {
        try {
          sakuraInstanceRef.current = new window.Sakura("body", {
            className: "sakura",
            fallSpeed: 1,
            maxSize: 14,
            minSize: 10,
            delay: 300,
            gradientColorStart: "rgba(255, 183, 197, 0.9)",
            gradientColorEnd: "rgba(255, 197, 208, 0.9)",
            gradientColorDegree: 120,
          })

          sakuraInstanceRef.current.start()
          console.log("[v0] Sakura loaded and started successfully")
        } catch (error) {
          console.log("[v0] Sakura initialization error:", error)
        }
      }
    }
    document.head.appendChild(script)

    return () => {
      if (sakuraInstanceRef.current) {
        try {
          sakuraInstanceRef.current.stop()
          console.log("[v0] Sakura stopped")
        } catch (error) {
          console.log("[v0] Sakura stop error:", error)
        }
        sakuraInstanceRef.current = null
      }

      const bodyElement = document.querySelector("body")
      if (bodyElement?.dataset.sakuraAnimId) {
        bodyElement.removeAttribute("data-sakura-anim-id")
      }

      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [isActive]) // Added isActive to dependency array

  return null
}

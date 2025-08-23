"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import SakuraEffect from "@/components/effects/sakura-effect"
import SmokeEffect from "@/components/effects/smoke-effect"

export default function PrayPage() {
  const [email, setEmail] = useState("")
  const [wish, setWish] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [showEffects, setShowEffects] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [showIncenseStick, setShowIncenseStick] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateEmail(email)) {
      setEmailError("Bạn chưa nhập thông tin để ước nguyện")
      return
    }

    if (email && wish) {
      setEmailError("")
      setShowEffects(true)
      setIsSubmitted(true)
      setShowSuccessMessage(true)
      setShowIncenseStick(true)

      if (audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play()

        const handleMusicEnd = () => {
          setIsSubmitted(false)
          setEmail("")
          setWish("")
          setShowEffects(false)
          setShowSuccessMessage(false)
          setShowIncenseStick(false)
          audioRef.current?.removeEventListener("ended", handleMusicEnd)
        }

        audioRef.current.addEventListener("ended", handleMusicEnd)
      }
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)

    if (emailError) {
      setEmailError("")
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <audio ref={audioRef} preload="auto" className="hidden">
        <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/backgound11%20%28mp3cut.net%29-jCixP7nt4Jiqb5x21RdWSAcCZX7r9n.mp3" type="audio/mpeg" />
      </audio>

      {showEffects && (
        <>
          <SakuraEffect isActive={showEffects} />
          <SmokeEffect isActive={showEffects} />
        </>
      )}

      {emailError && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl p-8 max-w-sm mx-4 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto border-2 border-orange-400 rounded-full flex items-center justify-center">
                <span className="text-orange-500 text-2xl font-bold">!</span>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-4">Kiểm tra thông tin</h3>

            <p className="text-gray-600 mb-6 text-sm leading-relaxed">{emailError}</p>

            <Button
              onClick={() => setEmailError("")}
              className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-2 rounded font-medium transition-colors duration-200"
            >
              OK
            </Button>
          </div>
        </div>
      )}

      <div className="flex justify-center pt-12 pb-8">
        <div className="relative">
          <img
            src="/temple-shrine-white-bg.png"
            alt="Traditional Temple Shrine with MIM MEDIA Logo"
            className="max-w-lg w-full h-auto drop-shadow-2xl"
            style={{ transform: "scale(1.02)" }}
          />
          {showIncenseStick && (
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full z-10"
              style={{ transform: "translate(calc(-48% + 39%), calc(-50% + 35px))" }}
            >
              <img
                src="/incense-stick.png"
                alt="Incense Stick"
                className="w-3 h-auto drop-shadow-lg animate-[dropDown_1s_ease-out_forwards]"
              />
            </div>
          )}
        </div>
      </div>

      {/*<div className="w-full h-2 bg-orange-500 mb-8"></div>*/}
      <div className="px-[300px]">
        <div className="w-full h-2 bg-orange-500 mb-8"></div>
      </div>

      <div className="max-w-md mx-auto px-4 pb-12">
        {isSubmitted ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🙏</div>
            <h3 className="text-xl font-semibold text-orange-800 mb-2">Lời cầu nguyện đã được gửi!</h3>
            <p className="text-orange-600">Ước nguyện của bạn đã được tiếp nhận bởi thần linh</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                id="email"
                type="email"
                placeholder="Mail của bạn..."
                value={email}
                onChange={handleEmailChange}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 py-3 text-base"
                required
              />
            </div>

            <div>
              <Textarea
                id="wish"
                placeholder="Mong muốn của bạn..."
                value={wish}
                onChange={(e) => setWish(e.target.value)}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 min-h-[120px] resize-none text-base"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-auto px-8 bg-orange-500 hover:bg-blue-500 text-white font-semibold py-2 text-base shadow-lg hover:shadow-xl transition-all duration-200 rounded mx-auto block"
            >
              THẮP HƯƠNG
            </Button>



            {showSuccessMessage && (
              <div className="text-center mt-4 animate-pulse">
                <p className="text-green-600 font-medium text-base opacity-0 animate-[fadeInOut_3s_ease-in-out_infinite]">
                  {wish} của {email} đã được gửi đi
                </p>
              </div>
            )}
          </form>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInOut {
          0% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }
        
        @keyframes dropDown {
          0% { 
            transform: translateY(-100px);
            opacity: 0;
          }
          100% { 
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}

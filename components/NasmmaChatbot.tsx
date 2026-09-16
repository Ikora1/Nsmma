"use client"

import React, { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send, Sparkles, Loader2 } from "lucide-react"
import { ChatMessage } from "@/types/chat"

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    role: "assistant",
    content: "أهلاً بك في استوديو نَـسْـمَـة للزهور المخملية 🌷 كيف أقدر أساعدك اليوم في استفساراتك أو تنسيق باقة مخصصة؟",
  },
]

const QUICK_PROMPTS = [
  "أريد طلب باقة مخصصة 🎨",
  "هل الورد طبيعي وكم يدوم؟ 🌸",
  "كم يستغرق التوصيل لمحافظتي؟ 🚚",
  "كيف أتتبع طلبي؟ 📦",
]

export function NasmmaChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
      inputRef.current?.focus()
    }
  }, [isOpen, messages, isLoading])

  const handleSend = async (messageText?: string) => {
    const textToSend = (messageText || input).trim()
    if (!textToSend || isLoading) return

    const newMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: textToSend },
    ]

    setMessages(newMessages)
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      })

      const data = await response.json()
      const replyContent = data.reply || "أهلاً بك، تفضل بطرح استفسارك وسنكون سعداء بمساعدتك 🌷"

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: replyContent },
      ])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "نعتذر منك، حدث خطأ في الاتصال. يمكنك التواصل المباشر مع فريق نسمة عبر واتساب: https://wa.me/96890000000 🌷",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="محادثة مساعد نسمة الذكي"
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#EFD9E8] hover:bg-[#E5C6DD] text-[#5B1657] shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-white/80 cursor-pointer group"
        >
          <div className="relative">
            <MessageCircle className="w-7 h-7 text-[#5B1657] transition-transform group-hover:scale-110" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          dir="rtl"
          className="fixed inset-0 sm:inset-auto sm:bottom-24 sm:right-6 sm:w-[380px] sm:h-[600px] z-50 bg-white sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-[#F0E4EC] animate-in fade-in slide-in-from-bottom-5 duration-300"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#5B1657] to-[#7B2874] text-white px-5 py-4 flex items-center justify-between shrink-0 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center border border-white/20 text-lg">
                🌷
              </div>
              <div>
                <h3 className="font-bold text-base flex items-center gap-1.5 font-sans">
                  <span>نسمة 🌷</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                </h3>
                <p className="text-[11px] text-white/80 font-light flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                  <span>المساعد الذكي للزهور المخملية</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              aria-label="إغلاق المحادثة"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FCF8FA]/60 text-sm">
            {messages.map((msg, index) => {
              const isUser = msg.role === "user"
              return (
                <div
                  key={index}
                  className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[82%] px-4 py-3 rounded-2xl whitespace-pre-wrap break-words leading-relaxed text-xs sm:text-sm ${
                      isUser
                        ? "bg-[#5B1657] text-white rounded-br-none shadow-sm"
                        : "bg-neutral-100 text-neutral-800 rounded-bl-none border border-neutral-200/70 shadow-2xs"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              )
            })}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex items-start">
                <div className="bg-neutral-100 text-neutral-600 px-4 py-2.5 rounded-2xl rounded-bl-none border border-neutral-200/70 text-xs flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#5B1657]" />
                  <span className="font-medium">يكتب...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Chips (only if few messages) */}
          {messages.length <= 3 && !isLoading && (
            <div className="px-3 py-2 bg-white border-t border-neutral-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
              {QUICK_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSend(prompt)}
                  className="shrink-0 bg-[#EFD9E8]/40 hover:bg-[#EFD9E8] text-[#5B1657] text-[11px] font-medium px-2.5 py-1 rounded-full border border-[#EFD9E8] transition-all cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input & Send Area */}
          <div className="p-3 bg-white border-t border-[#F0E4EC] shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="اكتب استفسارك أو طلبك المخصص..."
                className="flex-1 bg-neutral-50 border border-neutral-200 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-[#5B1657] focus:bg-white transition-all text-right"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                aria-label="إرسال الرسالة"
                className="w-10 h-10 rounded-2xl bg-[#5B1657] hover:bg-[#7B2874] text-white flex items-center justify-center disabled:opacity-40 disabled:hover:bg-[#5B1657] transition-all cursor-pointer shrink-0 shadow-sm"
              >
                <Send className="w-4 h-4 rotate-180" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
export default NasmmaChatbot

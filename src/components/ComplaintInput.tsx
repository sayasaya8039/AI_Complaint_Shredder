import { useState } from 'react'
import { Mic, MicOff, Send, Loader2 } from 'lucide-react'
import { useSpeechRecognition } from '../hooks/useSpeechRecognition'

interface ComplaintInputProps {
  onSubmit: (complaint: string) => void
  isProcessing: boolean
}

export function ComplaintInput({ onSubmit, isProcessing }: ComplaintInputProps) {
  const [text, setText] = useState('')
  const { isListening, transcript, startListening, stopListening, isSupported } = useSpeechRecognition()

  const displayText = isListening ? transcript : text

  const handleSubmit = () => {
    const complaint = displayText.trim()
    if (complaint) {
      onSubmit(complaint)
      setText('')
    }
  }

  const toggleVoice = () => {
    if (isListening) {
      stopListening()
      setText(transcript)
    } else {
      startListening()
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-slate-700/50">
        <label className="block text-slate-300 text-sm font-medium mb-3">
          今日あった嫌なこと、愚痴、不満を吐き出してください
        </label>

        <div className="relative">
          <textarea
            value={displayText}
            onChange={(e) => setText(e.target.value)}
            placeholder="今日、上司に理不尽なことを言われて..."
            className="w-full h-40 p-4 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            disabled={isListening || isProcessing}
          />

          {isListening && (
            <div className="absolute top-4 right-4 flex items-center gap-2 text-red-400">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm">録音中...</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-3">
            {isSupported && (
              <button
                onClick={toggleVoice}
                disabled={isProcessing}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  isListening
                    ? 'bg-red-500/20 text-red-400 border border-red-500/50'
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 border border-slate-600'
                }`}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                <span className="text-sm">{isListening ? '停止' : '音声入力'}</span>
              </button>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={!displayText.trim() || isProcessing}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium rounded-xl hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-500/25"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>処理中...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>愚痴を吐き出す</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

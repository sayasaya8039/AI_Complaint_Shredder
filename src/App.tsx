import { useState, useCallback } from 'react'
import { Settings } from 'lucide-react'
import { Header } from './components/Header'
import { ComplaintInput } from './components/ComplaintInput'
import { AIResponse } from './components/AIResponse'
import { ShredderAnimation } from './components/ShredderAnimation'
import { SettingsModal } from './components/SettingsModal'
import { getEmpathyResponse } from './lib/gemini'
import type { AppPhase } from './types'

function App() {
  const [phase, setPhase] = useState<AppPhase>('input')
  const [complaint, setComplaint] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('gemini_api_key') || ''
  })

  const handleSubmit = useCallback(async (text: string) => {
    setComplaint(text)
    setPhase('responding')

    try {
      const response = await getEmpathyResponse(text, apiKey)
      setAiResponse(response)
      setPhase('responding')
    } catch (error) {
      console.error('Error getting AI response:', error)
      setAiResponse('エラーが発生しました。もう一度お試しください。')
      setPhase('responding')
    }
  }, [apiKey])

  const handleShred = useCallback(() => {
    setPhase('shredding')
  }, [])

  const handleShredComplete = useCallback(() => {
    setPhase('complete')
    setTimeout(() => {
      setPhase('input')
      setComplaint('')
      setAiResponse('')
    }, 3000)
  }, [])

  const handleSaveApiKey = useCallback((key: string) => {
    setApiKey(key)
    localStorage.setItem('gemini_api_key', key)
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <button
        onClick={() => setIsSettingsOpen(true)}
        className="fixed top-4 right-4 z-30 p-3 bg-slate-800/80 backdrop-blur-sm rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
      >
        <Settings className="w-5 h-5" />
      </button>

      <Header />

      <main className="flex-1 flex items-center justify-center p-4">
        {(phase === 'input' || phase === 'listening') && (
          <ComplaintInput
            onSubmit={handleSubmit}
            isProcessing={phase === 'listening'}
          />
        )}

        {phase === 'responding' && aiResponse && (
          <AIResponse
            response={aiResponse}
            onShred={handleShred}
          />
        )}

        {phase === 'complete' && (
          <div className="text-center animate-fade-in">
            <div className="text-6xl mb-4">🌟</div>
            <h2 className="text-2xl font-bold text-white mb-2">
              お疲れ様でした！
            </h2>
            <p className="text-slate-400">
              また愚痴があればいつでもどうぞ
            </p>
          </div>
        )}
      </main>

      <ShredderAnimation
        text={complaint}
        isShredding={phase === 'shredding'}
        onComplete={handleShredComplete}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
      />

      <footer className="py-4 text-center text-slate-500 text-sm">
        <p>愚痴データはサーバーに保存されません 🔒</p>
      </footer>
    </div>
  )
}

export default App

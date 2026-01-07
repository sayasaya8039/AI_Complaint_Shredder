import { useState, useCallback } from 'react'
import { Settings } from 'lucide-react'
import { Header } from './components/Header'
import { ComplaintInput } from './components/ComplaintInput'
import { AIResponse } from './components/AIResponse'
import { ShredderAnimation } from './components/ShredderAnimation'
import { SettingsModal } from './components/SettingsModal'
import { getEmpathyResponse, type ProviderType, type ApiKeys } from './lib/providers'
import type { AppPhase } from './types'

function App() {
  const [phase, setPhase] = useState<AppPhase>('input')
  const [complaint, setComplaint] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [usedProvider, setUsedProvider] = useState<string>('')
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const [selectedProvider, setSelectedProvider] = useState<ProviderType>(() => {
    return (localStorage.getItem('selected_provider') as ProviderType) || 'gemini'
  })

  const [apiKeys, setApiKeys] = useState<ApiKeys>(() => ({
    gemini: localStorage.getItem('api_key_gemini') || '',
    openai: localStorage.getItem('api_key_openai') || '',
    claude: localStorage.getItem('api_key_claude') || '',
  }))

  const handleSubmit = useCallback(async (text: string) => {
    setComplaint(text)
    setPhase('responding')

    try {
      const result = await getEmpathyResponse(text, selectedProvider, apiKeys)
      setAiResponse(result.response)
      setUsedProvider(result.provider)
      setPhase('responding')
    } catch (error) {
      console.error('Error getting AI response:', error)
      setAiResponse('エラーが発生しました。もう一度お試しください。')
      setUsedProvider('error')
      setPhase('responding')
    }
  }, [apiKeys, selectedProvider])

  const handleShred = useCallback(() => {
    setPhase('shredding')
  }, [])

  const handleShredComplete = useCallback(() => {
    setPhase('complete')
    setTimeout(() => {
      setPhase('input')
      setComplaint('')
      setAiResponse('')
      setUsedProvider('')
    }, 3000)
  }, [])

  const handleSaveApiKeys = useCallback((keys: ApiKeys) => {
    setApiKeys(keys)
    localStorage.setItem('api_key_gemini', keys.gemini || '')
    localStorage.setItem('api_key_openai', keys.openai || '')
    localStorage.setItem('api_key_claude', keys.claude || '')
  }, [])

  const handleSelectProvider = useCallback((provider: ProviderType) => {
    setSelectedProvider(provider)
    localStorage.setItem('selected_provider', provider)
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
            provider={usedProvider}
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
        apiKeys={apiKeys}
        onSaveApiKeys={handleSaveApiKeys}
        selectedProvider={selectedProvider}
        onSelectProvider={handleSelectProvider}
      />

      <footer className="py-4 text-center text-slate-500 text-sm">
        <p>愚痴データはサーバーに保存されません 🔒</p>
        <p className="text-xs mt-1">（クライアント側で処理、ローカルストレージに一時保存のみ）</p>
      </footer>
    </div>
  )
}

export default App

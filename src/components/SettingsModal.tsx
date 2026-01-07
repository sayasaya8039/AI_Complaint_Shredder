import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Key, Save, Bot } from 'lucide-react'
import type { ProviderType } from '../lib/api'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  apiKey: string
  onSaveApiKey: (key: string) => void
  availableProviders: ProviderType[]
  selectedProvider: ProviderType
  onSelectProvider: (provider: ProviderType) => void
}

const providerInfo: Record<ProviderType, { name: string; description: string }> = {
  gemini: { name: 'Gemini', description: 'Google Gemini 2.0 Flash' },
  openai: { name: 'OpenAI', description: 'GPT-4o' },
  claude: { name: 'Claude', description: 'Claude Sonnet 4' },
}

export function SettingsModal({
  isOpen,
  onClose,
  apiKey,
  onSaveApiKey,
  availableProviders,
  selectedProvider,
  onSelectProvider,
}: SettingsModalProps) {
  const [inputKey, setInputKey] = useState(apiKey)

  const handleSave = () => {
    onSaveApiKey(inputKey)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-md mx-auto bg-slate-800 rounded-2xl shadow-2xl border border-slate-700"
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <h2 className="text-lg font-semibold text-white">設定</h2>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* AIプロバイダー選択 */}
              {availableProviders.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">
                    <Bot className="w-4 h-4 inline mr-2" />
                    AIプロバイダー
                  </label>
                  <div className="space-y-2">
                    {availableProviders.map((provider) => (
                      <button
                        key={provider}
                        onClick={() => onSelectProvider(provider)}
                        className={`w-full p-3 rounded-lg border text-left transition-all ${
                          selectedProvider === provider
                            ? 'bg-indigo-500/20 border-indigo-500 text-white'
                            : 'bg-slate-900 border-slate-600 text-slate-300 hover:border-slate-500'
                        }`}
                      >
                        <div className="font-medium">{providerInfo[provider].name}</div>
                        <div className="text-xs text-slate-400">{providerInfo[provider].description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* クライアントサイドAPIキー */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <Key className="w-4 h-4 inline mr-2" />
                  Gemini API Key（フォールバック用）
                </label>
                <input
                  type="password"
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full p-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p className="mt-2 text-xs text-slate-400">
                  サーバーAPIが利用できない場合のフォールバック用です。
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:underline ml-1"
                  >
                    APIキーを取得
                  </a>
                </p>
              </div>

              <button
                onClick={handleSave}
                className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Save className="w-5 h-5" />
                保存
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

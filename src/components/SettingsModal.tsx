import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Key, Save, Bot, ExternalLink } from 'lucide-react'
import type { ProviderType, ApiKeys } from '../lib/providers'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  apiKeys: ApiKeys
  onSaveApiKeys: (keys: ApiKeys) => void
  selectedProvider: ProviderType
  onSelectProvider: (provider: ProviderType) => void
}

const providerConfig: Record<ProviderType, {
  name: string
  description: string
  placeholder: string
  helpUrl: string
  helpText: string
}> = {
  gemini: {
    name: 'Gemini',
    description: 'Google Gemini 2.0 Flash',
    placeholder: 'AIzaSy...',
    helpUrl: 'https://aistudio.google.com/app/apikey',
    helpText: 'Google AI Studio',
  },
  openai: {
    name: 'OpenAI',
    description: 'GPT-4o',
    placeholder: 'sk-...',
    helpUrl: 'https://platform.openai.com/api-keys',
    helpText: 'OpenAI Platform',
  },
  claude: {
    name: 'Claude',
    description: 'Claude Sonnet 4',
    placeholder: 'sk-ant-...',
    helpUrl: 'https://console.anthropic.com/settings/keys',
    helpText: 'Anthropic Console',
  },
}

const allProviders: ProviderType[] = ['gemini', 'openai', 'claude']

export function SettingsModal({
  isOpen,
  onClose,
  apiKeys,
  onSaveApiKeys,
  selectedProvider,
  onSelectProvider,
}: SettingsModalProps) {
  const [inputKeys, setInputKeys] = useState<ApiKeys>(apiKeys)

  useEffect(() => {
    setInputKeys(apiKeys)
  }, [apiKeys])

  const handleSave = () => {
    onSaveApiKeys(inputKeys)
    onClose()
  }

  const handleKeyChange = (provider: ProviderType, value: string) => {
    setInputKeys(prev => ({ ...prev, [provider]: value }))
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
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-md mx-auto bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-700 sticky top-0 bg-slate-800">
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
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  <Bot className="w-4 h-4 inline mr-2" />
                  使用するAI
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {allProviders.map((provider) => (
                    <button
                      key={provider}
                      onClick={() => onSelectProvider(provider)}
                      className={`p-3 rounded-lg border text-center transition-all ${
                        selectedProvider === provider
                          ? 'bg-indigo-500/20 border-indigo-500 text-white'
                          : 'bg-slate-900 border-slate-600 text-slate-400 hover:border-slate-500'
                      }`}
                    >
                      <div className="font-medium text-sm">{providerConfig[provider].name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* APIキー入力 */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-300">
                  <Key className="w-4 h-4 inline mr-2" />
                  APIキー
                </label>

                {allProviders.map((provider) => {
                  const config = providerConfig[provider]
                  const isSelected = selectedProvider === provider
                  const hasKey = !!inputKeys[provider]

                  return (
                    <div
                      key={provider}
                      className={`p-3 rounded-lg border transition-all ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-500/5'
                          : 'border-slate-700 bg-slate-900/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                          {config.name}
                          {hasKey && <span className="ml-2 text-green-400 text-xs">✓ 設定済み</span>}
                        </span>
                        <a
                          href={config.helpUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-indigo-400 hover:underline flex items-center gap-1"
                        >
                          {config.helpText}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <input
                        type="password"
                        value={inputKeys[provider] || ''}
                        onChange={(e) => handleKeyChange(provider, e.target.value)}
                        placeholder={config.placeholder}
                        className="w-full p-2 bg-slate-900 border border-slate-600 rounded text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  )
                })}

                <p className="text-xs text-slate-500">
                  APIキーはブラウザのローカルストレージに保存され、サーバーには送信されません。
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

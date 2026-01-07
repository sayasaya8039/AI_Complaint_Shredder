import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Key, Save } from 'lucide-react'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  apiKey: string
  onSaveApiKey: (key: string) => void
}

export function SettingsModal({ isOpen, onClose, apiKey, onSaveApiKey }: SettingsModalProps) {
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

            <div className="p-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <Key className="w-4 h-4 inline mr-2" />
                Gemini API Key
              </label>
              <input
                type="password"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full p-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="mt-2 text-xs text-slate-400">
                APIキーがない場合はデモモードで動作します。
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:underline ml-1"
                >
                  APIキーを取得
                </a>
              </p>

              <button
                onClick={handleSave}
                className="w-full mt-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-colors"
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

import { motion } from 'framer-motion'
import { Trash2 } from 'lucide-react'

interface AIResponseProps {
  response: string
  provider?: string
  onShred: () => void
}

const providerLabel: Record<string, string> = {
  gemini: 'Gemini',
  openai: 'OpenAI',
  claude: 'Claude',
  demo: 'デモ',
}

export function AIResponse({ response, provider, onShred }: AIResponseProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl"
    >
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 shadow-xl border border-slate-700">
        {provider && (
          <div className="mb-4 flex justify-end">
            <span className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-400">
              {providerLabel[provider] || provider}
            </span>
          </div>
        )}

        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl flex-shrink-0">
            🤖
          </div>
          <div className="flex-1">
            <p className="text-slate-300 leading-relaxed whitespace-pre-line">
              {response}
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onShred}
          className="w-full py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 rounded-xl text-white font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-lg"
        >
          <Trash2 className="w-6 h-6" />
          シュレッド！
        </motion.button>
      </div>
    </motion.div>
  )
}

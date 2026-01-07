import { motion } from 'framer-motion'
import { Bot } from 'lucide-react'

interface AIResponseProps {
  response: string
  onShred: () => void
}

export function AIResponse({ response, onShred }: AIResponseProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto p-4"
    >
      <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-indigo-500/30">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center flex-shrink-0">
            <Bot className="w-6 h-6 text-indigo-400" />
          </div>
          <div className="flex-1">
            <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">
              {response}
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onShred}
          className="w-full mt-6 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold text-lg rounded-xl shadow-lg shadow-red-500/25 hover:from-red-600 hover:to-orange-600 transition-all"
        >
          🗑️ 嫌な記憶をシュレッダーで粉砕する！
        </motion.button>
      </div>
    </motion.div>
  )
}

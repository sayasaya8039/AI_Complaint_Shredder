import { Trash2 } from 'lucide-react'
import { APP_NAME, APP_VERSION } from '../lib/constants'

export function Header() {
  return (
    <header className="w-full py-6 px-4 text-center">
      <div className="flex items-center justify-center gap-3 mb-2">
        <Trash2 className="w-10 h-10 text-indigo-400" />
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          {APP_NAME}
        </h1>
      </div>
      <p className="text-slate-400 text-sm">
        愚痴を吐き出して、スッキリしよう！
      </p>
      <span className="text-xs text-slate-500 mt-1 block">v{APP_VERSION}</span>
    </header>
  )
}

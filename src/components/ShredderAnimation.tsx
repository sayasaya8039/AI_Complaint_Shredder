import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ShredParticle {
  id: number
  x: number
  y: number
  rotation: number
  color: string
  width: number
  height: number
  delay: number
}

interface ShredderAnimationProps {
  text: string
  isShredding: boolean
  onComplete: () => void
}

export function ShredderAnimation({ text, isShredding, onComplete }: ShredderAnimationProps) {
  const [particles, setParticles] = useState<ShredParticle[]>([])
  const [phase, setPhase] = useState<'paper' | 'shredding' | 'done'>('paper')

  const generateParticles = useCallback(() => {
    const colors = ['#f8fafc', '#e2e8f0', '#cbd5e1', '#94a3b8', '#64748b']
    const newParticles: ShredParticle[] = []

    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 300 - 150,
        y: 0,
        rotation: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)],
        width: Math.random() * 20 + 5,
        height: Math.random() * 60 + 20,
        delay: Math.random() * 0.5,
      })
    }
    return newParticles
  }, [])

  useEffect(() => {
    if (isShredding) {
      setPhase('paper')

      // 紙が落ちていく演出
      setTimeout(() => {
        setPhase('shredding')
        setParticles(generateParticles())
      }, 1000)

      // 完了
      setTimeout(() => {
        setPhase('done')
        onComplete()
      }, 4000)
    }
  }, [isShredding, generateParticles, onComplete])

  if (!isShredding && phase === 'done') {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg h-[600px] flex flex-col items-center">
        {/* シュレッダー本体 */}
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative z-20"
        >
          <div className="w-80 h-24 bg-gradient-to-b from-slate-600 to-slate-700 rounded-t-xl shadow-2xl flex items-center justify-center">
            <div className="text-slate-300 font-bold text-lg">🗑️ シュレッダー</div>
          </div>
          {/* 投入口 */}
          <div className="w-72 h-4 mx-auto bg-slate-900 rounded-b" />
        </motion.div>

        {/* 紙（愚痴テキスト） */}
        <AnimatePresence>
          {phase === 'paper' && (
            <motion.div
              initial={{ y: -200, opacity: 1 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0, scaleY: 0.1 }}
              transition={{ duration: 1, ease: 'easeIn' }}
              className="absolute top-24 z-10"
            >
              <div className="w-64 bg-white rounded-lg shadow-xl p-4 transform -rotate-2">
                <p className="text-slate-800 text-sm leading-relaxed line-clamp-6">
                  {text}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* シュレッダー下部（排出口） */}
        <div className="w-80 h-40 bg-gradient-to-b from-slate-700 to-slate-800 rounded-b-xl mt-0 relative overflow-hidden">
          {/* パーティクル */}
          <AnimatePresence>
            {phase === 'shredding' && particles.map((particle) => (
              <motion.div
                key={particle.id}
                initial={{
                  x: particle.x + 140,
                  y: 0,
                  rotate: 0,
                  opacity: 1
                }}
                animate={{
                  x: particle.x + 140 + (Math.random() - 0.5) * 100,
                  y: 400,
                  rotate: particle.rotation + 720,
                  opacity: 0
                }}
                transition={{
                  duration: 2 + Math.random(),
                  delay: particle.delay,
                  ease: 'easeIn'
                }}
                style={{
                  width: particle.width,
                  height: particle.height,
                  backgroundColor: particle.color,
                }}
                className="absolute top-0 rounded-sm shadow"
              />
            ))}
          </AnimatePresence>
        </div>

        {/* 完了メッセージ */}
        <AnimatePresence>
          {phase === 'done' && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="text-center">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-6xl mb-4"
                >
                  ✨
                </motion.div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  スッキリ！
                </h2>
                <p className="text-slate-300">
                  嫌な記憶は粉砕されました
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

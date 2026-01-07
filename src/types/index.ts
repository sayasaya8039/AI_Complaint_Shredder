export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export type AppPhase = 'input' | 'listening' | 'responding' | 'shredding' | 'complete'

export interface ShredParticle {
  id: number
  x: number
  y: number
  rotation: number
  color: string
  delay: number
}

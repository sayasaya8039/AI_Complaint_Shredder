import type { AIProvider, AnalysisResult } from './types'
import { SYSTEM_PROMPT } from './types'

export class ClaudeProvider implements AIProvider {
  name = 'claude' as const

  constructor(private apiKey: string) {}

  async analyze(complaint: string): Promise<AnalysisResult> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': this.apiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: SYSTEM_PROMPT + '\n\nYou must respond in valid JSON format only.',
        messages: [
          { role: 'user', content: complaint },
        ],
      }),
    })

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status}`)
    }

    const data = await response.json() as {
      content: Array<{ type: string; text: string }>
    }

    const text = data.content[0].text
    // Extract JSON - remove markdown code blocks if present
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Failed to parse Claude response as JSON')
    }

    return JSON.parse(jsonMatch[0]) as AnalysisResult
  }
}

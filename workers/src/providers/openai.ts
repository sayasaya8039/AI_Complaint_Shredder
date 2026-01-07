import type { AIProvider, AnalysisResult } from './types'
import { SYSTEM_PROMPT } from './types'

export class OpenAIProvider implements AIProvider {
  name = 'openai' as const
  
  constructor(private apiKey: string) {}

  async analyze(complaint: string): Promise<AnalysisResult> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: complaint },
        ],
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json() as {
      choices: Array<{ message: { content: string } }>
    }
    
    return JSON.parse(data.choices[0].message.content) as AnalysisResult
  }
}

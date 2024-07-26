import { OpenAI } from 'openai';
import { BaseChatLLMClient } from './llmClient';

type OpenAIModel = 'gpt-4o' | 'gpt-4o-mini';
type OpenAIChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export class OpenAIClient extends BaseChatLLMClient {
  private openai: OpenAI;
  private model?: OpenAIModel;

  constructor(params: {
    apiKey?: string;
    model?: OpenAIModel;
    systemPrompt?: string;
  }) {
    const { apiKey, model, systemPrompt } = params;

    const openAiApiKey = apiKey ?? process.env.OPENAI_API_KEY;
    if (!openAiApiKey) {
      throw new Error('OpenAI API key is required');
    }

    super(systemPrompt);

    this.openai = new OpenAI({
      apiKey: openAiApiKey,
    });
    this.model = model;
  }

  protected fromResponse(response: unknown): string {
    if (
      response != null &&
      typeof response === 'object' &&
      'choices' in response &&
      Array.isArray(response.choices) &&
      response.choices.length > 0
    ) {
      const content = response.choices[0]?.message?.content;
      if (content != null) {
        return content;
      }
    }
    return '';
  }

  protected async fetchResponse(prompt: string): Promise<unknown> {
    const messages: OpenAIChatMessage[] = [];

    if (this.context.systemPrompt) {
      messages.push({ role: 'system', content: this.context.systemPrompt });
    }

    messages.push(...this.context.histories);
    messages.push({ role: 'user', content: prompt });

    return await this.openai.chat.completions.create({
      model: this.model ?? 'gpt-4o',
      messages: messages,
      stream: false,
    });
  }
}

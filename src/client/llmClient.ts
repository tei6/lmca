type ChatRole = 'user' | 'assistant';

export interface LLMClient {
  chat(prompt: string): Promise<string>;
  clear(): void;
}

export interface Message {
  role: ChatRole;
  content: string;
}

export interface ChatContext {
  systemPrompt?: string;
  histories: Message[];
}

export abstract class BaseChatLLMClient {
  protected context: ChatContext;

  constructor(systemPrompt?: string) {
    this.context = {
      systemPrompt: systemPrompt,
      histories: [],
    };
  }

  protected appendHistory(question: string, answer: string): void {
    this.context.histories.push({
      role: 'user',
      content: question,
    });
    this.context.histories.push({
      role: 'assistant',
      content: answer,
    });
  }

  protected abstract fromResponse(response: unknown): string;

  protected abstract fetchResponse(prompt: string): Promise<unknown>;

  async chat(prompt: string): Promise<string> {
    const response = await this.fetchResponse(prompt);
    const answer = this.fromResponse(response);
    if (!answer) {
      console.warn(`No answer from the model. question: ${prompt}`);
      return '';
    }
    this.appendHistory(prompt, answer);
    return answer;
  }

  clear(): void {
    this.context.histories = [];
  }
}

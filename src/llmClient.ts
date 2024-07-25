type ChatRole = 'system' | 'user' | 'assistant';

export interface LLMClient {
  chat(prompt: string): Promise<string>;
  clear(): void;
}

export interface Message {
  role: ChatRole;
  content: string;
}

export abstract class BaseChatLLMClient {
  protected messages: Message[] = [];

  constructor(systemPrompt?: string) {
    if (systemPrompt) {
      this.messages = [{ role: 'system', content: systemPrompt }];
    }
  }

  protected appendHistory(question: string, answer: string): void {
    this.messages.push({ role: 'user', content: question });
    this.messages.push({ role: 'assistant', content: answer });
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
    this.messages = this.messages.filter(
      (message) => message.role === 'system'
    );
  }
}

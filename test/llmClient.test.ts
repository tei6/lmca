import { BaseChatLLMClient } from '../src/client/llmClient';

class MockLLMClient extends BaseChatLLMClient {
  fromResponse(response: unknown): string {
    return typeof response === 'string' ? response : '';
  }

  fetchResponse(prompt: string): Promise<string> {
    return Promise.resolve(`response to: ${prompt}`);
  }
}

describe('BaseChatLLMClient', () => {
  let client: MockLLMClient;

  beforeEach(() => {
    client = new MockLLMClient();
  });

  describe('constructor', () => {
    it('should initialize context.systemPrompt if provided', () => {
      const clientWithSystemPrompt = new MockLLMClient('Hello System');
      expect(clientWithSystemPrompt['context'].systemPrompt).toEqual(
        'Hello System'
      );
    });

    it('should initialize context.histories as an empty array if no system prompt is provided', () => {
      expect(client['context'].histories).toEqual([]);
    });
  });

  describe('chat', () => {
    it('should fetch response and append to history', async () => {
      const prompt = 'What is the weather?';
      const expectedAnswer = 'response to: What is the weather?';

      const response = await client.chat(prompt);

      expect(response).toBe(expectedAnswer);
      expect(client['context'].histories).toEqual([
        { role: 'user', content: prompt },
        { role: 'assistant', content: expectedAnswer },
      ]);
    });
  });

  describe('clear', () => {
    it('should clear all conversation histories', () => {
      client = new MockLLMClient('Hello System');
      client['context'].histories.push(
        { role: 'user', content: 'User message' },
        { role: 'assistant', content: 'Assistant message' }
      );

      client.clear();

      expect(client['context'].histories).toEqual([]);
      expect(client['context'].systemPrompt).toEqual('Hello System');
    });

    it('should clear all messages if no system prompt is present', () => {
      client['context'].histories.push(
        { role: 'user', content: 'User message' },
        { role: 'assistant', content: 'Assistant message' }
      );

      client.clear();

      expect(client['context'].histories).toEqual([]);
      expect(client['context'].systemPrompt).toBeUndefined();
    });
  });

  describe('appendHistory', () => {
    it('should append user question and assistant answer to the history', () => {
      const question = 'What is your name?';
      const answer = 'I am a bot';

      client['appendHistory'](question, answer);

      expect(client['context'].histories).toEqual([
        { role: 'user', content: question },
        { role: 'assistant', content: answer },
      ]);
    });
  });
});

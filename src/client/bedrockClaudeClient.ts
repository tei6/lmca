import AnthropicBedrock from '@anthropic-ai/bedrock-sdk';
import { BaseChatLLMClient } from './llmClient';

// https://docs.anthropic.com/en/api/claude-on-amazon-bedrock

export class AnthropicBedrockClient extends BaseChatLLMClient {
  private client: AnthropicBedrock;

  constructor(
    systemPrompt?: string,
    awsConfig?: {
      accessKey: string;
      secretKey: string;
      sessionToken?: string;
      region?: string;
    }
  ) {
    super(systemPrompt);
    this.client = new AnthropicBedrock({
      awsAccessKey: awsConfig?.accessKey || process.env.AWS_ACCESS_KEY_ID,
      awsSecretKey: awsConfig?.secretKey || process.env.AWS_SECRET_ACCESS_KEY,
      awsSessionToken: awsConfig?.sessionToken,
      awsRegion: awsConfig?.region || process.env.AWS_REGION || 'us-east-1',
    });
  }

  protected async fetchResponse(prompt: string): Promise<unknown> {
    const message = await this.client.messages.create({
      model: 'anthropic.claude-3-5-sonnet-20240620-v1:0',
      max_tokens: 256,
      system: this.context.systemPrompt,
      messages: [
        ...this.context.histories.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        { role: 'user', content: prompt },
      ],
    });
    return message;
  }

  protected fromResponse(response: unknown): string {
    if (response && typeof response === 'object' && 'content' in response) {
      return response.content as string;
    }
    return '';
  }
}

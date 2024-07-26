import dedent from 'dedent';
import { readFileOrEmpty, writeToFile } from '../util/file';
import { BaseChatLLMClient } from '../client/llmClient';

export async function fillCode(
  clientCreator: (systemPrompt: string) => BaseChatLLMClient,
  srcPath: string,
  description: string
): Promise<boolean> {
  const srcContent = await readFileOrEmpty(srcPath);

  if (!srcContent) {
    throw new Error(`Source file not found: ${srcPath}`);
  }

  const systemPrompt = dedent(`
    As an expert in content generation, follow the user's instructions to fill in the content within <fill></fill> tags.
    
    The user will provide instructions in the following format:
    - description tag: This provides instructions about the context or specific information to be considered for content generation.
    
    Below is an example of the instructions provided by the user:
    \`\`\`
    <description>
    Provide a summary for the article about AI advancements.
    </description>

    <src>
    <fill></fill>
    </src>
    \`\`\`

    Output only the content to be filled within the <fill></fill> tags. 
    DO NOT include the \`\`\` that indicates the start and end of a code block.
  `);

  const client = clientCreator(systemPrompt);

  const contentString = dedent(`
    <description>
    ${description}
    </description>

    <src>
    ${srcContent}
    </src>
  `);

  return client
    .chat(contentString)
    .then(async (filledContent) => {
      const updatedContent = srcContent.replace(
        /<fill>(.*?)<\/fill>/gs,
        `<fill>${filledContent}</fill>`
      );
      try {
        await writeToFile(srcPath, updatedContent);
        return true;
      } catch (error) {
        console.error('Error writing to file:', error);
        return false;
      }
    })
    .catch((error) => {
      console.error('Error generating fill content:', error);
      return false;
    });
}

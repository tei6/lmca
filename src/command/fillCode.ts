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
    As an expert in content generation, follow the user's instructions to fill in the content within /* fill start */ and /* fill end */ comments.
    
    The user will provide instructions in the following format:
    - description tag: This provides instructions about the context or specific information to be considered for content generation.
    
    Below is an example of the instructions provided by the user:
    \`\`\`
    <description>
    Provide a summary for the article about AI advancements.
    </description>

    <src>
    /* fill start */
    /* fill end */
    </src>
    \`\`\`

    Output only the content to be filled between the /* fill start */ and /* fill end */ comments. 
    DO NOT include the /* fill start */ and /* fill end */ comments themselves.
    Only include the necessary code or text that needs to be inserted.
    Do not include any additional comments, explanations, or code block indicators such as \`\`\`.
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
        /\/\* fill start \*\/(.*?)\/\* fill end \*\//gs,
        `/* fill start */\n${filledContent}\n/* fill end */`
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

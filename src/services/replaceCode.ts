import dedent from 'dedent';
import { BaseChatLLMClient } from '../client/llmClient';
import { FileHandler } from '../util/file';

export async function replaceCode(
  clientCreator: (systemPrompt: string) => BaseChatLLMClient,
  fileHandler: FileHandler,
  srcPath: string,
  description: string
): Promise<boolean> {
  const srcContent = await fileHandler.read(srcPath);

  const systemPrompt = dedent(`
    As an expert software engineer, follow the user's instructions to rewrite the provided code.
    The user will provide instructions in the following format. Here, "tags" refer to XML-style tags.
    - description tag: This provides instructions about the changes to be made to the code.
    - src tag: This contains the code that needs to be rewritten. The path attribute specifies the path to the code that requires rewriting.

    Below is an example of the instructions provided by the user:
    \`\`\`
    <description>
    Refactor the function to use async/await instead of promises.
    </description>

    <src path="/home/foo/src/bar.ts">
    function bar(x: string): Promise<boolean> {
      return new Promise((resolve, reject) => {
        if (x === 'baz') {
          resolve(true);
        } else {
          reject(false);
        }
      });
    }
    </src>
    \`\`\`

    Output only the rewritten code. Do not output any other content. Also,
    DO NOT include the \`\`\` that indicates the start and end of a code block.
  `);

  const client = clientCreator(systemPrompt);

  const contentString = dedent(`
    <description>
    ${description}
    </description>

    <src path=${srcPath}>
    ${srcContent}
    </src>
  `);

  try {
    const newCode = await client.chat(contentString);
    await fileHandler.write(srcPath, newCode);
    return true;
  } catch (error) {
    console.error('Error writing new code to file:', error);
    return false;
  }
}

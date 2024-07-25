import dedent from 'dedent';
import { OpenAIClient } from './openaiClient';
import { readFileOrEmpty, writeToFile } from './util/file';

export async function generateTestCode(
  srcPath: string,
  testPath: string,
  description?: string
): Promise<boolean> {
  const srcContentPromise = readFileOrEmpty(srcPath);
  const testContentPromise = readFileOrEmpty(testPath);
  const [srcContent, testContent] = await Promise.all([
    srcContentPromise,
    testContentPromise,
  ]);

  if (!srcContent) {
    throw new Error(`Source file not found: ${srcPath}`);
  }

  const systemPrompt = dedent(`
    As an expert in software testing, follow the user's instructions to create high-quality test code.
    Unless otherwise instructed by the user, the test code will be created based on the Jest framework.

    The user will provide instructions in the following format. Here, "tags" refer to XML-style tags.
    - description tag: This provides instructions about the function or cases to be considered for the test creation.
      If the description tag is absent, create tests covering the entire content of the src tag mentioned below.
    - src tag: This contains the code that needs to be tested. The path attribute specifies the path to the code that requires testing.
    - test tag: This contains the existing test code. The path attribute specifies the path to the test code of the code that requires testing.
    - If there is code inside the test tag, add the new test cases to the existing code. Be careful not to modify the existing code.

    Below is an example of the instructions provided by the user:
    \`\`\`
    <description>
    Create tests for the function bar.
    </description>

    <src path="/home/foo/src/bar.ts">
    function bar(x: string): boolean {
      return x === 'baz';
    }
    </src>

    <test path="/home/foo/test/bar.test.ts">
    </test>
    \`\`\`

    Output only the test code. Do not output any other content. Also,
    DO NOT include the \`\`\` that indicates the start and end of a code block.
  `);

  const client = new OpenAIClient({ systemPrompt });

  const contentString = dedent(`
    ${description ? `<description>\n${description}\n</description>\n\n` : ''}
    <src path=${srcPath}>
    ${srcContent}
    </src>

    <test path=${testPath}>
    ${testContent ?? ''}
    </test
  `);

  return client
    .chat(contentString)
    .then((testCode) =>
      writeToFile(testPath, testCode)
        .then(() => {
          return true;
        })
        .catch((error) => {
          console.error('Error writing test file:', error);
          return false;
        })
    )
    .catch((error) => {
      console.error('Error generating test code:', error);
      return false;
    });
}

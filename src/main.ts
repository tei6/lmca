import { Command } from 'commander';
import { fillCode } from './services/fillCode';
import { OpenAIClient } from './client/openaiClient';
import { readFile, writeFile } from './util/file';
import { generateTestCode } from './services/generateTestCode';
import { replaceCode } from './services/replaceCode';

const program = new Command();

program
  .name('lmca')
  .description('A tool that accelerates coding using the power of LLM.')
  .version('0.1.1');

program
  .command('gen-test')
  .description('Generate test code based on the provided source code')
  .option(
    '-s, --src-path <path>',
    'Specify the path to the source code file or directory to be analyzed'
  )
  .option(
    '-t, --test-path <path>',
    'Specify the path where the generated test code should be saved'
  )
  .option(
    '-d, --description <description>',
    'Provide a description or context for the test code generation process'
  )
  .action(async (options) => {
    const { srcPath, testPath, description } = options;
    if (srcPath && testPath) {
      await generateTestCode(
        (systemPrompt: string) => new OpenAIClient({ systemPrompt }),
        {
          readFile: async (filePath: string) => readFile(filePath),
          writeFile: async (filePath: string, content: string) =>
            writeFile(filePath, content),
        },
        srcPath,
        testPath,
        description
      );
      return undefined;
    } else {
      console.error('Both --src-path and --test-path must be provided.');
    }
  });

program
  .command('rewrite')
  .description('Replace content in the specified source file')
  .option(
    '-s, --src-path <path>',
    'Specify the path to the source code file where content will be replaced'
  )
  .option(
    '-d, --description <description>',
    'Provide a description or context for the content replacement process'
  )
  .action(async (options) => {
    const { srcPath, description } = options;
    if (srcPath && description) {
      await replaceCode(
        (systemPrompt: string) => new OpenAIClient({ systemPrompt }),
        {
          read: async (filePath: string) => readFile(filePath),
          write: async (filePath: string, content: string) =>
            writeFile(filePath, content),
        },
        srcPath,
        description
      );
      return undefined;
    } else {
      console.error('Both --src-path and --description must be provided.');
    }
  });

program
  .command('fill')
  .description(
    'Replace content within <fill></fill> tags in the specified source file'
  )
  .option(
    '-s, --src-path <path>',
    'Specify the path to the source code file where content will be replaced'
  )
  .option(
    '-d, --description <description>',
    'Provide a description or context for the content replacement process'
  )
  .action(async (options) => {
    const { srcPath, description } = options;
    if (srcPath && description) {
      await fillCode(
        (systemPrompt: string) => new OpenAIClient({ systemPrompt }),
        {
          read: async (filePath: string) => readFile(filePath),
          write: async (filePath: string, content: string) =>
            writeFile(filePath, content),
        },
        srcPath,
        description
      );
      return undefined;
    } else {
      console.error('Both --src-path and --description must be provided.');
    }
  });

program.parse(process.argv);

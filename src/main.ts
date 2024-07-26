import { Command } from 'commander';
import { generateTestCode } from './command/generateTestCode';
import { replaceCode } from './command/replaceCode';
import { OpenAIClient } from './client/openaiClient';

const program = new Command();

program
  .name('my-llm-tools')
  .description('A simple CLI tool that works with LLM')
  .version('1.0.0');

program
  .command('test')
  .description('about software test')
  .option('-s, --src-path <path>', 'Source path')
  .option('-t, --test-path <path>', 'Test path')
  .option('-d, --description <description>', 'Description')
  .action(async (options) => {
    const { srcPath, testPath, description } = options;
    if (srcPath && testPath) {
      await generateTestCode(
        (systemPrompt: string) => new OpenAIClient({ systemPrompt }),
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
  .command('replace')
  .description('Replace content in the specified source file')
  .option('-s, --src-path <path>', 'Source path')
  .option('-d, --description <description>', 'Description')
  .action(async (options) => {
    const { srcPath, description } = options;
    if (srcPath && description) {
      await replaceCode(
        (systemPrompt: string) => new OpenAIClient({ systemPrompt }),
        srcPath,
        description
      );
      return undefined;
    } else {
      console.error('');
    }
  });

program.parse(process.argv);

import { Command } from 'commander';
import { generateTestCode } from './generateTestCode';

const program = new Command();

program
  .name('my-llm-tools')
  .description('A simple CLI tool that work with LLM')
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
      await generateTestCode(srcPath, testPath, description);
      return undefined;
    } else {
      console.error('Both --src-path and --test-path must be provided.');
    }
  });

program.parse(process.argv);

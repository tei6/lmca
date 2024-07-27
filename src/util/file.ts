import * as fs from 'fs';
import * as path from 'path';

export interface FileHandler {
  read(path: string): Promise<string>;
  write(path: string, content: string): Promise<void>;
}

export async function readFile(filePath: string): Promise<string> {
  await fs.promises.access(filePath);
  return await fs.promises.readFile(filePath, 'utf-8');
}

export async function writeFile(
  filePath: string,
  content: string
): Promise<void> {
  const dir = path.dirname(filePath);

  try {
    if (!fs.existsSync(dir)) {
      await fs.promises.mkdir(dir, { recursive: true });
    }
    await fs.promises.writeFile(filePath, content, 'utf8');
  } catch (error) {
    console.error('Error writing file:', error);
  }
}

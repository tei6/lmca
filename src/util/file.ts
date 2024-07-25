import * as fs from 'fs';
import * as path from 'path';

export async function readFileOrEmpty(
  filePath: string
): Promise<string | undefined> {
  try {
    await fs.promises.access(filePath);
    return await fs.promises.readFile(filePath, 'utf-8');
  } catch (err) {
    if (
      err != null &&
      typeof err === 'object' &&
      'code' in err &&
      err.code === 'ENOENT'
    ) {
      return undefined;
    } else {
      throw err;
    }
  }
}

export async function writeToFile(
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

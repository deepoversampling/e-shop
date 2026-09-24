import fs from 'fs';
import path from 'path';

export function loadServerConfig(): any {
  const filePath: any = path.join(process.cwd(), '/browser/assets/root-urls.json');

  try {
    const rootUrl: any = JSON.parse(fs.readFileSync(filePath, 'utf-8')).rootUrlServer;
    if (rootUrl === undefined) {
      return new Error('SERVER root-urls.json is malformed');
    }
    return rootUrl;
  } catch (err: any) {
    if (err instanceof SyntaxError) {
      return new Error('SERVER root-urls.json is not valid JSON');
    } else {
      return new Error('SERVER root-urls.json has not been found');
    }
  }
}

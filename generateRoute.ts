// generateRoute.ts
import * as fs from 'fs';
import * as path from 'path';

const generateRouteFile = () => {
  const content = `import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ message: 'Hello from the generated route!' });
}
`;

  const directory = path.join(__dirname, 'app/pages/api');
  const filePath = path.join(directory, 'route.ts');

  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  fs.writeFileSync(filePath, content, { encoding: 'utf8' });
  console.log('route.ts file has been generated successfully.');
};

generateRouteFile();

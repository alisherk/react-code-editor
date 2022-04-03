import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path';
import { createCellRouter } from './routes/cells';

export const serve = (
  port: number,
  filename: string,
  dir: string,
  useProxy: boolean
) => {
  const app = express();

  app.use(createCellRouter(filename, dir))

  if (useProxy) {
    app.use(
      createProxyMiddleware({
        target: 'http://localhost:3000',
        ws: true,
        logLevel: 'silent',
      })
    );
  } else {
    //resolve will figure absolute path of index.html
    //on my local machine this will result in /Users/alisherkabildjanov/Projects/ts-react/jbook/packages/local-client/build/index.html
    const packPath = require.resolve('local-client/build/index.html');

    app.use(express.static(path.dirname(packPath)));
  }

  return new Promise<void>((resolve, reject) => {
    app.listen(port, resolve).on('error', reject);
  });
};

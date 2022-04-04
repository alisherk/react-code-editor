import { Command } from 'commander';
import { serve } from '@alisherk-editor/local-api';
import path from 'path';

const isProduction = process.env.NODE_ENV === 'production';

export const serveCommand = new Command()
  .command('serve [filename]')
  .description('Open a file for editing')
  .option('-p, --port <number>', 'port to run server on', '4005')
  .action( async(filename = 'notebook.js', options: { port: string }) => {
    try {
      const dir = path.join(process.cwd(), path.dirname(filename));

      await serve(parseInt(options.port), path.basename(filename), dir, !isProduction);

      console.log(`Opened ${filename}. Navigate to http://localhost:${options.port} to edit the file`);

    } catch (error: any) {
      if(error.code === 'EADDRINUSE') {
        console.log('Port is in use. Try running on a different port')
      } else {
        console.log('here the problem', error.message);
      }
      process.exit(1);
    }
  });

//path.join(process.cwd()), path.dirname(filename); will give absolute path to where you are on comp along with dir where you are currently in;
// will print out: /Users/alisherkabildjanov/Projects/ts-react/jbook/packages/cli/dist notes


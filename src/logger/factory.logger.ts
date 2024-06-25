import * as fs from 'node:fs';
import * as path from 'node:path';
import * as pino from 'pino';
import { Logger } from './logger.js';

export class LoggerFactory {
  private readonly pinoLogger: pino.Logger;

  constructor(runnerName: string) {
    this._logFolder = path.resolve(
      path.join(
        'reports',
        //DateTime.now().toFormat('yyyy-LL-dd HH:mm:ss')
        'test',
      ),
    );
    if (!fs.existsSync(this._logFolder)) {
      fs.mkdirSync(this._logFolder, { recursive: true });
    }

    this.pinoLogger = pino.pino({
      transport: {
        targets: [
          {
            target: 'pino-pretty',
            options: {
              colorize: false,
              destination: `${this._logFolder}/${runnerName}/run-pretty.log`,
            },
          },
          {
            target: 'pino/file',
            options: {
              destination: `${this._logFolder}/${runnerName}/run.log`,
            },
          },
          {
            target: 'pino-pretty',
            options: {
              colorize: true,
              destination: 1,
            },
          },
        ],
      },
    });
  }

  private _logFolder: string;

  get logFolder(): string {
    return this._logFolder;
  }

  public createLogger(context: string) {
    return new Logger(this.pinoLogger, context);
  }
}

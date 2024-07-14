import { DateTime } from 'luxon';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as pino from 'pino';
import { Logger } from './logger.js';

export class LoggerFactory {
  private readonly pinoLogger: pino.Logger;
  private readonly _logFolder: string;

  constructor(runnerName: string) {
    this._logFolder = path.resolve(
      path.join('reports', DateTime.now().toMillis().toString(), runnerName),
    );
    if (!fs.existsSync(this._logFolder)) {
      fs.mkdirSync(this._logFolder, { recursive: true });
    }

    this.pinoLogger = pino.pino({
      transport: {
        targets: [
          // {
          //   target: 'pino-pretty',
          //   options: {
          //     colorize: false,
          //     destination: `${this._logFolder}/run-pretty.log`,
          //   },
          // },
          {
            target: 'pino/file',
            options: {
              destination: `${this._logFolder}/run.log`,
            },
          },
          // TODO REMOVE THIS LATER ON RELEASE
          {
            target: 'pino-pretty',
            options: {
              colorize: process.env.SILENT != 'true',
              destination: process.env.SILENT == 'true' ? `${this._logFolder}/run-pretty.log` : 1,
            },
          },
        ],
      },
    });
  }

  get logFolder(): string {
    return this._logFolder;
  }

  public createLogger(context: string) {
    return new Logger(this.pinoLogger, context);
  }
}

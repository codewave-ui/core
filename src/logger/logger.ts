import pino from 'pino';

export class Logger {
  private readonly logger: pino.Logger;
  private readonly _name: string;

  constructor(logger: pino.Logger, name: string) {
    this.logger = logger;
    this._name = name;
  }

  get name() {
    return this._name;
  }

  info(content: string) {
    this.logger.info(`[${this._name}] ${content}`);
  }

  error(content: string) {
    this.logger.error(`[${this._name}] ${content}`);
  }

  fatal(content: string) {
    this.logger.fatal(`[${this._name}] ${content}`);
  }

  warn(content: string) {
    this.logger.warn(`[${this._name}] ${content}`);
  }
}

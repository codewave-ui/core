import { BaseConfig } from './config/index.js';
import { Logger, LoggerFactory } from './logger/index.js';
import { RunnerFactory } from './runner/index.js';

export class BaseTest {
  static loggerFactory: LoggerFactory;
  static runnerFactory: RunnerFactory;
  protected testSuiteName: string = 'Base Test';
  protected testSuiteId: string = '-';
  protected logger: Logger | undefined;
  protected config: BaseConfig;

  constructor(config: BaseConfig) {
    this.config = config;
  }
}

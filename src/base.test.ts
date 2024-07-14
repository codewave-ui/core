import { Config } from './config/index.js';
import { Keyword } from './keyword/index.js';
import { Logger, LoggerFactory } from './logger/index.js';
import { Runner, RunnerFactory } from './runner/index.js';

export class BaseTest {
  static loggerFactory: LoggerFactory;
  static runnerFactory: RunnerFactory;
  protected testSuiteName: string = 'Base Test';
  protected testSuiteId: string = '-';
  protected logger: Logger | undefined;
  protected config: Config;

  constructor(config: Config) {
    this.config = config;
  }
}

export type TestSuiteMetaData = {
  name: string;
  id: string;
};

export type TestSuiteContext = {
  testSuiteName: string;
  testSuiteId: string;
  runner: Runner;
};

export type TestCaseContext = {
  Keyword: Keyword;
};

export type TestCaseMethod = (context: TestCaseContext) => Promise<void>;

export enum TestStatus {
  SKIPPED,
  FAILED,
  SUCCESS,
}

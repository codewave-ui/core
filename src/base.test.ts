import Emittery from 'emittery';
import { Config } from './config/index.js';
import { EventHandlerType } from './event/index.js';
import { Assert, Keyword } from './keyword/index.js';
import { BaseListener } from './listener/index.js';
import { Logger, LoggerFactory } from './logger/index.js';
import { FactoryRunner, Runner } from './runner/index.js';

export class BaseTest extends BaseListener {
  static loggerFactory: LoggerFactory;
  static runnerFactory: FactoryRunner;
  protected testSuiteName: string = 'Base Test';
  protected testSuiteId: string = '-';
  protected config: Config;

  constructor(
    config: Config,
    logger: Logger,
    eventManager: Emittery<EventHandlerType>,
    runner: Runner,
  ) {
    super(eventManager, logger, runner);
    this.config = config;
    this.eventManager = eventManager;
    this.runner = runner;
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
  Assertion: Assert;
};

export type TestCaseMethod = (context: TestCaseContext) => Promise<void>;

export enum TestStatus {
  SKIPPED,
  FAILED,
  SUCCESS,
}

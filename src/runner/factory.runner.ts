import { TestCaseMethod } from '../base.test.js';
import { Logger } from '../logger/index.js';
import { Runner } from './runner.js';
import { RunnerTestCase } from './testcase.runner.js';

export class FactoryRunner {
  private logger: Logger;
  private runner: Runner | undefined;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  public initializeRunner(name: string, id: string) {
    this.runner = new Runner(name, id);
    this.logger.info(`Initalized new runner with name: ${name} [${id}]`);
  }

  public addRunnerDetail(name: string, id: string, method: TestCaseMethod, enabled?: boolean) {
    if (this.runner) {
      this.runner.testCases.push(new RunnerTestCase(name, id, method, enabled));
      this.logger.info(`Added test case with name: ${name} [${id}] to runner: ${this.runner.name}`);
    } else throw new Error('[ERR5001] Runner does not exist!');
  }

  public getCurrentRunner() {
    if (this.runner) {
      return this.runner;
    }
    throw new Error('[ERR5001] Runner does not exist!');
  }
}

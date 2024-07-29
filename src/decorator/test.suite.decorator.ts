import { LoggerFactory } from '../logger/index.js';
import { RunnerFactory } from '../runner/index.js';

type TestSuiteConfig = {
  id?: string;
};

export function TestSuite(name: string, config?: TestSuiteConfig) {
  return <T extends { new (...args: any[]): any }>(target: T, context: ClassDecoratorContext) => {
    const id =
      config !== undefined && config.id !== undefined
        ? config.id
        : context.name || 'Unnamed Test Suite';

    const loggerFactory = new LoggerFactory(id);
    const runnerFactory = new RunnerFactory(loggerFactory.createLogger('Runner'));

    context.addInitializer(function () {
      runnerFactory.initializeRunner(name, id);
    });

    return class extends target {
      static loggerFactory = loggerFactory;
      static runnerFactory = runnerFactory;
      testSuiteName = name;
      testSuiteId = id;
    };
  };
}

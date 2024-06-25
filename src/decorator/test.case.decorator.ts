import { BaseTest } from '../base.test.js';
import { Logger } from '../logger/index.js';
import { TestCaseContext } from '../type/index.js';

type TestCaseConfig = {
  id?: string;
  disabled?: boolean;
};

export function TestCase(name: string, config?: TestCaseConfig) {
  return function (
    target: (this: BaseTest, ...args: [context: TestCaseContext]) => Promise<void>,
    context: ClassMethodDecoratorContext<
      BaseTest,
      (this: BaseTest, ...args: [context: TestCaseContext]) => Promise<void>
    >,
  ) {
    const id =
      config !== undefined && config.id !== undefined ? config.id : (context.name as string);

    async function replacementMethod(
      this: BaseTest,
      ...args: [context: TestCaseContext]
    ): Promise<void> {
      const logger: Logger | undefined = this.logger;

      if (logger)
        logger.info(
          `============================== START TEST: ${name} ==============================`,
        );

      const result = await target.call(this, ...args);

      if (logger)
        logger.info(
          `============================== END TEST: ${name} ==============================`,
        );
      return result;
    }

    context.addInitializer(function () {
      (this as any).constructor['runnerFactory'].addRunnerDetail(
        name,
        id,
        replacementMethod,
        config === undefined || !config.disabled,
      );
    });

    return replacementMethod;
  };
}

import Emittery from 'emittery';
import { EventHandlerType, EventType } from '../../event/index.js';
import { BaseListener, ListenerContext } from '../../listener/index.js';
import { Logger } from '../../logger/index.js';
import { RunnerHook } from '../../runner/hook.runner.js';

export function BeforeTestSuite(
  target: (this: BaseListener, ...args: [context: ListenerContext]) => Promise<void>,
  context: ClassMethodDecoratorContext<
    BaseListener,
    (this: BaseListener, ...args: [context: ListenerContext]) => Promise<void>
  >,
) {
  async function beforeTestSuiteMethod(
    this: BaseListener,
    ...args: [context: ListenerContext]
  ): Promise<void> {
    const currHook = this.runner.beforeHooks.filter(hook => hook.name === context.name.toString());
    currHook[0].startNow();
    const logger: Logger | undefined = this.logger;
    if (logger)
      logger.info(
        `============================== START LISTENER: BEFORE TEST SUITE [${this.constructor.name}] ==============================`,
      );

    try {
      const result = await target.call(this, ...args);
      currHook[0].endNow();
      currHook[0].generateDuration();
      currHook[0].markAsPassed();

      if (logger)
        logger.info(
          `============================== END LISTENER: BEFORE TEST SUITE [${this.constructor.name}] ==============================`,
        );
      return result;
    } catch (err) {
      currHook[0].endNow();
      currHook[0].generateDuration();
      currHook[0].markAsFailed();
      throw err;
    }
  }

  context.addInitializer(function (this: BaseListener) {
    const eventManager: Emittery<EventHandlerType> = this.eventManager;
    eventManager.on(EventType.BEFORE_SUITE, beforeTestSuiteMethod.bind(this));
    this.runner.beforeHooks.push(new RunnerHook(context.name.toString()));
  });

  return beforeTestSuiteMethod;
}

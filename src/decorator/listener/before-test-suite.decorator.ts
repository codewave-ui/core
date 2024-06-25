import Emittery from 'emittery';
import { BaseListener } from '../../listener/index.js';
import { Logger } from '../../logger/index.js';
import { EventHandlerType, EventType, ListenerContext } from '../../type/index.js';

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
    const logger: Logger | undefined = this.logger;
    if (logger)
      logger.info(
        `============================== START LISTENER: BEFORE TEST SUITE [${this.constructor.name}] ==============================`,
      );

    const result = await target.call(this, ...args);

    if (logger)
      logger.info(
        `============================== END LISTENER: BEFORE TEST SUITE [${this.constructor.name}] ==============================`,
      );
    return result;
  }

  context.addInitializer(function (this: BaseListener) {
    const eventManager: Emittery<EventHandlerType> = this.eventManager;
    eventManager.on(EventType.BEFORE_SUITE, beforeTestSuiteMethod.bind(this));
  });

  return beforeTestSuiteMethod;
}

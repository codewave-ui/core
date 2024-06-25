import Emittery from 'emittery';
import { BaseListener } from '../../listener/index.js';
import { Logger } from '../../logger/index.js';
import { EventHandlerType, EventType, ListenerContext } from '../../type/index.js';

export function AfterTestSuite(
  target: (this: BaseListener, ...args: [context: ListenerContext]) => Promise<void>,
  context: ClassMethodDecoratorContext<
    BaseListener,
    (this: BaseListener, ...args: [context: ListenerContext]) => Promise<void>
  >,
) {
  async function afterTestSuiteMethod(
    this: BaseListener,
    ...args: [context: ListenerContext]
  ): Promise<void> {
    const logger: Logger | undefined = this.logger;

    if (logger)
      logger.info(
        `============================== START LISTENER: AFTER TEST SUITE [${this.constructor.name}] ==============================`,
      );

    const result = await target.call(this, ...args);

    if (logger)
      logger.info(
        `============================== END LISTENER: AFTER TEST SUITE [${this.constructor.name}] ==============================`,
      );
    return result;
  }

  context.addInitializer(function (this: BaseListener) {
    const eventManager: Emittery<EventHandlerType> = this.eventManager;
    eventManager.on(EventType.AFTER_SUITE, afterTestSuiteMethod.bind(this));
  });

  return afterTestSuiteMethod;
}

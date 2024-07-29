import Emittery from 'emittery';
import { EventHandlerType, EventType } from '../../event/index.js';
import { BaseListener, StepListenerContext } from '../../listener/index.js';
import { Logger } from '../../logger/index.js';

export function AfterTestStep(
  target: (this: BaseListener, ...args: [context: StepListenerContext]) => Promise<void>,
  context: ClassMethodDecoratorContext<
    BaseListener,
    (this: BaseListener, ...args: [context: StepListenerContext]) => Promise<void>
  >,
) {
  async function afterTestStepMethod(
    this: BaseListener,
    ...args: [context: StepListenerContext]
  ): Promise<void> {
    const logger: Logger | undefined = this.logger;
    if (logger)
      logger.info(
        `============================== START LISTENER: AFTER TEST STEP [${this.constructor.name}] ==============================`,
      );

    const result = await target.call(this, ...args);

    if (logger)
      logger.info(
        `============================== END LISTENER: AFTER TEST STEP [${this.constructor.name}] ==============================`,
      );
    return result;
  }

  context.addInitializer(function (this: BaseListener) {
    const eventManager: Emittery<EventHandlerType> = this.eventManager;
    eventManager.on(EventType.AFTER_STEP, afterTestStepMethod.bind(this));
  });

  return afterTestStepMethod;
}

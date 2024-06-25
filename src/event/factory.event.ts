import Emittery, { DebugLogger } from 'emittery';
import { Logger } from '../logger/index.js';
import { EventHandlerType } from '../type/index.js';

export class EventFactory {
  static generateEventManager(logger: Logger) {
    return new Emittery<EventHandlerType>({
      debug: {
        logger: EventFactory.generateLogger(logger),
        name: logger.name,
        enabled: true,
      },
    });
  }

  private static generateLogger(
    logger: Logger,
  ): DebugLogger<EventHandlerType, keyof EventHandlerType> {
    return (
      type: string,
      _debugName: string,
      eventName: keyof EventHandlerType | undefined,
      eventData?: Record<string, any>,
    ) => {
      const finalEventName = eventName?.toString() || '';
      if (finalEventName === 'Symbol(listenerAdded)' && eventData) {
        logger.info(`${type}: ${finalEventName} --> ${eventData.eventName}`);
      } else {
        logger.info(`${type}: ${finalEventName}`);
      }
    };
  }
}

import Emittery from 'emittery';
import { Logger, LoggerFactory } from '../logger/index.js';
import { EventHandlerType } from '../type/index.js';

export class BaseListener {
  protected logger: Logger | undefined;
  protected eventManager: Emittery<EventHandlerType>;

  constructor(
    context: string,
    eventManager: Emittery<EventHandlerType>,
    loggerFactory: LoggerFactory,
  ) {
    this.logger = loggerFactory.createLogger(context);
    this.eventManager = eventManager;
  }
}

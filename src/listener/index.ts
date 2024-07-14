export type ListenerContext = {
  testSuiteName: string;
  testSuiteId: string;
  runner: Runner;
};

export type StepListenerContext = {
  step: RunnerTestStep;
};

import Emittery from 'emittery';
import { EventHandlerType } from '../event/index.js';
import { Logger } from '../logger/index.js';
import { Runner, RunnerTestStep } from '../runner/index.js';

export class BaseListener {
  protected logger: Logger | undefined;
  protected eventManager: Emittery<EventHandlerType>;
  protected runner: Runner;

  constructor(eventManager: Emittery<EventHandlerType>, logger: Logger, runner: Runner) {
    this.logger = logger;
    this.eventManager = eventManager;
    this.runner = runner;
  }
}

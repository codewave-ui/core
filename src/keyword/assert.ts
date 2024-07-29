import Emittery from 'emittery';
import assert from 'node:assert';
import { Config } from '../config/index.js';
import { Driver } from '../driver/index.js';
import { EventHandlerType, EventType } from '../event/index.js';
import { Logger } from '../logger/index.js';
import { Runner, RunnerTestStep } from '../runner/index.js';
import { AssertionInterface } from './interface/assertion.interface.js';

export class Assert implements AssertionInterface {
  private runner: Runner;
  private eventManager: Emittery<EventHandlerType>;
  private logger: Logger;

  constructor(
    driver: Driver,
    runner: Runner,
    logger: Logger,
    config: Config,
    eventManager: Emittery<EventHandlerType>,
  ) {
    this.runner = runner;
    this.logger = logger;
    this.eventManager = eventManager;
  }

  async biggerThan(actual: number, limit: number) {
    const testStep = new RunnerTestStep('assertBiggerThan');

    try {
      await this.eventManager.emit(EventType.BEFORE_STEP, { step: testStep });
    } catch (ignored) {
      this.logger.warn(`[ERR3001] Failed to execute before step! ${ignored}`);
    }

    try {
      assert.strictEqual(
        actual > limit,
        true,
        `[ERR2100] Actual is not bigger than expected:\n+ Actual - Expected\n+ ${actual}\n- ${limit}`,
      );
      testStep.markAsPassed();
    } catch (err) {
      testStep.markAsFailed();
      try {
        await this.eventManager.emit(EventType.AFTER_STEP, { step: testStep });
      } catch (ignored) {
        this.logger.warn(`[ERR3002] Failed to execute after step! ${ignored}`);
      }
      throw err;
    } finally {
      testStep.endNow();
      testStep.generateDuration();
      this.runner.testCases[this.runner.currentTestCaseIndex].testSteps.push(testStep);
    }

    try {
      await this.eventManager.emit(EventType.AFTER_STEP, { step: testStep });
    } catch (ignored) {
      this.logger.warn(`[ERR3002] Failed to execute after step! ${ignored}`);
    }
  }

  async biggerThanEquals(actual: number, limit: number) {
    const testStep = new RunnerTestStep('assertBiggerThanEquals');

    try {
      await this.eventManager.emit(EventType.BEFORE_STEP, { step: testStep });
    } catch (ignored) {
      this.logger.warn(`[ERR3001] Failed to execute before step! ${ignored}`);
    }

    try {
      assert.strictEqual(
        actual >= limit,
        true,
        `[ERR2101] Actual is not bigger than equals expected:\n+ Actual - Expected\n+ ${actual}\n- ${limit}`,
      );
      testStep.markAsPassed();
    } catch (err) {
      testStep.markAsFailed();
      try {
        await this.eventManager.emit(EventType.AFTER_STEP, { step: testStep });
      } catch (ignored) {
        this.logger.warn(`[ERR3002] Failed to execute after step! ${ignored}`);
      }
      throw err;
    } finally {
      testStep.endNow();
      testStep.generateDuration();
      this.runner.testCases[this.runner.currentTestCaseIndex].testSteps.push(testStep);
    }

    try {
      await this.eventManager.emit(EventType.AFTER_STEP, { step: testStep });
    } catch (ignored) {
      this.logger.warn(`[ERR3002] Failed to execute after step! ${ignored}`);
    }
  }

  async smallerThan(actual: number, limit: number) {
    const testStep = new RunnerTestStep('assertSmallerThan');

    try {
      await this.eventManager.emit(EventType.BEFORE_STEP, { step: testStep });
    } catch (ignored) {
      this.logger.warn(`[ERR3001] Failed to execute before step! ${ignored}`);
    }

    try {
      assert.strictEqual(
        actual < limit,
        true,
        `[ERR2102] Actual is not smaller than expected:\n+ Actual - Expected\n+ ${actual}\n- ${limit}`,
      );
      testStep.markAsPassed();
    } catch (err) {
      testStep.markAsFailed();
      try {
        await this.eventManager.emit(EventType.AFTER_STEP, { step: testStep });
      } catch (ignored) {
        this.logger.warn(`[ERR3002] Failed to execute after step! ${ignored}`);
      }
      throw err;
    } finally {
      testStep.endNow();
      testStep.generateDuration();
      this.runner.testCases[this.runner.currentTestCaseIndex].testSteps.push(testStep);
    }

    try {
      await this.eventManager.emit(EventType.AFTER_STEP, { step: testStep });
    } catch (ignored) {
      this.logger.warn(`[ERR3002] Failed to execute after step! ${ignored}`);
    }
  }

  async smallerThanEquals(actual: number, limit: number) {
    const testStep = new RunnerTestStep('assertSmallerThanEquals');

    try {
      await this.eventManager.emit(EventType.BEFORE_STEP, { step: testStep });
    } catch (ignored) {
      this.logger.warn(`[ERR3001] Failed to execute before step! ${ignored}`);
    }

    try {
      assert.strictEqual(
        actual <= limit,
        true,
        `[ERR2103] Actual is not smaller than equals expected:\n+ Actual - Expected\n+ ${actual}\n- ${limit}`,
      );
      testStep.markAsPassed();
    } catch (err) {
      testStep.markAsFailed();
      try {
        await this.eventManager.emit(EventType.AFTER_STEP, { step: testStep });
      } catch (ignored) {
        this.logger.warn(`[ERR3002] Failed to execute after step! ${ignored}`);
      }
      throw err;
    } finally {
      testStep.endNow();
      testStep.generateDuration();
      this.runner.testCases[this.runner.currentTestCaseIndex].testSteps.push(testStep);
    }

    try {
      await this.eventManager.emit(EventType.AFTER_STEP, { step: testStep });
    } catch (ignored) {
      this.logger.warn(`[ERR3002] Failed to execute after step! ${ignored}`);
    }
  }

  // async assertKeywordNotThrowException(
  //   methodName: Exclude<keyof Keyword, keyof AssertionInterface>,
  //   ...args: Parameters<Keyword[Exclude<keyof Keyword, keyof AssertionInterface>]>
  // ): Promise<void> {
  //   const testStep = new RunnerTestStep('assertKeywordNotThrowException');
  //   testStep.args = {
  //     methodName,
  //     ...args.reduce(
  //       (prev, curr, idx) =>
  //         Object.assign(prev, { [`arg[${idx}]`]: curr?.toString() || 'undefined' }),
  //       {},
  //     ),
  //   };
  //   try {
  //     const method = Keyword[methodName];
  //     testStep.startNow();
  //
  //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //     // @ts-expect-error
  //     await method.apply(this, args);
  //     testStep.markAsPassed();
  //   } catch (error) {
  //     testStep.markAsFailed();
  //     assertIsError(error);
  //     throw new AssertionError('assertKeywordThrowException', error.message, '');
  //   } finally {
  //     testStep.endNow();
  //     testStep.generateDuration();
  //     this.runner.testCases[this.runner.currentTestCaseIndex].testSteps.push(testStep);
  //   }
  // }
  //
  // async assertKeywordThrowException(
  //   methodName: Exclude<keyof Keyword, keyof AssertionInterface>,
  //   expectedError: string,
  //   ...args: Parameters<Keyword[Exclude<keyof Keyword, keyof AssertionInterface>]>
  // ): Promise<void> {
  //   const testStep = new RunnerTestStep('assertKeywordThrowException');
  //   testStep.args = {
  //     methodName,
  //     expectedError,
  //     ...args.reduce(
  //       (prev, curr, idx) =>
  //         Object.assign(prev, { [`arg[${idx}]`]: curr?.toString() || 'undefined' }),
  //       {},
  //     ),
  //   };
  //   try {
  //     const method = this[methodName];
  //     testStep.startNow();
  //
  //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //     // @ts-expect-error
  //     await method.apply(this, args);
  //     testStep.markAsFailed();
  //     throw new AssertionError('assertKeywordThrowException', '', expectedError);
  //   } catch (error) {
  //     assertIsError(error);
  //     if (error instanceof AssertionError) {
  //       throw error;
  //     } else {
  //       if (error.message.toLowerCase().includes(expectedError.toLowerCase())) {
  //         testStep.markAsPassed();
  //         this.logger.info('Expected error match with actual error.');
  //       } else {
  //         testStep.markAsFailed();
  //         throw new AssertionError('assertKeywordThrowException', error.message, expectedError);
  //       }
  //     }
  //   } finally {
  //     testStep.endNow();
  //     testStep.generateDuration();
  //     this.runner.testCases[this.runner.currentTestCaseIndex].testSteps.push(testStep);
  //   }
  // }
  //
  // async assertFunctionNotThrowException<T extends (...args: any) => any>(
  //   fn: T,
  //   ...args: Parameters<T>
  // ): Promise<void> {
  //   const testStep = new RunnerTestStep('assertFunctionNotThrowException');
  //   testStep.args = {
  //     fn: fn.name,
  //     ...args.reduce(
  //       (prev, curr, idx) =>
  //         Object.assign(prev, { [`arg[${idx}]`]: curr?.toString() || 'undefined' }),
  //       {},
  //     ),
  //   };
  //   try {
  //     testStep.startNow();
  //     await fn.apply(args);
  //     testStep.markAsPassed();
  //   } catch (error) {
  //     assertIsError(error);
  //     testStep.markAsFailed();
  //     throw new AssertionError('assertFunctionThrowException', error.message, '');
  //   } finally {
  //     testStep.endNow();
  //     testStep.generateDuration();
  //     this.runner.testCases[this.runner.currentTestCaseIndex].testSteps.push(testStep);
  //   }
  // }
  //
  // async assertFunctionThrowException<T extends (...args: any) => any>(
  //   fn: T,
  //   expectedError: string,
  //   ...args: Parameters<T>
  // ) {
  //   const testStep = new RunnerTestStep('assertFunctionThrowException');
  //   testStep.args = {
  //     fn: fn.name,
  //     expectedError,
  //     ...args.reduce(
  //       (prev, curr, idx) =>
  //         Object.assign(prev, { [`arg[${idx}]`]: curr?.toString() || 'undefined' }),
  //       {},
  //     ),
  //   };
  //   try {
  //     testStep.startNow();
  //     await fn.apply(args);
  //     testStep.markAsFailed();
  //     throw new AssertionError('assertFunctionThrowException', '', expectedError);
  //   } catch (error) {
  //     assertIsError(error);
  //     if (error instanceof AssertionError) {
  //       throw error;
  //     } else if (error instanceof TypeError) {
  //       testStep.markAsFailed();
  //       throw new Error(
  //         "Invalid function to be run! If you want to assert Keyword method, use 'assertKeywordThrowException' instead. This method only allowed custom function type.",
  //       );
  //     } else {
  //       if (error.message.toLowerCase().includes(expectedError.toLowerCase())) {
  //         testStep.markAsPassed();
  //         this.logger.info('Expected error match with actual error.');
  //       } else {
  //         testStep.markAsFailed();
  //         throw new AssertionError('assertFunctionThrowException', error.message, expectedError);
  //       }
  //     }
  //   } finally {
  //     testStep.endNow();
  //     testStep.generateDuration();
  //     this.runner.testCases[this.runner.currentTestCaseIndex].testSteps.push(testStep);
  //   }
  // }
}

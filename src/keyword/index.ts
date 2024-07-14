import Emittery from 'emittery';
import { Config } from '../config/index.js';
import { Platform } from '../decorator/keyword.platform.decorator.js';
import { Driver } from '../driver/index.js';
import { BasePage, BaseSelector, Element } from '../element/index.js';
import { AssertionError, InvalidArgumentError, RuntimeError } from '../error/index.js';
import { EventHandlerType, EventType } from '../event/index.js';
import { assertIsError } from '../helper.js';
import { Logger } from '../logger/index.js';
import { Runner, RunnerTestStep } from '../runner/index.js';
import { AssertionInterface } from './interface/assertion.interface.js';
import { ClickInterface } from './interface/click.interface.js';
import { NavigationInterface } from './interface/navigation.interface.js';
import { VisibilityInterface } from './interface/visibility.interface.js';

export class Keyword
  implements VisibilityInterface, AssertionInterface, ClickInterface, NavigationInterface
{
  private driver: Driver;
  private logger: Logger;
  private runner: Runner;
  private config: Config;
  private eventManager: Emittery<EventHandlerType>;

  constructor(
    driver: Driver,
    runner: Runner,
    logger: Logger,
    config: Config,
    eventManager: Emittery<EventHandlerType>,
  ) {
    this.driver = driver;
    this.runner = runner;
    this.logger = logger;
    this.config = config;
    this.eventManager = eventManager;
  }

  /**
   * Navigate to specific url (web url or deep link for mobile platform)
   *
   * @async
   * @function goTo
   * @version 0.0.1
   * @since 0.0.1
   * @throws {InvalidArgumentError} If the url string is empty
   * @param {(string | BasePage)} target A string representing the url or BasePage instance that
   *                                     contains url() method to be called upon.
   */
  @Platform({ desktop: true })
  public async goTo(target: string | BasePage): Promise<void> {
    // Initialize test step object
    const testStep = new RunnerTestStep('goTo');

    try {
      await this.eventManager.emit(EventType.BEFORE_STEP, { step: testStep });
    } catch (ignored) {
      this.logger.warn(`Failed to execute before step! ${ignored}`);
    }

    // Get the string url either from BasePage instance or string param
    let url = '';
    if (typeof target === 'string') url = target;
    else url = target.url();

    // Update test step args and start time
    testStep.args['target'] =
      `${url} [${typeof target === 'string' ? 'string' : 'BasePage.url()'}]`;
    testStep.startNow();

    if (url.length === 0) {
      testStep.markAsFailed();
      testStep.endNow();
      testStep.generateDuration();
      this.runner.testCases[this.runner.currentTestCaseIndex].testSteps.push(testStep);
      this.logger.error('FAILED - URL is empty!');
      try {
        await this.eventManager.emit(EventType.AFTER_STEP, { step: testStep });
      } catch (ignored) {
        this.logger.warn(`Failed to execute after step! ${ignored}`);
      }
      throw new InvalidArgumentError('url', 'string', '"" (empty string)');
    }

    this.logger.info(`Navigating to ${url}...`);
    await this.driver.getDriverInstance()!.navigateTo(url);
    const urlNow = await this.driver.getDriverInstance()!.getUrl();
    this.logger.info(`SUCCESS - Current url: '${urlNow}'`);
    testStep.markAsPassed();
    testStep.endNow();
    testStep.generateDuration();
    this.runner.testCases[this.runner.currentTestCaseIndex].testSteps.push(testStep);
    try {
      await this.eventManager.emit(EventType.AFTER_STEP, { step: testStep });
    } catch (ignored) {
      this.logger.warn(`Failed to execute after step! ${ignored}`);
    }
  }

  async verifyElementNotVisible(element: Element): Promise<void> {
    // Initialize test step object
    const testStep = new RunnerTestStep('verifyElementNotVisible');

    try {
      await this.eventManager.emit(EventType.BEFORE_STEP, { step: testStep });
    } catch (ignored) {
      this.logger.warn(`Failed to execute before step! ${ignored}`);
    }

    this.logger.info(
      `Verifying element with ${element.defaultSelector.toString()} is not visible...`,
    );

    // Update test step args and start time
    testStep.args['element'] = `${element.defaultSelector.toString()}`;
    testStep.startNow();

    // Get the element from driver and check whether it is displayed or not
    const el = await this.driver
      .getDriverInstance()!
      .$(element.defaultSelector.convertToWdioSelector());
    const isDisplayed = !el.error && (await el.isDisplayed());

    // Update test step end time and duration string
    testStep.endNow();
    testStep.generateDuration();

    if (isDisplayed) {
      // If displayed then it is not match with expected result, thus mark as failed and throw error
      testStep.markAsFailed();
      this.runner.testCases[this.runner.currentTestCaseIndex].testSteps.push(testStep);
      this.logger.error('FAILED - Element is visible!');
      throw new RuntimeError('Element is visible!', element.defaultSelector);
    }

    // Else, it is the same as expected result, thus mark as passed
    testStep.markAsPassed();
    this.runner.testCases[this.runner.currentTestCaseIndex].testSteps.push(testStep);

    this.logger.info('SUCCESS - Element is not visible!');
  }

  @Platform({ desktop: true })
  async verifyElementVisible(element: Element): Promise<void> {
    this.logger.info(`Verifying element with ${element.defaultSelector.toString()} is visible...`);
    // Initialize test step object
    const testStep = new RunnerTestStep('verifyElementVisible');
    testStep.args['element'] = element.defaultSelector.toString();

    // Update test step start time
    testStep.startNow();

    // Get the element with self-healing logic and update test step data
    try {
      const { element: el, selector, selfHealing } = await this.getElementWithSelfHealing(element);
      testStep.args['element'] = `${selector.toString()}${selfHealing ? ' (self-healing)' : ''}`;

      const isDisplayed = await el.isDisplayedInViewport();

      if (isDisplayed) {
        // Same as expected result, mark as passed
        testStep.markAsPassed();

        // Update test step end time and duration string
        testStep.endNow();
        testStep.generateDuration();
        this.runner.testCases[this.runner.currentTestCaseIndex].testSteps.push(testStep);
        this.logger.info('Success - Element is visible!');
      } else {
        // Else, the element not visible, thus throw error
        throw new RuntimeError('Element is not visible!', element.defaultSelector);
      }
    } catch (err) {
      // Mark as failed and throw the error up
      testStep.markAsFailed();
      testStep.endNow();
      testStep.generateDuration();
      this.runner.testCases[this.runner.currentTestCaseIndex].testSteps.push(testStep);
      this.logger.error('FAILED - Element is not visible!');
      throw err;
    }
  }

  async waitForElementNotVisible(element: Element, timeout?: number): Promise<boolean> {
    this.logger.info(
      `Waiting element with ${element.defaultSelector.toString()} to be not visible...`,
    );
    // Initialize test step object
    const testStep = new RunnerTestStep('waitForElementNotVisible');

    // Update test step args and start time
    testStep.args['element'] = `${element.defaultSelector.toString()}`;
    testStep.args['timeout'] = timeout ? timeout.toString() : 'undefined';
    testStep.startNow();

    // Get the element from driver and check whether it is displayed or not
    const el = await this.driver
      .getDriverInstance()!
      .$(element.defaultSelector.convertToWdioSelector());
    const isDisplayed = await el.waitForDisplayed({
      reverse: true,
      timeout: this.config.waitForTimeout,
      interval: this.config.waitForInterval,
    });

    // Update test step end time and duration string
    testStep.endNow();
    testStep.generateDuration();
    if (isDisplayed) {
      // Same as expected result, mark as passed
      testStep.markAsPassed();
      this.runner.testCases[this.runner.currentTestCaseIndex].testSteps.push(testStep);
      this.logger.info(
        `Success - Element is not visible within ${(this.config.waitForTimeout / 1000).toFixed(0)} second(s)!`,
      );
      return true;
    } else {
      // Else, the element is visible, thus mark as failed
      testStep.markAsFailed();
      this.runner.testCases[this.runner.currentTestCaseIndex].testSteps.push(testStep);
      this.logger.error(
        `FAILED - Element is visible within ${(this.config.waitForTimeout / 1000).toFixed(0)} second(s)!`,
      );
      return false;
    }
  }

  async waitForElementVisible(element: Element, timeout?: number): Promise<boolean> {
    this.logger.info(`Waiting element with ${element.defaultSelector.toString()} to be visible...`);
    // Initialize test step object
    const testStep = new RunnerTestStep('waitForElementVisible');

    // Update test step args and start time
    testStep.args['element'] = element.defaultSelector.toString();
    testStep.args['timeout'] = timeout ? timeout.toString() : 'undefined';
    testStep.startNow();

    // Get the element with self-healing logic and update test step data
    try {
      const { element: el, selector, selfHealing } = await this.getElementWithSelfHealing(element);
      testStep.args['element'] = `${selector.toString()}${selfHealing ? ' (self-healing)' : ''}`;

      const isDisplayed = await el.isDisplayed();

      // Update test step end time and duration string
      testStep.endNow();
      testStep.generateDuration();

      if (isDisplayed) {
        // Same as expected result, mark as passed
        testStep.markAsPassed();
        this.runner.testCases[this.runner.currentTestCaseIndex].testSteps.push(testStep);
        this.logger.info(
          `Success - Element is visible within ${(this.config.waitForTimeout / 1000).toFixed(0)} second(s)!`,
        );
        return true;
      } else {
        // Else, the element is visible, thus mark as failed
        throw new RuntimeError('Element is not visible!', element.defaultSelector);
      }
    } catch (err) {
      // Else, the element is visible, thus mark as failed
      testStep.markAsFailed();
      this.runner.testCases[this.runner.currentTestCaseIndex].testSteps.push(testStep);
      this.logger.error(
        `FAILED - Element is not visible within ${(this.config.waitForTimeout / 1000).toFixed(0)} second(s)!`,
      );
      return false;
    }
  }

  async assertKeywordNotThrowException(
    methodName: Exclude<keyof Keyword, keyof AssertionInterface>,
    ...args: Parameters<Keyword[Exclude<keyof Keyword, keyof AssertionInterface>]>
  ): Promise<void> {
    const testStep = new RunnerTestStep('assertKeywordNotThrowException');
    testStep.args = {
      methodName,
      ...args.reduce(
        (prev, curr, idx) =>
          Object.assign(prev, { [`arg[${idx}]`]: curr?.toString() || 'undefined' }),
        {},
      ),
    };
    try {
      const method = this[methodName];
      testStep.startNow();

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      await method.apply(this, args);
      testStep.markAsPassed();
    } catch (error) {
      testStep.markAsFailed();
      assertIsError(error);
      throw new AssertionError('assertKeywordThrowException', error.message, '');
    } finally {
      testStep.endNow();
      testStep.generateDuration();
      this.runner.testCases[this.runner.currentTestCaseIndex].testSteps.push(testStep);
    }
  }

  async assertKeywordThrowException(
    methodName: Exclude<keyof Keyword, keyof AssertionInterface>,
    expectedError: string,
    ...args: Parameters<Keyword[Exclude<keyof Keyword, keyof AssertionInterface>]>
  ): Promise<void> {
    const testStep = new RunnerTestStep('assertKeywordThrowException');
    testStep.args = {
      methodName,
      expectedError,
      ...args.reduce(
        (prev, curr, idx) =>
          Object.assign(prev, { [`arg[${idx}]`]: curr?.toString() || 'undefined' }),
        {},
      ),
    };
    try {
      const method = this[methodName];
      testStep.startNow();

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      await method.apply(this, args);
      testStep.markAsFailed();
      throw new AssertionError('assertKeywordThrowException', '', expectedError);
    } catch (error) {
      assertIsError(error);
      if (error instanceof AssertionError) {
        throw error;
      } else {
        if (error.message.toLowerCase().includes(expectedError.toLowerCase())) {
          testStep.markAsPassed();
          this.logger.info('Expected error match with actual error.');
        } else {
          testStep.markAsFailed();
          throw new AssertionError('assertKeywordThrowException', error.message, expectedError);
        }
      }
    } finally {
      testStep.endNow();
      testStep.generateDuration();
      this.runner.testCases[this.runner.currentTestCaseIndex].testSteps.push(testStep);
    }
  }

  async assertFunctionNotThrowException<T extends (...args: any) => any>(
    fn: T,
    ...args: Parameters<T>
  ): Promise<void> {
    const testStep = new RunnerTestStep('assertFunctionNotThrowException');
    testStep.args = {
      fn: fn.name,
      ...args.reduce(
        (prev, curr, idx) =>
          Object.assign(prev, { [`arg[${idx}]`]: curr?.toString() || 'undefined' }),
        {},
      ),
    };
    try {
      testStep.startNow();
      await fn.apply(args);
      testStep.markAsPassed();
    } catch (error) {
      assertIsError(error);
      testStep.markAsFailed();
      throw new AssertionError('assertFunctionThrowException', error.message, '');
    } finally {
      testStep.endNow();
      testStep.generateDuration();
      this.runner.testCases[this.runner.currentTestCaseIndex].testSteps.push(testStep);
    }
  }

  async assertFunctionThrowException<T extends (...args: any) => any>(
    fn: T,
    expectedError: string,
    ...args: Parameters<T>
  ) {
    const testStep = new RunnerTestStep('assertFunctionThrowException');
    testStep.args = {
      fn: fn.name,
      expectedError,
      ...args.reduce(
        (prev, curr, idx) =>
          Object.assign(prev, { [`arg[${idx}]`]: curr?.toString() || 'undefined' }),
        {},
      ),
    };
    try {
      testStep.startNow();
      await fn.apply(args);
      testStep.markAsFailed();
      throw new AssertionError('assertFunctionThrowException', '', expectedError);
    } catch (error) {
      assertIsError(error);
      if (error instanceof AssertionError) {
        throw error;
      } else if (error instanceof TypeError) {
        testStep.markAsFailed();
        throw new Error(
          "Invalid function to be run! If you want to assert Keyword method, use 'assertKeywordThrowException' instead. This method only allowed custom function type.",
        );
      } else {
        if (error.message.toLowerCase().includes(expectedError.toLowerCase())) {
          testStep.markAsPassed();
          this.logger.info('Expected error match with actual error.');
        } else {
          testStep.markAsFailed();
          throw new AssertionError('assertFunctionThrowException', error.message, expectedError);
        }
      }
    } finally {
      testStep.endNow();
      testStep.generateDuration();
      this.runner.testCases[this.runner.currentTestCaseIndex].testSteps.push(testStep);
    }
  }

  @Platform({ desktop: true })
  async click(element: Element): Promise<void> {
    this.logger.info(`Clicking element with ${element.defaultSelector.toString()}...`);

    const testStep = new RunnerTestStep('click');
    testStep.args['element'] = element.defaultSelector.toString();

    // Update test step start time
    testStep.startNow();

    // Get the element with self-healing logic and update test step data
    try {
      const { element: el, selector, selfHealing } = await this.getElementWithSelfHealing(element);
      testStep.args['element'] = `${selector.toString()}${selfHealing ? ' (self-healing)' : ''}`;

      await el.click();

      testStep.markAsPassed();

      // Update test step end time and duration string
      testStep.endNow();
      testStep.generateDuration();
      this.runner.testCases[this.runner.currentTestCaseIndex].testSteps.push(testStep);
      this.logger.info('Success - Element has been clicked!');
    } catch (err) {
      // Mark as failed and throw the error up
      testStep.markAsFailed();
      testStep.endNow();
      testStep.generateDuration();
      this.runner.testCases[this.runner.currentTestCaseIndex].testSteps.push(testStep);
      this.logger.error(
        'FAILED - Element is either not visible or positioned behind another element!',
      );
      throw err;
    }
  }

  private async getElementWithSelfHealing(element: Element): Promise<{
    element: WebdriverIO.Element;
    selector: BaseSelector;
    selfHealing: boolean;
  }> {
    let el = await this.driver
      .getDriverInstance()!
      .$(element.defaultSelector.convertToWdioSelector());
    try {
      await el.waitForExist({
        timeout: this.config.waitForTimeout,
        interval: this.config.waitForInterval,
      });
      return {
        element: el,
        selector: element.defaultSelector,
        selfHealing: false,
      };
    } catch (err) {
      if (this.config.isSelfHealingEnable) {
        this.logger.warn(
          `Unable to locate element with default selector ${element.defaultSelector.toString()}. Initiating self healing...`,
        );
        for (const selector of element.selectors) {
          el = await this.driver.getDriverInstance()!.$(selector.convertToWdioSelector());
          try {
            await el.waitForExist({
              timeout: this.config.waitForTimeout,
              interval: this.config.waitForInterval,
            });
            this.logger.info(
              `Self-healing success with selector ${element.defaultSelector.toString()}.`,
            );
            element.selfHealingSuggestion = true;
            element.selfHealingSelector = selector;
            this.runner.selfHealingElement.push(element);
            return { element: el, selector, selfHealing: true };
          } catch (errSelfHeal) {
            this.logger.warn(`Self healing failed! ${selector.toString()}`);
          }
        }
        throw new RuntimeError('No such element', element.defaultSelector);
      } else {
        this.logger.warn('Self healing is disabled!');
        throw new RuntimeError('No such element', element.defaultSelector);
      }
    }
  }
}

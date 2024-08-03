import Emittery from 'emittery';
import assert from 'node:assert';
import { Config } from '../config/index.js';
import { Platform } from '../decorator/keyword.platform.decorator.js';
import { Driver } from '../driver/index.js';
import { BasePage, BaseSelector, Element } from '../element/index.js';
import { InvalidArgumentError, RuntimeError } from '../error/index.js';
import { EventHandlerType, EventType } from '../event/index.js';
import { Logger } from '../logger/index.js';
import { Runner, RunnerTestStep } from '../runner/index.js';
import { ClickInterface } from './interface/click.interface.js';
import { DelayInterface } from './interface/delay.interface.js';
import { NavigationInterface } from './interface/navigation.interface.js';
import { TextInterface } from './interface/text.interface.js';
import { VisibilityInterface } from './interface/visibility.interface.js';

export * from './assert.js';

export class Keyword
  implements
    VisibilityInterface,
    ClickInterface,
    NavigationInterface,
    DelayInterface,
    TextInterface
{
  protected driver: Driver;
  protected config: Config;
  private logger: Logger;
  private runner: Runner;
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
   * @version 1.0.0
   * @since 1.0.0
   * @author Joshua Lauwrich Nandy
   * @throws {InvalidArgumentError} If the url string is empty
   * @param {(string | BasePage)} target A string representing the url or BasePage instance that
   *                                     contains url() method to be called upon.
   */
  @Platform({ desktop: true, lite: true })
  public async goTo(target: string | BasePage): Promise<void> {
    // Initialize test step object
    const testStep = new RunnerTestStep('goTo');

    try {
      await this.eventManager.emit(EventType.BEFORE_STEP, { step: testStep });
    } catch (ignored) {
      this.logger.warn(`[ERR3001] Failed to execute before step! ${ignored}`);
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
        this.logger.warn(`[ERR3002] Failed to execute after step! ${ignored}`);
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
      this.logger.warn(`[ERR3002] Failed to execute after step! ${ignored}`);
    }
  }

  /**
   * Verify if the given element is visible in viewport. Please note that:
   *    1. element outside viewport (e.g. need scrolling)
   *    2. element with "display: none" css
   *    3. element with "visibility: hidden" css
   *    4. element with "opacity: 0" css
   *    5. element with no size (no text content, width & height explicitly set to 0)
   * is considered as not visible and will throw error.
   *
   * @async
   * @version 1.0.0
   * @since 1.0.0
   * @author Joshua Lauwrich Nandy
   * @throws {RuntimeError} When the element is not exist or not displayed in the viewport
   * @param {Element} element The element that will be verified
   */
  @Platform({ desktop: true, lite: true })
  async verifyElementVisible(element: Element): Promise<void> {
    // Initialize test step object
    const testStep = new RunnerTestStep('verifyElementVisible');

    try {
      await this.eventManager.emit(EventType.BEFORE_STEP, { step: testStep });
    } catch (ignored) {
      this.logger.warn(`[ERR3001] Failed to execute before step! ${ignored}`);
    }

    this.logger.info(`Verifying element with ${element.defaultSelector.toString()} is visible...`);
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
        try {
          await this.eventManager.emit(EventType.AFTER_STEP, { step: testStep });
        } catch (ignored) {
          this.logger.warn(`[ERR3002] Failed to execute after step! ${ignored}`);
        }
      } else {
        // Else, the element not visible, thus throw error
        throw new RuntimeError('ERR2004', 'Element is not visible!', element.defaultSelector);
      }
    } catch (err) {
      // Mark as failed and throw the error up
      testStep.markAsFailed();
      testStep.endNow();
      testStep.generateDuration();
      this.runner.testCases[this.runner.currentTestCaseIndex].testSteps.push(testStep);
      this.logger.error('FAILED - Element is not visible!');
      try {
        await this.eventManager.emit(EventType.AFTER_STEP, { step: testStep });
      } catch (ignored) {
        this.logger.warn(`[ERR3002] Failed to execute after step! ${ignored}`);
      }
      throw err;
    }
  }

  /**
   * Verify if the given element is NOT visible in viewport. Please note that:
   *    1. element outside viewport (e.g. need scrolling)
   *    2. element with "display: none" css
   *    3. element with "visibility: hidden" css
   *    4. element with "opacity: 0" css
   *    5. element with no size (no text content, width & height explicitly set to 0)
   * is considered as not visible.
   *
   * @async
   * @version 1.0.0
   * @since 1.0.0
   * @author Joshua Lauwrich Nandy
   * @throws {RuntimeError} When the element is not exist or not displayed in the viewport
   * @param {Element} element The element that will be verified
   */
  @Platform({ desktop: true, lite: true })
  async verifyElementNotVisible(element: Element): Promise<void> {
    // Initialize test step object
    const testStep = new RunnerTestStep('verifyElementNotVisible');

    try {
      await this.eventManager.emit(EventType.BEFORE_STEP, { step: testStep });
    } catch (ignored) {
      this.logger.warn(`[ERR3001] Failed to execute before step! ${ignored}`);
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
    const isDisplayed = !el.error && (await el.isDisplayedInViewport());

    // Update test step end time and duration string
    testStep.endNow();
    testStep.generateDuration();

    if (isDisplayed) {
      // If displayed then it is not match with expected result, thus mark as failed and throw error
      testStep.markAsFailed();
      this.runner.testCases[this.runner.currentTestCaseIndex].testSteps.push(testStep);
      this.logger.error('FAILED - Element is visible!');
      try {
        await this.eventManager.emit(EventType.AFTER_STEP, { step: testStep });
      } catch (ignored) {
        this.logger.warn(`[ERR3002] Failed to execute after step! ${ignored}`);
      }
      throw new RuntimeError('ERR2005', 'Element is visible!', element.defaultSelector);
    }

    // Else, it is the same as expected result, thus mark as passed
    testStep.markAsPassed();
    this.runner.testCases[this.runner.currentTestCaseIndex].testSteps.push(testStep);

    this.logger.info('SUCCESS - Element is not visible!');
    try {
      await this.eventManager.emit(EventType.AFTER_STEP, { step: testStep });
    } catch (ignored) {
      this.logger.warn(`[ERR3002] Failed to execute after step! ${ignored}`);
    }
  }

  /**
   * Wait for given element until it is NOT visible in viewport. If timeout is omitted, the default timeout
   * from config object is used. Please note that:
   *    1. element outside viewport (e.g. need scrolling)
   *    2. element with "display: none" css
   *    3. element with "visibility: hidden" css
   *    4. element with "opacity: 0" css
   *    5. element with no size (no text content, width & height explicitly set to 0)
   * is considered as not visible.
   *
   * @async
   * @version 1.0.0
   * @since 1.0.0
   * @author Joshua Lauwrich Nandy
   * @param {Element} element The element that will be checked
   * @param {number} [timeout] Timeout to wait before returning false in second
   * @returns {Promise<boolean>} Promise object with true means the element is NOT visible in viewport
   *                             and false otherwise
   */
  @Platform({ desktop: true, lite: true })
  async waitForElementNotVisible(element: Element, timeout?: number): Promise<boolean> {
    // Initialize test step object
    const testStep = new RunnerTestStep('waitForElementNotVisible');
    try {
      await this.eventManager.emit(EventType.BEFORE_STEP, { step: testStep });
    } catch (ignored) {
      this.logger.warn(`[ERR3001] Failed to execute before step! ${ignored}`);
    }
    this.logger.info(
      `Waiting element with ${element.defaultSelector.toString()} to be not visible...`,
    );

    // Update test step args and start time
    testStep.args['element'] = `${element.defaultSelector.toString()}`;
    testStep.args['timeout'] = timeout ? timeout.toString() : 'undefined';
    testStep.startNow();

    // Get the element from driver and check whether it is displayed or not
    const el = await this.driver
      .getDriverInstance()!
      .$(element.defaultSelector.convertToWdioSelector());

    try {
      await el.waitForDisplayed({
        reverse: true,
        timeout: timeout ? timeout * 1000 : this.config.waitForTimeout,
        interval: this.config.waitForInterval,
      });
      // Update test step end time and duration string
      testStep.endNow();
      testStep.generateDuration();

      // Same as expected result, mark as passed
      testStep.markAsPassed();
      this.runner.testCases[this.runner.currentTestCaseIndex].testSteps.push(testStep);
      this.logger.info(
        `Success - Element is not visible within ${(this.config.waitForTimeout / 1000).toFixed(0)} second(s)!`,
      );
      try {
        await this.eventManager.emit(EventType.AFTER_STEP, { step: testStep });
      } catch (ignored) {
        this.logger.warn(`[ERR3002] Failed to execute after step! ${ignored}`);
      }
      return true;
    } catch (err) {
      // Else, the element is visible, thus mark as failed
      testStep.markAsFailed();
      this.runner.testCases[this.runner.currentTestCaseIndex].testSteps.push(testStep);
      this.logger.error(
        `FAILED - Element is visible within ${(this.config.waitForTimeout / 1000).toFixed(0)} second(s)!`,
      );
      try {
        await this.eventManager.emit(EventType.AFTER_STEP, { step: testStep });
      } catch (ignored) {
        this.logger.warn(`[ERR3002] Failed to execute after step! ${ignored}`);
      }
      return false;
    }
  }

  /**
   * Wait for given element until it is visible in viewport. If timeout is omitted, the default timeout
   * from config object is used. Please note that:
   *    1. element outside viewport (e.g. need scrolling)
   *    2. element with "display: none" css
   *    3. element with "visibility: hidden" css
   *    4. element with "opacity: 0" css
   *    5. element with no size (no text content, width & height explicitly set to 0)
   * is considered as not visible.
   *
   * @async
   * @version 1.0.0
   * @since 1.0.0
   * @author Joshua Lauwrich Nandy
   * @param {Element} element The element that will be checked
   * @param {number} [timeout] Timeout to wait before returning false in second
   * @returns {Promise<boolean>} Promise object with true means the element is visible in viewport
   *                             and false otherwise
   */
  @Platform({ desktop: true, lite: true })
  async waitForElementVisible(element: Element, timeout?: number): Promise<boolean> {
    // Initialize test step object
    const testStep = new RunnerTestStep('waitForElementVisible');
    try {
      await this.eventManager.emit(EventType.BEFORE_STEP, { step: testStep });
    } catch (ignored) {
      this.logger.warn(`Failed to execute before step! ${ignored}`);
    }
    this.logger.info(`Waiting element with ${element.defaultSelector.toString()} to be visible...`);

    // Update test step args and start time
    testStep.args['element'] = element.defaultSelector.toString();
    testStep.args['timeout'] = timeout ? timeout.toString() : 'undefined';
    testStep.startNow();

    // Get the element with self-healing logic and update test step data
    try {
      const {
        element: el,
        selector,
        selfHealing,
      } = await this.getElementWithSelfHealing(element, timeout);
      testStep.args['element'] = `${selector.toString()}${selfHealing ? ' (self-healing)' : ''}`;

      const isDisplayed = await el.isDisplayedInViewport();

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
        try {
          await this.eventManager.emit(EventType.AFTER_STEP, { step: testStep });
        } catch (ignored) {
          this.logger.warn(`[ERR3002] Failed to execute after step! ${ignored}`);
        }
        return true;
      } else {
        // Else, the element is visible, thus mark as failed
        throw new RuntimeError('ERR2004', 'Element is not visible!', element.defaultSelector);
      }
    } catch (err) {
      // Else, the element is visible, thus mark as failed
      testStep.markAsFailed();
      this.runner.testCases[this.runner.currentTestCaseIndex].testSteps.push(testStep);
      this.logger.error(
        `FAILED - Element is not visible within ${(this.config.waitForTimeout / 1000).toFixed(0)} second(s)!`,
      );
      try {
        await this.eventManager.emit(EventType.AFTER_STEP, { step: testStep });
      } catch (ignored) {
        this.logger.warn(`[ERR3002] Failed to execute after step! ${ignored}`);
      }
      return false;
    }
  }

  /**
   * Delay the execution for given time. Please note that using this function will halt all
   * execution and won't resume faster with condition. The only usage to use this function:
   *  1. Waiting for animation
   *  2. Waiting for backend processing without visual feedback
   * It is recommended to not use this command to wait for an element to show up.
   *
   * @async
   * @version 1.0.0
   * @since 1.0.0
   * @author Joshua Lauwrich Nandy
   * @param {number} duration Duration for the delay in second
   */
  async delay(duration: number): Promise<void> {
    // Initialize test step object
    const testStep = new RunnerTestStep('delay');

    try {
      await this.eventManager.emit(EventType.BEFORE_STEP, { step: testStep });
    } catch (ignored) {
      this.logger.warn(`[ERR3001] Failed to execute before step! ${ignored}`);
    }

    this.logger.info(`Delaying execution for ${duration} second(s)...`);

    testStep.args['duration'] = `${duration.toString()}`;
    testStep.startNow();

    await this.driver.getDriverInstance()!.pause(duration * 1000);

    testStep.markAsPassed();
    testStep.endNow();
    testStep.generateDuration();

    this.logger.info(`SUCCESS - Execution delayed for ${duration} second(s)!`);
    try {
      await this.eventManager.emit(EventType.AFTER_STEP, { step: testStep });
    } catch (ignored) {
      this.logger.warn(`[ERR3002] Failed to execute after step! ${ignored}`);
    }
  }

  /**
   * Perform click (tap) event on the given element. Please note that the element must be
   * visible and in the viewport or an exception will be thrown.
   *
   * @async
   * @version 1.0.0
   * @since 1.0.0
   * @author Joshua Lauwrich Nandy
   * @throws {RuntimeError} When the element is not visible on viewport or the click event intercepted
   *                        by another element
   * @param {Element} element The target element for click (tap) event
   */
  @Platform({ desktop: true, lite: true })
  async click(element: Element): Promise<void> {
    const testStep = new RunnerTestStep('click');

    try {
      await this.eventManager.emit(EventType.BEFORE_STEP, { step: testStep });
    } catch (ignored) {
      this.logger.warn(`Failed to execute before step! ${ignored}`);
    }

    this.logger.info(`Clicking element with ${element.defaultSelector.toString()}...`);
    testStep.args['element'] = element.defaultSelector.toString();

    // Update test step start time
    testStep.startNow();

    // Get the element with self-healing logic and update test step data
    try {
      const { element: el, selector, selfHealing } = await this.getElementWithSelfHealing(element);
      testStep.args['element'] = `${selector.toString()}${selfHealing ? ' (self-healing)' : ''}`;

      try {
        await el.click();
        testStep.markAsPassed();

        // Update test step end time and duration string
        testStep.endNow();
        testStep.generateDuration();
        this.runner.testCases[this.runner.currentTestCaseIndex].testSteps.push(testStep);
        this.logger.info('Success - Element has been clicked!');
        try {
          await this.eventManager.emit(EventType.AFTER_STEP, { step: testStep });
        } catch (ignored) {
          this.logger.warn(`[ERR3002] Failed to execute after step! ${ignored}`);
        }
      } catch (innerErr) {
        throw new RuntimeError(
          'ERR2006',
          'Element click action is intercepted because there is another element on top of it!',
          selector,
        );
      }
    } catch (err) {
      // Mark as failed and throw the error up
      testStep.markAsFailed();
      testStep.endNow();
      testStep.generateDuration();
      this.runner.testCases[this.runner.currentTestCaseIndex].testSteps.push(testStep);
      this.logger.error(
        'FAILED - Element is either not visible or positioned behind another element!',
      );
      try {
        await this.eventManager.emit(EventType.AFTER_STEP, { step: testStep });
      } catch (ignored) {
        this.logger.warn(`[ERR3002] Failed to execute after step! ${ignored}`);
      }
      throw err;
    }
  }

  /**
   * Perform back action (back button on mobile devices or left arrow button on web browser).
   *
   * @async
   * @version 1.0.0
   * @since 1.0.0
   * @author Joshua Lauwrich Nandy
   */
  @Platform({ desktop: true, lite: true })
  async back(): Promise<void> {
    const testStep = new RunnerTestStep('back');
    try {
      await this.eventManager.emit(EventType.BEFORE_STEP, { step: testStep });
    } catch (ignored) {
      this.logger.warn(`Failed to execute before step! ${ignored}`);
    }
    // Update test step start time
    testStep.startNow();

    await this.driver.getDriverInstance()!.back();

    testStep.endNow();
    testStep.generateDuration();
    testStep.markAsPassed();

    this.logger.info('Success - Back navigation!');

    try {
      await this.eventManager.emit(EventType.AFTER_STEP, { step: testStep });
    } catch (ignored) {
      this.logger.warn(`[ERR3002] Failed to execute after step! ${ignored}`);
    }
  }

  /**
   * Verify if the given element contains the expected text. If you want to verify part of the
   * text, you can use regex and set "isRegex" param to "true".
   *
   * @async
   * @version 1.0.0
   * @since 1.0.0
   * @author Joshua Lauwrich Nandy
   * @throws {RuntimeError} When the element is not exist or not displayed in the viewport
   * @param {Element} element The element that will be verified
   * @param {(string | RegExp)} text The expected text to match with element text or a regex
   *                                 instance that will be tested against element text.
   */
  @Platform({ desktop: true, lite: true })
  async verifyElementText(element: Element, text: string | RegExp): Promise<void> {
    const testStep = new RunnerTestStep('verifyElementText');
    try {
      await this.eventManager.emit(EventType.BEFORE_STEP, { step: testStep });
    } catch (ignored) {
      this.logger.warn(`Failed to execute before step! ${ignored}`);
    }

    this.logger.info(
      `Verifying element with ${element.defaultSelector.toString()} has text: ${text} ${typeof text !== 'string' ? ' [regex]' : ''}...`,
    );
    testStep.args['element'] = element.defaultSelector.toString();
    testStep.args['text'] = text.toString() + (typeof text !== 'string' ? '[regex]' : '');

    // Update test step start time
    testStep.startNow();

    // Get the element with self-healing logic and update test step data
    try {
      const { element: el, selector, selfHealing } = await this.getElementWithSelfHealing(element);
      testStep.args['element'] = `${selector.toString()}${selfHealing ? ' (self-healing)' : ''}`;

      const elementText = await el.getText();
      let isMatch: boolean;

      if (typeof text === 'string') {
        isMatch = elementText == text;
      } else {
        isMatch = text.test(elementText);
      }

      assert.strictEqual(
        isMatch,
        true,
        new RuntimeError(
          'ERR2007',
          `Failed to match element text\n+ Actual - Expected\n+ ${elementText} \n- ${text}${typeof text !== 'string' ? ' [regex]' : ''}\n`,
          selector,
        ),
      );

      testStep.markAsPassed();

      // Update test step end time and duration string
      testStep.endNow();
      testStep.generateDuration();
      this.runner.testCases[this.runner.currentTestCaseIndex].testSteps.push(testStep);
      this.logger.info('Success - Element text match with expected text!');
      try {
        await this.eventManager.emit(EventType.AFTER_STEP, { step: testStep });
      } catch (ignored) {
        this.logger.warn(`[ERR3002] Failed to execute after step! ${ignored}`);
      }
    } catch (err) {
      // Mark as failed and throw the error up
      testStep.markAsFailed();
      testStep.endNow();
      testStep.generateDuration();
      this.runner.testCases[this.runner.currentTestCaseIndex].testSteps.push(testStep);
      try {
        await this.eventManager.emit(EventType.AFTER_STEP, { step: testStep });
      } catch (ignored) {
        this.logger.warn(`[ERR3002] Failed to execute after step! ${ignored}`);
      }
      throw err;
    }
  }

  private async getElementWithSelfHealing(
    element: Element,
    timeout?: number,
  ): Promise<{
    element: WebdriverIO.Element;
    selector: BaseSelector;
    selfHealing: boolean;
  }> {
    let el = await this.driver.getDriverInstance()!.$(
      // If there is self-healing suggestion from previous search, use it instead
      // searching from scratch to reduce time spent.
      (element.selfHealingSuggestion && element.selfHealingSelector
        ? element.selfHealingSelector
        : element.defaultSelector
      ).convertToWdioSelector(),
    );
    try {
      await el.waitForExist({
        timeout: timeout ? timeout * 1000 : this.config.waitForTimeout,
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
              timeout: timeout ? timeout * 1000 : this.config.waitForTimeout,
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
        throw new RuntimeError('ERR2003', 'No such element', element.defaultSelector);
      } else {
        this.logger.warn('Self healing is disabled!');
        throw new RuntimeError('ERR2003', 'No such element', element.defaultSelector);
      }
    }
  }
}

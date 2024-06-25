import { BaseConfig } from '../config/index.js';
import { BaseSelector, Element } from '../element/index.js';
import { RuntimeError } from '../error/index.js';
import { Logger } from '../logger/index.js';
import { Runner, RunnerTestStep } from '../runner/index.js';
import { TestStatus } from '../type/index.js';
import { VisibilityInterface } from './interface/visibility.interface.js';

export class BaseKeyword implements VisibilityInterface {
  protected driver: WebdriverIO.Browser;
  protected logger: Logger;
  protected runner: Runner;
  protected config: BaseConfig;

  constructor(driver: WebdriverIO.Browser, runner: Runner, logger: Logger, config: BaseConfig) {
    this.driver = driver;
    this.runner = runner;
    this.logger = logger;
    this.config = config;
  }

  async verifyElementNotVisible(element: Element): Promise<void> {
    this.logger.info(
      `Verifying element with ${element.defaultSelector.toString()} is not visible...`,
    );
    // Initialize test step object
    const testStep = new RunnerTestStep('verifyElementNotVisible');

    // Update test step args and start time
    testStep.args['element'] = `${element.defaultSelector.toString()}`;
    testStep.startNow();

    // Get the element from driver and check whether it is displayed or not
    const el = await this.driver.$(element.defaultSelector.convertToWdioSelector());
    const isDisplayed = !el.error && (await el.isDisplayed());

    // Update test step end time and duration string
    testStep.endNow();
    testStep.generateDuration();

    if (isDisplayed) {
      // If displayed then it is not match with expected result, thus mark as failed and throw error
      testStep.status = TestStatus.FAILED;
      this.runner.testCases[this.runner.currentTestCaseIndex].testSteps.push(testStep);
      this.logger.error('FAILED - Element is visible!');
      throw new RuntimeError('Element is visible!', element.defaultSelector);
    }

    // Else, it is the same as expected result, thus mark as passed
    testStep.status = TestStatus.SUCCESS;
    this.runner.testCases[this.runner.currentTestCaseIndex].testSteps.push(testStep);

    this.logger.info('Success - Element is not visible!');
  }

  async verifyElementVisible(element: Element): Promise<void> {
    this.logger.info(`Verifying element with ${element.defaultSelector.toString()} is visible...`);
    // Initialize test step object
    const testStep = new RunnerTestStep('verifyElementVisible');

    // Update test step start time
    testStep.startNow();

    // Get the element with self-healing logic and update test step data
    const { element: el, selector, selfHealing } = await this.getElementWithSelfHealing(element);
    testStep.args['element'] = `${selector.toString()}${selfHealing ? ' (self-healing)' : ''}`;

    const isDisplayed = await el.isDisplayed();

    // Update test step end time and duration string
    testStep.endNow();
    testStep.generateDuration();

    if (isDisplayed) {
      // Same as expected result, mark as passed
      testStep.status = TestStatus.SUCCESS;
      this.runner.testCases[this.runner.currentTestCaseIndex].testSteps.push(testStep);
      this.logger.info('Success - Element is visible!');
    } else {
      // Else, the element not visible, thus mark as failed
      testStep.status = TestStatus.FAILED;
      this.runner.testCases[this.runner.currentTestCaseIndex].testSteps.push(testStep);
      this.logger.error('FAILED - Element is not visible!');
      throw new RuntimeError('Element is not visible!', element.defaultSelector);
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
    const el = await this.driver.$(element.defaultSelector.convertToWdioSelector());
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
      testStep.status = TestStatus.SUCCESS;
      this.runner.testCases[this.runner.currentTestCaseIndex].testSteps.push(testStep);
      this.logger.info(
        `Success - Element is not visible within ${(this.config.waitForTimeout / 1000).toFixed(0)} second(s)!`,
      );
      return true;
    } else {
      // Else, the element is visible, thus mark as failed
      testStep.status = TestStatus.FAILED;
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
    testStep.args['element'] = `${element.defaultSelector.toString()}`;
    testStep.args['timeout'] = timeout ? timeout.toString() : 'undefined';
    testStep.startNow();

    // Get the element with self-healing logic and update test step data
    const { element: el, selector, selfHealing } = await this.getElementWithSelfHealing(element);
    testStep.args['element'] = `${selector.toString()}${selfHealing ? ' (self-healing)' : ''}`;

    const isDisplayed = await el.isDisplayed();

    // Update test step end time and duration string
    testStep.endNow();
    testStep.generateDuration();

    if (isDisplayed) {
      // Same as expected result, mark as passed
      testStep.status = TestStatus.SUCCESS;
      this.runner.testCases[this.runner.currentTestCaseIndex].testSteps.push(testStep);
      this.logger.info(
        `Success - Element is visible within ${(this.config.waitForTimeout / 1000).toFixed(0)} second(s)!`,
      );
      return true;
    } else {
      // Else, the element is visible, thus mark as failed
      testStep.status = TestStatus.FAILED;
      this.runner.testCases[this.runner.currentTestCaseIndex].testSteps.push(testStep);
      this.logger.error(
        `FAILED - Element is not visible within ${(this.config.waitForTimeout / 1000).toFixed(0)} second(s)!`,
      );
      return false;
    }
  }

  private async getElementWithSelfHealing(element: Element): Promise<{
    element: WebdriverIO.Element;
    selector: BaseSelector;
    selfHealing: boolean;
  }> {
    let el = await this.driver.$(element.defaultSelector.convertToWdioSelector());
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
          el = await this.driver.$(selector.convertToWdioSelector());
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

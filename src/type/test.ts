import { BaseDriver } from '../driver/index.js';
import { Runner } from '../runner/index.js';

export type TestSuiteMetaData = {
  name: string;
  id: string;
};

export type TestSuiteContext = {
  testSuiteName: string;
  testSuiteId: string;
  runner: Runner;
};

export type TestCaseContext = {
  driver: BaseDriver;
};

export type TestCaseMethod = (context: TestCaseContext) => Promise<void>;

export enum TestStatus {
  SKIPPED,
  FAILED,
  SUCCESS,
}

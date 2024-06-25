import { Runner } from '../runner/index.js';

export type ListenerContext = {
  testSuiteName: string;
  testSuiteId: string;
  runner: Runner;
};

export enum EventType {
  BEFORE_SUITE = 'BEFORE_SUITE',
  AFTER_SUITE = 'AFTER_SUITE',
  SUITE_PASSED = 'SUITE_PASSED',
  SUITE_FAILED = 'SUITE_FAILED',
  BEFORE_CASE = 'BEFORE_CASE',
  AFTER_CASE = 'AFTER_CASE',
  CASE_PASSED = 'CASE_PASSED',
  CASE_FAILED = 'CASE_FAILED',
}

export type EventHandlerType = {
  [EventType.BEFORE_SUITE]: ListenerContext;
  [EventType.AFTER_SUITE]: ListenerContext;
  [EventType.BEFORE_CASE]: ListenerContext;
  [EventType.AFTER_CASE]: ListenerContext;
};

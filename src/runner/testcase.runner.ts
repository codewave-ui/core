import { DateTime } from 'luxon';
import { TestCaseMethod, TestStatus } from '../base.test.js';
import { convertTimeMillisToPrettyString } from '../helper.js';
import { RunnerHook } from './hook.runner.js';
import { RunnerTestStep } from './teststep.runner.js';

export class RunnerTestCase {
  private readonly _enabled: boolean;
  private readonly _method: TestCaseMethod;
  private readonly _beforeHooks: Array<RunnerHook>;
  private readonly _afterHooks: Array<RunnerHook>;

  constructor(name: string, id: string, method: TestCaseMethod, enabled?: boolean) {
    this._name = name;
    this._id = id;
    this._testSteps = [];
    this._beforeHooks = [];
    this._afterHooks = [];
    this._method = method;
    this._enabled = enabled === undefined ? true : enabled;
    this._status = TestStatus.SKIPPED;
    this._duration = '0 second';
  }

  get beforeHooks(): Array<RunnerHook> {
    return this._beforeHooks;
  }

  get afterHooks(): Array<RunnerHook> {
    return this._afterHooks;
  }

  private _name: string;

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  private _id: string;

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  private _start: number = 0;

  get start(): number {
    return this._start;
  }

  private _end: number = 0;

  get end(): number {
    return this._end;
  }

  private _duration: string;

  get duration(): string {
    return this._duration;
  }

  set duration(value: string) {
    this._duration = value;
  }

  private _status: TestStatus;

  get status(): TestStatus {
    return this._status;
  }

  private _exception?: string;

  get exception(): string | undefined {
    return this._exception;
  }

  set exception(value: string) {
    this._exception = value;
  }

  private _screenshot?: string;

  get screenshot(): string | undefined {
    return this._screenshot;
  }

  set screenshot(value: string) {
    this._screenshot = value;
  }

  private _testSteps: Array<RunnerTestStep>;

  get testSteps(): Array<RunnerTestStep> {
    return this._testSteps;
  }

  set testSteps(value: Array<RunnerTestStep>) {
    this._testSteps = value;
  }

  get method(): TestCaseMethod {
    return this._method;
  }

  get enabled(): boolean {
    return this._enabled;
  }

  public startNow() {
    this._start = DateTime.now().toMillis();
  }

  public endNow() {
    this._end = DateTime.now().toMillis();
  }

  public generateDuration() {
    this._duration = convertTimeMillisToPrettyString(this._end - this._start);
  }

  public markAsPassed() {
    this._status = TestStatus.SUCCESS;
  }

  public markAsFailed() {
    this._status = TestStatus.FAILED;
  }
}

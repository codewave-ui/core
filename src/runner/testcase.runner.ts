import { DateTime } from 'luxon';
import { convertTimeMillisToPrettyString } from '../helper.js';
import { TestCaseMethod, TestStatus } from '../type/index.js';
import { RunnerTestStep } from './teststep.runner.js';

export class RunnerTestCase {
  private readonly _enabled: boolean;
  private readonly _method: TestCaseMethod;

  constructor(name: string, id: string, method: TestCaseMethod, enabled?: boolean) {
    this._name = name;
    this._id = id;
    this._testSteps = [];
    this._method = method;
    this._enabled = enabled === undefined ? true : enabled;
    this._status = TestStatus.SKIPPED;
    this._duration = '0 second';
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

  set start(value: number) {
    this._start = value;
  }

  private _end: number = 0;

  get end(): number {
    return this._end;
  }

  set end(value: number) {
    this._end = value;
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

  set status(value: TestStatus) {
    this._status = value;
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
}

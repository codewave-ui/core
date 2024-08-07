import { DateTime } from 'luxon';
import { TestStatus } from '../base.test.js';
import { convertTimeMillisToPrettyString } from '../helper.js';

export class RunnerTestStep {
  constructor(name: string) {
    this._name = name;
    this._status = TestStatus.SKIPPED;
    this._args = {};
    this._duration = '0 second';
  }

  private _name: string;

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  private _args: Record<string, string>;

  get args(): Record<string, string> {
    return this._args;
  }

  set args(value: Record<string, string>) {
    this._args = value;
  }

  private _start: number = 0;

  get start(): number {
    return this._start;
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

  private _status: TestStatus;

  get status(): TestStatus {
    return this._status;
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

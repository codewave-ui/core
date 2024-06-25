import { DateTime } from 'luxon';
import { convertTimeMillisToPrettyString } from '../helper.js';
import { TestStatus } from '../type/index.js';

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

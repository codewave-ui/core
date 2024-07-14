import { DateTime } from 'luxon';
import { TestStatus } from '../base.test.js';
import { convertTimeMillisToPrettyString } from '../helper.js';

export class RunnerHook {
  private readonly _name: string;

  constructor(name: string) {
    this._name = name;
    this._duration = '0 second';
    this._status = TestStatus.SKIPPED;
  }

  get name(): string {
    return this._name;
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

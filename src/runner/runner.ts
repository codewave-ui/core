import { DateTime } from 'luxon';
import { Element } from '../element/index.js';
import { convertTimeMillisToPrettyString } from '../helper.js';
import { TestStatus } from '../type/index.js';
import { RunnerTestCase } from './testcase.runner.js';

export class Runner {
  constructor(name: string, id: string) {
    this._name = name;
    this._id = id;
    this._testCases = [];
    this._currentTestCaseIndex = 0;
    this._status = TestStatus.SKIPPED;
    this._selfHealingElement = [];
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

  private _testCases: Array<RunnerTestCase>;

  get testCases(): Array<RunnerTestCase> {
    return this._testCases;
  }

  set testCases(value: Array<RunnerTestCase>) {
    this._testCases = value;
  }

  private _currentTestCaseIndex: number;

  get currentTestCaseIndex(): number {
    return this._currentTestCaseIndex;
  }

  set currentTestCaseIndex(value: number) {
    this._currentTestCaseIndex = value;
  }

  private _status: TestStatus;

  get status(): TestStatus {
    return this._status;
  }

  set status(value: TestStatus) {
    this._status = value;
  }

  private _selfHealingElement: Element[];

  get selfHealingElement(): Element[] {
    return this._selfHealingElement;
  }

  set selfHealingElement(value: Element[]) {
    this._selfHealingElement = value;
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

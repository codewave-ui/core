import * as fs from 'node:fs';
import { Logger } from '../logger/index.js';
import { LogLevelConfig, SelectorElement, ServerConfig } from '../type/index.js';

export class BaseConfig {
  constructor(logger: Logger, platform: Platform) {
    this._logger = logger;
    this._platform = platform;
    this._logLevel = 'silent';
    this._parallelExecution = 1;
    this._desiredCapabilities = {};
    this._connectionRetryTimeout = 120000;
    this._connectionRetryCount = 3;
    this._waitForInterval = 500;
    this._waitForTimeout = 3000;
    this._defaultSelector = 'xpath';
    this._isSelfHealingEnable = true;
  }

  private _logger: Logger;

  get logger(): Logger {
    return this._logger;
  }

  set logger(value: Logger) {
    this._logger = value;
  }

  private _platform: Platform;

  get platform(): Platform {
    return this._platform;
  }

  set platform(value: Platform) {
    this._platform = value;
  }

  private _server?: ServerConfig;

  get server(): ServerConfig | undefined {
    return this._server;
  }

  set server(value: ServerConfig | undefined) {
    this._server = value;
  }

  private _logLevel: LogLevelConfig;

  get logLevel(): LogLevelConfig {
    return this._logLevel;
  }

  set logLevel(value: LogLevelConfig) {
    this._logLevel = value;
  }

  private _parallelExecution: number;

  get parallelExecution(): number {
    return this._parallelExecution;
  }

  set parallelExecution(value: number) {
    this._parallelExecution = value;
  }

  private _desiredCapabilities: Record<string, unknown>;

  get desiredCapabilities(): Record<string, unknown> {
    return this._desiredCapabilities;
  }

  set desiredCapabilities(value: Record<string, unknown>) {
    this._desiredCapabilities = value;
  }

  private _connectionRetryTimeout: number;

  get connectionRetryTimeout(): number {
    return this._connectionRetryTimeout;
  }

  set connectionRetryTimeout(value: number) {
    this._connectionRetryTimeout = value;
  }

  private _connectionRetryCount: number;

  get connectionRetryCount(): number {
    return this._connectionRetryCount;
  }

  set connectionRetryCount(value: number) {
    this._connectionRetryCount = value;
  }

  private _waitForTimeout: number;

  get waitForTimeout(): number {
    return this._waitForTimeout;
  }

  set waitForTimeout(value: number) {
    this._waitForTimeout = value;
  }

  private _waitForInterval: number;

  get waitForInterval(): number {
    return this._waitForInterval;
  }

  set waitForInterval(value: number) {
    this._waitForInterval = value;
  }

  private _defaultSelector: SelectorElement['name'];

  get defaultSelector(): SelectorElement['name'] {
    return this._defaultSelector;
  }

  set defaultSelector(value: SelectorElement['name']) {
    this._defaultSelector = value;
  }

  private _isSelfHealingEnable: boolean;

  get isSelfHealingEnable(): boolean {
    return this._isSelfHealingEnable;
  }

  set isSelfHealingEnable(value: boolean) {
    this._isSelfHealingEnable = value;
  }

  loadFromFile(path: string) {
    if (!fs.existsSync(path)) {
      throw new Error('Config file not exist on ' + path);
    }

    const content = fs.readFileSync(path, { encoding: 'utf-8' });
    const parsedContent = JSON.parse(content) as this;

    this.parallelExecution = parsedContent._parallelExecution;
    this.desiredCapabilities = parsedContent._desiredCapabilities;
    this.logLevel = parsedContent._logLevel;
    this.server = parsedContent._server;
    this.platform = parsedContent._platform;
    this.connectionRetryCount = parsedContent._connectionRetryCount;
    this.connectionRetryTimeout = parsedContent._connectionRetryTimeout;
    this.waitForInterval = parsedContent._waitForInterval;
    this.waitForTimeout = parsedContent._waitForTimeout;
    this.defaultSelector = parsedContent._defaultSelector;

    this.logger.info('Config loaded from ' + path);
    return parsedContent;
  }

  saveToFile(path: string) {
    fs.writeFileSync(path, JSON.stringify({ ...this, _logger: undefined }), {
      encoding: 'utf-8',
    });
  }

  isAndroidPlatform() {
    return this._platform === Platform.MOBILE_ANDROID;
  }

  isIosPlatform() {
    return this._platform === Platform.MOBILE_IOS;
  }

  isDesktopPlatform() {
    return this._platform === Platform.WEB_DESKTOP;
  }

  isLitePlatform() {
    return this._platform === Platform.WEB_LITE;
  }

  isWebPlatform() {
    return this.isDesktopPlatform() || this.isLitePlatform();
  }

  isMobilePlatform() {
    return this.isAndroidPlatform() || this.isIosPlatform();
  }
}

export enum Platform {
  WEB_DESKTOP = 'desktop',
  WEB_LITE = 'lite',
  MOBILE_ANDROID = 'android',
  MOBILE_IOS = 'ios',
}

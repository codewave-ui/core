import fs from 'node:fs';
import { SelectorElement } from '../element/index.js';
import { BaseListener } from '../listener/index.js';

export class Config {
  public platform: Platform;
  public server?: ServerConfig;
  public logLevel: LogLevelConfig;
  public parallelExecution: number;
  public desiredCapabilities: Record<string, unknown>;
  public connectionRetryTimeout: number;
  public connectionRetryCount: number;
  public waitForTimeout: number;
  public waitForInterval: number;
  public defaultSelector: SelectorElement['name'];
  public isSelfHealingEnable: boolean;

  public listeners: (typeof BaseListener)[];

  constructor(platform: Platform) {
    this.platform = platform;
    this.logLevel = 'silent';
    this.parallelExecution = 1;
    this.desiredCapabilities = {};
    this.connectionRetryTimeout = 120000;
    this.connectionRetryCount = 3;
    this.waitForInterval = 500;
    this.waitForTimeout = 3000;
    this.defaultSelector = 'xpath';
    this.isSelfHealingEnable = true;
    this.listeners = [];
  }

  isAndroidPlatform() {
    return this.platform === Platform.MOBILE_ANDROID;
  }

  isIosPlatform() {
    return this.platform === Platform.MOBILE_IOS;
  }

  isDesktopPlatform() {
    return this.platform === Platform.WEB_DESKTOP;
  }

  isLitePlatform() {
    return this.platform === Platform.WEB_LITE;
  }

  isWebPlatform() {
    return this.isDesktopPlatform() || this.isLitePlatform();
  }

  isMobilePlatform() {
    return this.isAndroidPlatform() || this.isIosPlatform();
  }

  loadFromFile(path: string) {
    if (!fs.existsSync(path)) {
      throw new Error('[ERR0001] Config file not exist on ' + path);
    }

    const content = fs.readFileSync(path, { encoding: 'utf-8' });
    const parsedContent = JSON.parse(content) as this;

    if (parsedContent.parallelExecution) this.parallelExecution = parsedContent.parallelExecution;
    if (parsedContent.desiredCapabilities)
      this.desiredCapabilities = parsedContent.desiredCapabilities;
    if (parsedContent.logLevel) this.logLevel = parsedContent.logLevel;
    if (parsedContent.server) this.server = parsedContent.server;
    if (parsedContent.platform) this.platform = parsedContent.platform;
    if (parsedContent.connectionRetryCount)
      this.connectionRetryCount = parsedContent.connectionRetryCount;
    if (parsedContent.connectionRetryTimeout)
      this.connectionRetryTimeout = parsedContent.connectionRetryTimeout;
    if (parsedContent.waitForInterval) this.waitForInterval = parsedContent.waitForInterval;
    if (parsedContent.waitForTimeout) this.waitForTimeout = parsedContent.waitForTimeout;
    if (parsedContent.defaultSelector) this.defaultSelector = parsedContent.defaultSelector;
    if (parsedContent.isSelfHealingEnable)
      this.isSelfHealingEnable = parsedContent.isSelfHealingEnable;

    return parsedContent;
  }

  saveToFile(path: string) {
    fs.writeFileSync(path, JSON.stringify(this), {
      encoding: 'utf-8',
    });
  }
}

export enum Platform {
  WEB_DESKTOP = 'desktop',
  WEB_LITE = 'lite',
  MOBILE_ANDROID = 'android',
  MOBILE_IOS = 'ios',
}

export type ServerConfig = {
  host?: string;
  port?: number;
  path?: string;
  protocol?: string;
};

export type LogLevelConfig = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'silent';

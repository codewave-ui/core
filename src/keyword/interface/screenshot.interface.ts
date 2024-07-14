import { Element } from '../../element/index.js';

export type ScreenshotInterface = {
  takePageScreenshot(folderPath: string, filename: string): Promise<string>;
  takeElementScreenshot(element: Element, folderPath: string, filename: string): Promise<string>;
};

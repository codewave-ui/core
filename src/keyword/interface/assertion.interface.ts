import { Keyword } from '../index.js';

export type AssertionInterface = {
  assertKeywordThrowException(
    methodName: Exclude<keyof Keyword, keyof AssertionInterface>,
    expectedError: string,
    ...args: Parameters<Keyword[Exclude<keyof Keyword, keyof AssertionInterface>]>
  ): Promise<void>;

  assertFunctionThrowException<T extends (...args: any) => any>(
    fn: T,
    expectedError: string,
    ...args: Parameters<T>
  ): Promise<void>;

  assertKeywordNotThrowException(
    methodName: Exclude<keyof Keyword, keyof AssertionInterface>,
    ...args: Parameters<Keyword[Exclude<keyof Keyword, keyof AssertionInterface>]>
  ): Promise<void>;

  assertFunctionNotThrowException<T extends (...args: any) => any>(
    fn: T,
    ...args: Parameters<T>
  ): Promise<void>;
};

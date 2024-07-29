import { ListenerContext, StepListenerContext } from '../listener/index.js';

export * from './factory.event.js';

export enum EventType {
  BEFORE_SUITE = 'BEFORE_SUITE',
  AFTER_SUITE = 'AFTER_SUITE',
  BEFORE_CASE = 'BEFORE_CASE',
  AFTER_CASE = 'AFTER_CASE',
  BEFORE_STEP = 'BEFORE_STEP',
  AFTER_STEP = 'AFTER_STEP',
}

export type EventHandlerType = {
  [EventType.BEFORE_SUITE]: ListenerContext;
  [EventType.AFTER_SUITE]: ListenerContext;
  [EventType.BEFORE_CASE]: ListenerContext;
  [EventType.AFTER_CASE]: ListenerContext;
  [EventType.BEFORE_STEP]: StepListenerContext;
  [EventType.AFTER_STEP]: StepListenerContext;
};

import { EventEmitter as Emitter } from 'events';

export class EventEmitter<T extends string> extends Emitter {
  on: (event: T, listener: (...args: any[]) => void) => this;
  once: (event: T, listener: (...args: any[]) => void) => this;
};

type CoreEvent = "";
export const core = new EventEmitter<CoreEvent>();

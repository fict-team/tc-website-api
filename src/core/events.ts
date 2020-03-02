import { EventEmitter as Emitter } from 'events';

export class EventEmitter extends Emitter {};

export const core = new EventEmitter();

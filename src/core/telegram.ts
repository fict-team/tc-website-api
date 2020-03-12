import { Telegraf, ContextMessageUpdate } from "telegraf";
import { Setting } from "./settings";

export interface IBotDescription {
  id: string;
  token: Setting<string>;
};

export interface IBot<T extends ContextMessageUpdate = ContextMessageUpdate> extends Telegraf<T> {
  isRunning?: boolean;
};

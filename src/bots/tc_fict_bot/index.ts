import Telegraf, { ContextMessageUpdate } from 'telegraf';

import { IBot, IBotDescription } from "../../core/telegram";
import { Setting, SettingType } from "../../core/settings";

export interface IContextUpdate extends ContextMessageUpdate {};

export const description: IBotDescription = {
  id: 'tc_fict_bot',
  token: Setting.create<string>('tokens.telegram.tc_fict_bot', SettingType.STRING, null),
};

const bot = new Telegraf() as IBot<IContextUpdate>;
export default bot;

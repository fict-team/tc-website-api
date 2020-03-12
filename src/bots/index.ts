import glob from 'glob';
import { IBot, IBotDescription } from '../core/telegram';

const routes = glob.sync(`${__dirname}/*/index.js`);

type BotContainer = { bot: IBot, description: IBotDescription };

const bots: BotContainer[] = []

export const loadBots = () => routes.forEach((route) => { 
  const { default: bot, description } = require(route);
  bots.push({ bot, description });
});

export const getBots = () => bots;

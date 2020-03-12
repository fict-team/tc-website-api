import './requirements';
import 'reflect-metadata';
import { createConnection } from './db';
import app from './app';
import logger from './core/logger';
import { Setting } from './core/settings';
import { loadBots, getBots } from './bots';

loadBots();

const initializeBots = async () => {
  const bots = getBots();

  for (let i = 0; i < bots.length; i++) {
    const { bot, description } = bots[i];
    const { id, token } = description;
    const tokenValue = await token.get();

    if (!tokenValue) {
      logger.info('Bot token is missing, skipping', { bot: id, setting: `${token.category}.${token.key}` });
      continue;
    }

    bot.token = tokenValue;
    await bot.launch();

    bot.isRunning = true;

    const u = await bot.telegram.getMe();
    bot.options.username = u.username;

    logger.info(`Launched '${id}' Telegram bot`, { id: u.id, username: u.username, displayName: u.first_name });
  }
};

createConnection()
  .then(async (connection) => {
    logger.info('Connection to the database was established', { database: connection.driver.database });

    await Setting.initialize(connection);
    logger.info('Global settings were initialized');

    await initializeBots();

    const port = process.env.PORT ?? 3000;
    app.listen(port, () => {
      logger.info(`Server is listening`, { port });
    });
  })
  .catch((err) => logger.error(`Failed to establish connection to the database`, { error: err.message ?? err.toString() }));
  
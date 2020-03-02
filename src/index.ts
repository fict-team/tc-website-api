import './requirements';
import 'reflect-metadata';
import { createConnection } from './db';
import app from './app';
import logger from './core/logger';
import { Setting } from './core/settings';

createConnection()
  .then(async (connection) => {
    logger.info('Connection to the database was established', { database: connection.driver.database });

    await Setting.initialize(connection);
    logger.info('Global settings were initialized');

    const port = process.env.PORT ?? 3000;
    app.listen(port, () => {
      logger.info(`Server is listening`, { port });
    });
  })
  .catch((err) => logger.error(`Failed to establish connection to the database`, { error: err.message ?? err.toString() }));
  
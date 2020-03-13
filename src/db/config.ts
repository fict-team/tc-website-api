import { ConnectionOptions } from 'typeorm';

const options: ConnectionOptions = {
  type: 'postgres',
  host: process.env.DB_HOST ?? '127.0.0.1',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5433,
  username: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.DB_NAME ?? 'postgres',
  logging: process.env.LOG_LEVEL === 'debug',
  synchronize: true,
  entities: [
    `${__dirname}/entities/*.js`,
  ],
};

export default options;

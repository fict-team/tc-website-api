import express from 'express';
import glob from 'glob';
import cors from 'cors';

import errorHandling from './middlewares/errorHandling';
import { Route } from './core/api';

const app = express();
app.use(express.json());
app.use(cors());

const routes = glob.sync(`${__dirname}/routes/**/*.js`);

for (let i = 0; i < routes.length; i++) {
  const { default: RouteController } = require(routes[i]);

  if (!RouteController) { continue; }

  const route = new RouteController() as Route;
  route.initialize(app);
}

app.use(errorHandling());
export default app;

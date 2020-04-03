import express from 'express';
import glob from 'glob';
import cors from 'cors';

import errorHandling from './middlewares/errorHandling';
import fingerprint from './middlewares/fingerprint';
import { Route } from './core/api';

const app = express();
app.set('trust proxy', true);
app.use(express.json());
app.use(cors());
app.use(fingerprint());

const routes = glob.sync(`${__dirname}/routes/**/*.js`);

for (let i = 0; i < routes.length; i++) {
  const { default: RouteController } = require(routes[i]);

  if (!RouteController) { continue; }

  const route = new RouteController() as Route;
  route.initialize(app);
}

app.use(errorHandling());
export default app;

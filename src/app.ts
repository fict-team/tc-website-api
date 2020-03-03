import express from 'express';
import glob from 'glob';

import errorHandling, { asyncHandle } from './middlewares/errorHandling';
import requestValidation from './middlewares/requestValidation';
import { IRouteDescription } from './core/api';

const app = express();
app.use(express.json());

const routes = glob.sync(`${__dirname}/routes/**/*.js`);

for (let i = 0; i < routes.length; i++) {
  const route = routes[i];
  const { default: fn, description } = require(route);
  const { url, validation, middlewares, async: isAsync, method } = description as IRouteDescription;

  let middleware = [];

  if (validation) { 
    middleware.push(validation); 
    middleware.push(requestValidation());
  }

  if (middlewares && middlewares.length > 0) {
    middleware = middleware.concat(middlewares);
  }

  app[method](url, ...middleware, isAsync ? asyncHandle(fn): fn);
}

app.use(errorHandling());
export default app;

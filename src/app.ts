import express from 'express';

import errorHandling, { asyncHandle } from './middlewares/errorHandling';
import requestValidation from './middlewares/requestValidation';

const app = express();
app.use(express.json());

const routes = [
  {
    url: '/api/token',
    path: './routes/api/token',
    method: 'post',
    async: true,
    middlewares: [],
  },
  {
    url: '/api/token/refresh',
    path: './routes/api/token/refresh',
    method: 'post',
    async: true,
  },
];

for (let i = 0; i < routes.length; i++) {
  const route = routes[i];
  const { default: fn, validation } = require(route.path);

  let middleware = [];

  if (validation) { 
    middleware.push(validation); 
    middleware.push(requestValidation());
  }

  if (route.middlewares) {
    middleware = middleware.concat(route.middlewares);
  }

  app[route.method](route.url, ...middleware, route.async ? asyncHandle(fn): fn);
}

app.use(errorHandling());
export default app;

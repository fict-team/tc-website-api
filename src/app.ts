import express from 'express';

import errorHandling, { asyncHandle } from './middlewares/errorHandling';
import requestValidation from './middlewares/requestValidation';
import apiToken, { validation as apiTokenValidation } from './routes/api/token';

const app = express();
app.use(express.json());

app.post('/api/token', apiTokenValidation, requestValidation(), asyncHandle(apiToken));

app.use(errorHandling());
export default app;

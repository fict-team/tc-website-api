import { Express, Request, Response, NextFunction } from 'express';
import { User } from '../db/entities/User';
import { ValidationChain } from 'express-validator';
import { asyncHandle } from '../middlewares/errorHandling';
import requestValidation from '../middlewares/requestValidation';

export interface IRequest extends Request {
  user?: User;
};

export interface IResponse extends Response {};

export enum RequestMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
  PATCH = 'patch',
  HEAD = 'head',
  ALL = 'all'
};

export type RouteMiddleware = (...args) => any;

export class Route {
  public url: string;
  public method: RequestMethod;
  public middlewares?: RouteMiddleware[];
  public validation?: ValidationChain[];
  public async?: boolean;

  public onRequest(req: IRequest, res: IResponse, next: NextFunction): Promise<any> | any {};

  public initialize(app: Express) {
    let middleware = [];

    if (this.validation) {
      middleware.push(this.validation); 
      middleware.push(requestValidation());
    }

    if (this.middlewares && this.middlewares.length > 0) {
      middleware = middleware.concat(this.middlewares);
    }

    app[this.method](this.url, ...middleware, this.async ? asyncHandle(this.onRequest): this.onRequest);
  }
};

import { Request, Response } from 'express';
import { User } from '../db/entities/User';
import { ValidationChain } from 'express-validator';

export interface IRequest extends Request {
  user?: User;
};

export interface IResponse extends Response {};

export interface IRouteDescription {
  url: string;
  method: string;
  middlewares?: ((...args) => any)[];
  validation?: ValidationChain[];
  async?: boolean;
};
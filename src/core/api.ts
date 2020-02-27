import { Request, Response } from 'express';
import { User } from '../db/entities/User';

export interface IRequest extends Request {
  user?: User;
};

export interface IResponse extends Response {};

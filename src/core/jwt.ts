import jwt from 'jsonwebtoken';
import { RefreshToken } from '../db/entities/RefreshToken';
import { UserPermission  } from '../db/entities/User';

export interface ITokenPayload {
  id: number;
  username: string;
  permissions: UserPermission[];
};

// TODO: token expiration time should be in global config

const secret = process.env.SECRET;
export const encode = (payload: ITokenPayload) => jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn: '15m' });
export const decode = (token) => jwt.verify(token, secret, { algorithms: ['HS256'] });

/** Generates access token, generates and saves refresh token to the database. */
export const createTokenPair = async (payload: ITokenPayload, password: string) => {
  const accessToken = encode(payload);
  const refreshToken = RefreshToken.generate(payload.username, password);
  await refreshToken.save();

  return {
    access: accessToken,
    refresh: refreshToken.token,
  };
};

export { jwt };

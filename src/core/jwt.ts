import jwt from 'jsonwebtoken';
import { RefreshToken } from '../db/entities/RefreshToken';
import { UserPermission  } from '../db/entities/User';
import { Setting, SettingType } from '../core/settings';

export interface ITokenPayload {
  id: number;
  username: string;
  permissions: UserPermission[];
};

/** Lifetime of JWT access token in minutes */
const tokenExpiration = Setting.create('security.jwt.lifetime', SettingType.INT, 15);

const secret = process.env.SECRET;
export const encode = async (payload: ITokenPayload) => jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn: `${await tokenExpiration.get()}m` });
export const decode = (token): ITokenPayload => jwt.verify(token, secret, { algorithms: ['HS256'] }) as ITokenPayload;

/** Generates access token, generates and saves refresh token to the database. */
export const createTokenPair = async (payload: ITokenPayload) => {
  const accessToken = await encode(payload);
  const refreshToken = RefreshToken.generate(payload.id);
  await refreshToken.save();

  return {
    access: accessToken,
    refresh: refreshToken.token,
  };
};

export const invalidateToken = (query: Partial<RefreshToken>) => RefreshToken.update(query, { invalidated: true });

export { jwt };

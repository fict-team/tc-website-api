import { Entity, Column, BaseEntity, PrimaryColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { parse } from 'express-useragent';
import { createHash } from 'crypto';
import { IRequest } from '../../core/api';
import { RefreshToken } from './RefreshToken';

@Entity('fingerprint')
export class Fingerprint extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  ip: string;

  @Column()
  useragent: string;

  @Column()
  browser: string;

  @Column()
  platform: string;

  @Column()
  os: string;

  @OneToMany(type => RefreshToken, token => token.fingerprint)
  tokens: RefreshToken[]

  public static make(req: IRequest) {
    const useragent = req.headers['user-agent'] ?? '';
    const ip = req.ip;
    const id = createHash('sha256').update(useragent + ip, 'utf8').digest().toString('hex');
    const ua = parse(useragent);
    const { os, platform, version } = ua;
    const browser = `${ua.browser ?? 'unknown'} ${version ?? '0'}`;
    
    return Fingerprint.create({
      id,
      ip,
      useragent,
      browser,
      platform,
      os,
    });
  }
}

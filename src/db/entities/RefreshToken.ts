import { Entity, Column, BaseEntity, PrimaryGeneratedColumn, CreateDateColumn, OneToOne, UpdateDateColumn, ManyToOne } from 'typeorm';
import { uuid } from 'uuidv4';
import { Fingerprint } from './Fingerprint';

@Entity('refresh_tokens')
export class RefreshToken extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @Column({ default: false })
  invalidated: boolean;

  @Column()
  userId: number;
  
  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(type => Fingerprint, fingerprint => fingerprint.tokens)
  fingerprint: Fingerprint;

  static generate(userId: number): RefreshToken {
    return RefreshToken.create({ userId, token: uuid() });
  }
};

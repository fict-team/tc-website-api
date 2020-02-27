import { Entity, Column, BaseEntity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { uuid } from 'uuidv4';

@Entity('refresh_tokens')
export class RefreshToken extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @Column({ default: false })
  invalidated: boolean;

  @Column()
  username: string;

  @Column()
  password: string;
  
  @CreateDateColumn()
  createdAt: Date;

  static generate(username: string, password: string): RefreshToken {
    return RefreshToken.create({ username, password, token: uuid() });
  }
};

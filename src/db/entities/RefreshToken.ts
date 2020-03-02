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
  userId: number;
  
  @CreateDateColumn()
  createdAt: Date;

  static generate(userId: number): RefreshToken {
    return RefreshToken.create({ userId, token: uuid() });
  }
};

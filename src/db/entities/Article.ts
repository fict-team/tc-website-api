import { Entity, Column, BaseEntity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from './User';
import { LocalizedContent } from '../../core/language';

@Entity('articles')
export class Article extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'simple-json' })
  content: LocalizedContent<string>;

  @Column({ default: true })
  visible: boolean;

  @ManyToOne(type => User, user => user.articles)
  author: User;

  @Column()
  publishedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

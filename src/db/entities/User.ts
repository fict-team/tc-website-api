import { Entity, Column, BaseEntity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum UserPermission {
  MANAGE_USERS = 'manage_users',
  MANAGE_PAGES = 'manage_pages',
  MANAGE_PROFILES = 'manage_profiles',
  MANAGE_FILES = 'manage_files',
  MANAGE_NEWS = 'manage_news',
  MANAGE_EVENTS = 'manage_events',
  MANAGE_MANUALS = 'manage_manuals',
  VIEW_LOGS = 'view_logs',
  EDIT_SETTINGS = 'edit_settings',
};

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @Column({ type: 'simple-json', default: [] })
  permissions: UserPermission[];
  
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  createdBy?: number;
};

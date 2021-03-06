import { Entity, Column, BaseEntity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { pick } from '../../util/object';
import { hashPassword } from '../../util/security';
import { Article } from './Article';

export enum UserPermission {
  MANAGE_USERS = 'manage_users',
  MANAGE_PAGES = 'manage_pages',
  MANAGE_PROFILES = 'manage_profiles',
  MANAGE_FILES = 'manage_files',
  MANAGE_ARTICLES = 'manage_articles',
  MANAGE_EVENTS = 'manage_events',
  MANAGE_MANUALS = 'manage_manuals',
  VIEW_LOGS = 'view_logs',
  EDIT_SETTINGS = 'edit_settings',
};

const permissionValues = {};
Object.keys(UserPermission).forEach(k => permissionValues[UserPermission[k]] = true);

export const isValidUserPermission = (value: string) => permissionValues[value] === true;

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  email: string;

  @Column()
  salt: string;

  @Column({ type: 'simple-json', default: [] })
  permissions: UserPermission[];

  @OneToMany(type => Article, article => article.author)
  articles: Article[]
  
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  createdBy?: number;

  getPublicData() {
    return pick(this, ['id', 'username', 'email', 'permissions', 'createdAt', 'updatedAt']);
  }

  async getCreator() {
    if (this.createdBy == null) { return null; }
    return await User.findOne({ id: this.createdBy });
  }

  static async make(user: Pick<User, 'username' | 'password' | 'email' | 'permissions' | 'createdBy'>) {
    const { username, password, permissions, createdBy, email } = user;
    const { hash, salt } = await hashPassword(password);

    return await User.create({
      username,
      email,
      password: hash,
      permissions,
      createdBy,
      salt,
    });
  }
};

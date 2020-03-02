import { Entity, Column, BaseEntity, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum SettingType {
  FLOAT = 'float',
  INT = 'int',
  STRING = 'string',
};

@Entity('settings')
export class Setting extends BaseEntity {
  @PrimaryColumn()
  key: string;

  @Column()
  category: string;

  @Column('text')
  type: SettingType;

  @Column()
  value: string;
};

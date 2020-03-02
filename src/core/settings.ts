import { Setting as SettingEnt, SettingType } from '../db/entities/Setting';
import { getConnection, Connection } from 'typeorm';
import { isNullOrUndefined } from 'util';

export { SettingType };

const parsers = {
  [SettingType.FLOAT]: (v) => parseFloat(v),
  [SettingType.INT]: (v) => parseInt(v),
  [SettingType.STRING]: (v) => v,
};

export class Setting<T> {
  public key: string;
  public category: string;
  public type: SettingType;
  public defaultValue: T;

  private constructor(obj: Partial<Setting<T>>) { Object.assign(this, obj); }

  private static toInitialize: Setting<any>[] = [];

  public static async initialize(connection: Connection) {
    const list = Setting.toInitialize;
    for (let i = 0; i < list.length; i++) {
      const { key, category, defaultValue, type } = list[i];
      await connection
        .createQueryBuilder()
        .insert()
        .into(SettingEnt)
        .values({ 
          category: key ? category : 'general', 
          key: key ?? category,
          type,
          value: isNullOrUndefined(defaultValue) ? null : defaultValue.toString(),
        })
        .onConflict(`("key") DO NOTHING`)
        .execute();
    }
  }

  public static create<T>(name: string, type: SettingType, defaultValue: T = null) {
    const [category, ...parts] = name.split('.');

    const setting = new Setting<T>({ key: parts.join('.'), category, type, defaultValue });
    Setting.toInitialize.push(setting);

    return setting;
  }

  public async get(): Promise<T> {
    const fn = parsers[this.type];
    const record = await SettingEnt.findOne({ key: this.key, category: this.category });
    const value = record?.value;

    return isNullOrUndefined(value) ? null : fn(value);
  }

  public set(value: T) {
    return SettingEnt.update({ key: this.key, category: this.category }, { value: value.toString() });
  }
};

import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '@database/index';
import IUser, { Password } from '@interfaces/models/IUser';
import { v4 as uuid } from 'uuid';
import Role from '@models/Role';
import Activity from '@models/Activity';

export type userInput = IUser;
export type userInputUpdate = Optional<IUser, 'id' | 'email' | 'password'>;
export type userOutput = Required<IUser>;
export default class User
  extends Model<userOutput, userInput>
  implements IUser
{
  public id!: string;

  public userName!: string;

  public firstName!: string;

  public lastName!: string;

  public email!: string;

  public password!: Password;

  public gender!: string;

  public activityId!: string | null;

  public roleId!: string | null;

  public avatar!: string;

  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;

  public readonly deletedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: uuid()
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    activityId: DataTypes.UUID,
    roleId: DataTypes.UUID,
    avatar: {
      type: DataTypes.STRING,
      defaultValue: 'default.png'
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE
  },
  {
    tableName: 'users',
    freezeTableName: true,
    timestamps: true,
    paranoid: true,
    sequelize
  }
);

User.hasOne(Role, {
  foreignKey: 'userId',
  as: 'role'
});
User.hasOne(Activity, {
  foreignKey: 'userId',
  as: 'activity'
});
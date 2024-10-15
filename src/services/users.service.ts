import { HttpException } from '../exceptions/httpException';
import UserEntity from '../entity/user.entity';
import { Service } from 'typedi';
import { User } from '../interfaces/users.interface';
import { Repository } from 'typeorm';
@Service()
export class UserService extends Repository<UserEntity> {
  public async synchronizeDown(last_sync_time: string): Promise<UserEntity[]> {
    const lastSyncTime = new Date(last_sync_time).toISOString();
    const users: UserEntity[] = await this.query(`SELECT * FROM user_entity WHERE updated_at=TIMESTAMP'${lastSyncTime}'`);
    return users;
  }

  public async findAll(): Promise<UserEntity[]> {
    const users: UserEntity[] = await UserEntity.find();
    return users;
  }

  public async findUserById(userId: number): Promise<UserEntity> {
    const findUser: UserEntity = await UserEntity.findOne({ where: { id: userId } });
    if (!findUser) throw new HttpException(404, "User doesn't exist");

    return findUser;
  }

  public async createUser(userData: User): Promise<UserEntity> {
    const findUser: UserEntity = await UserEntity.findOne({ where: { email: userData.email } });
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);
    const createUserData: UserEntity = await UserEntity.create({ ...userData }).save();
    return createUserData;
  }

  public async deleteUser(userId: number): Promise<UserEntity> {
    const findUser: UserEntity = await UserEntity.findOne({ where: { id: userId } });
    if (!findUser) throw new HttpException(404, "User doesn't exist");
    await UserEntity.remove(findUser);
    return findUser;
  }

  public async synchronizeUp(userData: UserEntity[]): Promise<Array<{}>> {
    const updatedData = await Promise.all(
      userData.map(async eachUser => {
        try {
          await UserEntity.save(eachUser);
          return { id: eachUser.id, status: 1 };
        } catch (err) {
          return { id: eachUser.id, status: 0 };
        }
      }),
    );
    return updatedData;
  }
}

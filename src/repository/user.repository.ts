import UserEntity from '@/entity/user.entity';
import { Service } from 'typedi';
import { DataSource, Repository } from 'typeorm';

@Service()
export class UserRepository extends Repository<UserEntity> {
  constructor(dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
  }

  findByName(first_name: string, last_name: string) {
    return this.createQueryBuilder('user')
      .where('user.first_name = :first_ame', { first_name })
      .andWhere('user.last_name = :last_name', { last_name })
      .getMany();
  }
}

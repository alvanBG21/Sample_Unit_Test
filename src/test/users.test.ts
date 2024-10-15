// Import necessary dependencies and the UserService
import 'reflect-metadata';
import { expect } from 'chai';
import { UserService } from '../services/users.service';
import { TestDbConnection } from '../databases';
import UserEntity from '../entity/user.entity';
import { DataSource } from 'typeorm';

async function connect() {
  try {
    const conn = await TestDbConnection.initialize();

    console.log('connected to db');
    return conn;
  } catch (err) {
    console.error(err);
  }
}
describe('UserService', () => {
  let connection: DataSource;
  let userService: UserService;

  before(async () => {
    connection = await connect();
    userService = new UserService(UserEntity, connection.createEntityManager());
  });

  after(async () => {
    await connection.getRepository(UserEntity).query('TRUNCATE TABLE user_entity');
    await connection.destroy();
  });

  describe('findAllUser', () => {
    it('should return an array of users', async () => {
      const users = await userService.findAll();
      expect(users).to.be.an('array');
    });
  });
  describe('syncDown', () => {
    it('should return an array of users', async () => {
      const users = await userService.synchronizeDown('0');
      console.log(users);
      expect(users).to.be.an('array');
    });
  });

  describe('findUserById', () => {
    it('should return a user by ID', async () => {
      const userData = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
      };
      const newUser = await userService.createUser(userData);
      const user = await userService.findUserById(newUser.id);
      expect(user).to.be.an('object');
      expect(user.id).to.equal(newUser.id);
    });

    it('should throw HttpException if user does not exist', async () => {
      const invalidUserId = 9999; // Replace with an invalid user ID
      try {
        await userService.findUserById(invalidUserId);
      } catch (error) {
        expect(error.status).to.equal(404);
        expect(error.message).to.equal("User doesn't exist");
      }
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const userData = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john2.doe@example.com',
        // ... other user properties
      };

      const createdUser = await userService.createUser(userData);
      expect(createdUser).to.be.an('object');
      expect(createdUser.email).to.equal(userData.email);
    });

    it('should throw HttpException if email already exists', async () => {
      const existingUser = {
        // Replace with existing user data
        first_name: 'Existing',
        last_name: 'User',
        email: 'existing.user@example.com',
        // ... other user properties
      };

      try {
        await userService.createUser(existingUser);
      } catch (error) {
        expect(error.statusCode).to.equal(409);
        expect(error.message).to.equal(`This email ${existingUser.email} already exists`);
      }
    });
  });
  describe('syncUp', () => {
    it('should sync up users', async () => {
      const userData = [
        {
          first_name: 'John',
          last_name: 'Doe',
          email: 'john3.doe@example.com',
        },
        {
          first_name: 'John',
          last_name: 'Doe',
          email: 'john4.doe@example.com',
        },
      ];

      const updatedData = await userService.synchronizeUp(userData as UserEntity[]);
      expect(updatedData).to.be.an('array');
      expect(updatedData).to.have.lengthOf(userData.length);
      updatedData.forEach(data => {
        expect(data).to.have.property('id');
        expect(data).to.have.property('status', 1);
      });
    });
  });

  describe('deleteUser', () => {
    it('should delete a user by ID', async () => {
      const userData = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john111.doe@example.com',
        // ... other user properties
      };

      const createdUser = await userService.createUser(userData);
      const deletedUser = await userService.deleteUser(createdUser.id);

      // expect(deletedUser).to.be.an('object');
      expect(deletedUser.email).to.equal(createdUser.email);
    });

    it('should throw HttpException if user does not exist', async () => {
      const invalidUserIdToDelete = 9999; // Replace with an invalid user ID to delete
      try {
        await userService.deleteUser(invalidUserIdToDelete);
      } catch (error) {
        expect(error.status).to.equal(404);
        expect(error.message).to.equal("User doesn't exist");
      }
    });
  });
});

// import config from 'config';
import path from 'path';
import { DataSource } from 'typeorm';
import 'dotenv/config';
export const DbConnection = new DataSource({
  name: 'default',
  type: 'postgres',
  host: process.env.HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  synchronize: true,
  logging: false,
  extra: {
    max: '100',
    min: '50',
  },
  entities: [path.join(__dirname, '../**/*.entity{.ts,.js}')],
  migrations: [path.join(__dirname, '../**/*.migration{.ts,.js}')],
  subscribers: [path.join(__dirname, '../**/*.subscriber{.ts,.js}')],
});

export const TestDbConnection = new DataSource({
  name: process.env.TEST_DB_NAME,
  type: 'postgres',
  host: process.env.TEST_DB_HOST,
  port: 5432,
  username: process.env.TEST_DB_USERNAME,
  password: process.env.TEST_DB_PASSWORD,
  database: process.env.TEST_DATABASE,
  synchronize: true,
  logging: false,
  extra: {
    max: '100',
    min: '50',
  },
  entities: [path.join(__dirname, '../**/*.entity{.ts,.js}')],
  migrations: [path.join(__dirname, '../**/*.migration{.ts,.js}')],
  subscribers: [path.join(__dirname, '../**/*.subscriber{.ts,.js}')],
});

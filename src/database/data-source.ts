// import 'reflect-metadata';
// import { DataSource } from 'typeorm';
// import { User } from './entity/User';
// import { config } from 'dotenv';

// config();
// const {
//   POSTGRES_PASSWORD,
//   POSTGRES_USER,
//   POSTGRES_DB,
//   POSTGRES_HOST,
//   POSTGRES_PORT,
// } = process.env;

// export const AppDataSource = new DataSource({
//   type: 'postgres',
//   host: POSTGRES_HOST,
//   port: Number(POSTGRES_PORT),
//   username: POSTGRES_USER,
//   password: POSTGRES_PASSWORD,
//   database: POSTGRES_DB,
//   synchronize: true,
//   logging: false,
//   entities: [User],
//   migrations: [],
//   subscribers: [],
// });

import { ConnectionOptions } from 'typeorm';

const config: ConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'test_sm',
  password: 'admin',
  database: 'test_sm',
};

export default config;

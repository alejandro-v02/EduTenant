import { config as cargarEnv } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

// Se ejecuta fuera del bootstrap de Nest (CLI de migraciones), por lo que
// carga el .env manualmente en lugar de depender de @nestjs/config.
cargarEnv();

export const opcionesTypeOrm: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PUERTO ?? '5432', 10),
  username: process.env.DB_USUARIO ?? 'edutenant',
  password: process.env.DB_CLAVE ?? 'edutenant',
  database: process.env.DB_NOMBRE ?? 'edutenant',
  entities: [__dirname + '/../**/*.orm-entity{.ts,.js}'],
  migrations: [__dirname + '/../migraciones/*{.ts,.js}'],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
};

export default new DataSource(opcionesTypeOrm);

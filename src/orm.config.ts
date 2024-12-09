import * as path from 'node:path';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { Logger } from '@nestjs/common';

export const PUBLIC_DATABASE = 'main_db'; // Base de datos pública
export const TENANT_DATABASE_PREFIX = 'tenant_'; // Prefijo para bases de datos de tenants

const MAX_CONNECTIONS = 3;
const MAX_PUBLIC_CONNECTIONS = Math.max(1, Math.floor(MAX_CONNECTIONS * 0.1));
const MAX_TENANTED_CONNECTIONS = MAX_CONNECTIONS - MAX_PUBLIC_CONNECTIONS;
const MAX_CONNECTIONS_PER_TENANT = 1;
export const MAX_TENANT_DATA_SOURCES = Math.floor(
  MAX_TENANTED_CONNECTIONS / MAX_CONNECTIONS_PER_TENANT,
);

const logger = new Logger('ormConfig');
logger.debug(`Max connections: ${MAX_CONNECTIONS}`);
logger.debug(`Max public connections: ${MAX_PUBLIC_CONNECTIONS}`);
logger.debug(`Max tenanted connections: ${MAX_TENANTED_CONNECTIONS}`);
logger.debug(`Max connections per tenant: ${MAX_CONNECTIONS_PER_TENANT}`);
logger.debug(`Max tenanted data sources: ${MAX_TENANT_DATA_SOURCES}`);

export function publicOrmConfigFactory(): MysqlConnectionOptions {
  return {
    type: 'mysql',
    host: 'localhost',
    database: PUBLIC_DATABASE,
    username: 'root',
    password: '',
    synchronize: true,
    entities: [path.join(__dirname, 'public/**/*.entity.{ts,js}')],
    migrations: [path.join(__dirname, 'migrations/public/*.{ts,js}')],
    extra: {
      max: MAX_PUBLIC_CONNECTIONS,
    },
  };
}

export function tenantedOrmConfigFactory(
  tenantDatabase: string, // Nombre de la base de datos del tenant
): MysqlConnectionOptions {
  return {
    ...publicOrmConfigFactory(),
    database: tenantDatabase,
    entities: [path.join(__dirname, '**/*.entity.{ts,js}')],
    migrations: [path.join(__dirname, 'migrations/tenanted/*.{ts,js}')],
    synchronize: true, // Deshabilitar las migraciones automáticas para las bases de datos tenanted, true para activar migraciones automaticas
    extra: {
      max: MAX_CONNECTIONS_PER_TENANT,
    },
  };
}

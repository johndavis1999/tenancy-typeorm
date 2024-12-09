import { DataSource } from 'typeorm';
import { TENANT_DATABASE_PREFIX, tenantedOrmConfigFactory } from '../orm.config';
import { dataSourceManager } from './data-source.manager';
import { Logger } from '@nestjs/common';

const logger = new Logger('tenantDataSource');

export async function getTenantDataSource(tenantId: number): Promise<DataSource> {
  const databaseName = tenantDatabaseName(tenantId);

  return dataSourceManager.getOrCreate(databaseName, async () => {
    logger.debug(`Creating data source for tenant ${tenantId}`);
    const source = new DataSource(tenantedOrmConfigFactory(databaseName));
    await source.initialize();
    return source;
  });
}

export function tenantDatabaseName(tenantId: number): string {
  return `${TENANT_DATABASE_PREFIX}${tenantId}`;
}

// Aquí se exporta la función syncDataSource correctamente
export async function syncDataSource(source: DataSource): Promise<void> {
  await source.synchronize();
}

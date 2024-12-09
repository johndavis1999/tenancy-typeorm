import { LRUCache } from 'lru-cache';
import { DataSource } from 'typeorm';
import { MAX_TENANT_DATA_SOURCES } from '../orm.config';
import { Logger } from '@nestjs/common';

const logger = new Logger('DataSourceManager');

const cache = new LRUCache<string, DataSource>({
  max: MAX_TENANT_DATA_SOURCES,
  dispose: async (source: DataSource) => {
    logger.debug(`Disposing data source ${source.options.database}`);
    await source.destroy();
  },
});

class DataSourceManager {
  public async getOrCreate(
    name: string,
    createFn: () => Promise<DataSource>,
  ): Promise<DataSource> {
    const existing = cache.get(name);
    if (existing) {
      return existing;
    }

    const created = await createFn();
    cache.set(name, created);
    return created;
  }
}

export const dataSourceManager = new DataSourceManager();

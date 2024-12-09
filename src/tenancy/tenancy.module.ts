import { AutoloadModule } from 'nestjs-autoloader';
import { Global, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { getTenantDataSource } from './tenant.data-source';
import { TENANT_DATA_SOURCE } from './tenant-data-source.decorator';
import { Request } from 'express';

@Global()
@AutoloadModule(__dirname, {
  providers: [
    {
      provide: TENANT_DATA_SOURCE,
      scope: Scope.REQUEST,
      useFactory: (request: Request) => {
        const tenantId = parseInt(request.header('x-tenant-id'), 10);
        if (tenantId) {
          return getTenantDataSource(tenantId);
        }
      },
      inject: [REQUEST],
    },
  ],
  exports: [TENANT_DATA_SOURCE],
})
export class TenancyModule {}

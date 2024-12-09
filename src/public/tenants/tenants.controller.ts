import { Controller, Post, Get, Param } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Tenant } from './tenant.entity';
import { EntityManager, Repository } from 'typeorm';
import { getTenantDataSource, syncDataSource, tenantDatabaseName } from '../../tenancy/tenant.data-source';

@Controller('/api/tenants')
export class TenantsController {
  public constructor(
    @InjectRepository(Tenant) private readonly tenants: Repository<Tenant>,
    @InjectEntityManager() private readonly manager: EntityManager,
  ) {}

  @Post()
  public async createTenant(): Promise<Tenant> {
    const tenant = await this.tenants.save(new Tenant());

    // Crear una nueva base de datos para el tenant
    const database = tenantDatabaseName(tenant.id);
    await this.manager.query(`CREATE DATABASE \`${database}\``);

    // Obtener el data source y sincronizarlo
    const dataSource = await getTenantDataSource(tenant.id);
    await syncDataSource(dataSource);

    return tenant;
  }

  @Get()
  public async listTenants(): Promise<Tenant[]> {
    return this.tenants.find(); // Devuelve todos los tenants
  }

  @Get(':id')
  public async getTenant(@Param('id') id: number): Promise<Tenant> {
    return this.tenants.findOne({ where: { id } }); // Busca un tenant por ID
  }
}

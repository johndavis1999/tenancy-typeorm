import { Controller, Get, Post } from '@nestjs/common';
import { TenantDataSource } from '../../tenancy/tenant-data-source.decorator';
import { DataSource, Repository } from 'typeorm';
import { Cat } from './cat.entity';
import { randomName } from './random-name';

@Controller('/api/cats')
export class CatsController {
  private readonly cats: Repository<Cat>;

  public constructor(@TenantDataSource() dataSource: DataSource) {
    //console.log('DataSource:', dataSource); // Depuración para ver si el dataSource está definido

    if (!dataSource) {
      throw new Error('DataSource is undefined');
    }
    this.cats = dataSource.getRepository(Cat); // Verifica que el repositorio se obtenga del data source correcto
  }

  @Get()
  public async listCats(): Promise<Cat[]> {
    return await this.cats.find();
  }

  @Post()
  public async createCat(): Promise<Cat> {
    const cat = new Cat();
    cat.name = randomName();
    return await this.cats.save(cat);
  }
}

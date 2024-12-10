import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class Tenant {
  @PrimaryColumn() // Cambiado a PrimaryColumn, ya que será manual
  public id: string;

  @Column()
  public data: string;
}

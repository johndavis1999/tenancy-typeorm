import { IsString, IsOptional } from 'class-validator';

export class CatDto {
  @IsString()
  @IsOptional()
  public name?: string;
}

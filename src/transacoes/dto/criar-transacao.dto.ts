import { Type } from 'class-transformer';
import { IsBoolean, IsIn, IsNotEmpty, IsNumber, IsString, MaxLength, Min } from 'class-validator';

export class CriarTransacaoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  descricao!: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2, allowNaN: false, allowInfinity: false })
  @Min(0.01)
  valor!: number;

  @IsIn(['receita', 'despesa'])
  tipo!: 'receita' | 'despesa';

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  categoria!: string;

  @IsBoolean()
  consumoConsciente!: boolean;
}

import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateProgramDto {
  @IsString()
  name: string;

  @IsInt()
  @Min(2)
  stampsRequired: number;

  @IsString()
  rewardDescription: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateMemberDto {
  @IsUUID()
  programId: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  contact?: string;
}

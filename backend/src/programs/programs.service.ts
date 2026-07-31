import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoyaltyProgram } from './program.entity';
import { CreateProgramDto } from './dto/create-program.dto';

@Injectable()
export class ProgramsService {
  constructor(
    @InjectRepository(LoyaltyProgram)
    private readonly programsRepo: Repository<LoyaltyProgram>,
  ) {}

  create(ownerId: string, dto: CreateProgramDto) {
    const program = this.programsRepo.create({
      ...dto,
      owner: { id: ownerId } as any,
    });
    return this.programsRepo.save(program);
  }

  findMine(ownerId: string) {
    return this.programsRepo.find({
      where: { owner: { id: ownerId } },
      order: { createdAt: 'DESC' },
    });
  }

  async findOneOwned(id: string, ownerId: string) {
    const program = await this.programsRepo.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (!program) throw new NotFoundException('Programme introuvable');
    if (program.owner.id !== ownerId) throw new ForbiddenException();
    return program;
  }
}

import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { customAlphabet } from 'nanoid';
import { Member } from './member.entity';
import { ProgramsService } from '../programs/programs.service';
import { CreateMemberDto } from './dto/create-member.dto';

const generateCode = customAlphabet('ABCDEFGHJKMNPQRSTUVWXYZ23456789', 7);

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member) private readonly membersRepo: Repository<Member>,
    private readonly programsService: ProgramsService,
  ) {}

  async create(ownerId: string, dto: CreateMemberDto) {
    const program = await this.programsService.findOneOwned(dto.programId, ownerId);
    const member = this.membersRepo.create({
      code: generateCode(),
      program,
      owner: { id: ownerId } as any,
      name: dto.name,
      contact: dto.contact,
    });
    return this.membersRepo.save(member);
  }

  findMine(ownerId: string, programId?: string) {
    return this.membersRepo.find({
      where: programId
        ? { owner: { id: ownerId }, program: { id: programId } }
        : { owner: { id: ownerId } },
      order: { createdAt: 'DESC' },
    });
  }

  async findByCodeOwned(code: string, ownerId: string) {
    const member = await this.membersRepo.findOne({
      where: { code },
      relations: ['owner'],
    });
    if (!member) throw new NotFoundException('Client introuvable pour ce code');
    if (member.owner.id !== ownerId) throw new ForbiddenException();
    return member;
  }

  async findByCodePublic(code: string) {
    const member = await this.membersRepo.findOne({ where: { code } });
    if (!member) throw new NotFoundException('Carte introuvable');
    return member;
  }

  private async findOwned(id: string, ownerId: string) {
    const member = await this.membersRepo.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (!member) throw new NotFoundException('Client introuvable');
    if (member.owner.id !== ownerId) throw new ForbiddenException();
    return member;
  }

  async addStamp(id: string, ownerId: string) {
    const member = await this.findOwned(id, ownerId);
    member.currentStamps += 1;
    member.totalStampsEver += 1;
    member.lastStampedAt = new Date();
    if (member.currentStamps >= member.program.stampsRequired) {
      member.currentStamps = 0;
      member.rewardsAvailable += 1;
    }
    return this.membersRepo.save(member);
  }

  async redeem(id: string, ownerId: string) {
    const member = await this.findOwned(id, ownerId);
    if (member.rewardsAvailable <= 0) {
      throw new ForbiddenException('Aucune recompense disponible pour ce client');
    }
    member.rewardsAvailable -= 1;
    member.rewardsRedeemed += 1;
    return this.membersRepo.save(member);
  }
}

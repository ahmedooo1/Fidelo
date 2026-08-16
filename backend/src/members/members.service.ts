import {
  BadRequestException,
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
import { MailService } from '../mail/mail.service';

const generateCode = customAlphabet('ABCDEFGHJKMNPQRSTUVWXYZ23456789', 7);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member) private readonly membersRepo: Repository<Member>,
    private readonly programsService: ProgramsService,
    private readonly mailService: MailService,
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
    // The owner relation is only loaded for this check; strip passwordHash
    // before the entity goes anywhere near a response.
    delete (member.owner as any).passwordHash;
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
    delete (member.owner as any).passwordHash;
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
      throw new ForbiddenException('Aucune récompense disponible pour ce client');
    }
    member.rewardsAvailable -= 1;
    member.rewardsRedeemed += 1;
    return this.membersRepo.save(member);
  }

  async sendCardByEmail(id: string, ownerId: string) {
    const member = await this.membersRepo.findOne({
      where: { id },
      relations: ['owner', 'program'],
    });
    if (!member) throw new NotFoundException('Client introuvable');
    if (member.owner.id !== ownerId) throw new ForbiddenException();
    delete (member.owner as any).passwordHash;
    if (!member.contact || !EMAIL_RE.test(member.contact)) {
      throw new BadRequestException(
        "Ce client n'a pas d'adresse email valide enregistrée.",
      );
    }

    const cardUrl = `${process.env.FRONTEND_URL || 'http://localhost:3020'}/card/${member.code}`;
    await this.mailService.sendLoyaltyCard({
      to: member.contact,
      memberName: member.name,
      businessName: member.owner.businessName,
      programName: member.program.name,
      rewardDescription: member.program.rewardDescription,
      cardUrl,
    });
    return { ok: true };
  }
}

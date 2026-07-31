import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { LoyaltyProgram } from '../programs/program.entity';
import { User } from '../users/user.entity';

@Entity('members')
export class Member {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @ManyToOne(() => LoyaltyProgram, { eager: true, onDelete: 'CASCADE' })
  program: LoyaltyProgram;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  owner: User;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  contact: string;

  @Column({ default: 0 })
  currentStamps: number;

  @Column({ default: 0 })
  totalStampsEver: number;

  @Column({ default: 0 })
  rewardsAvailable: number;

  @Column({ default: 0 })
  rewardsRedeemed: number;

  @Column({ type: 'timestamptz', nullable: true })
  lastStampedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}

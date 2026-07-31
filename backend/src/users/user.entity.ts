import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { LoyaltyProgram } from '../programs/program.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column({ nullable: true })
  businessName: string;

  @OneToMany(() => LoyaltyProgram, (p) => p.owner)
  programs: LoyaltyProgram[];

  @CreateDateColumn()
  createdAt: Date;
}

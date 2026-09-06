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

  @Column({ nullable: true })
  passwordHash: string;

  @Column({ nullable: true, unique: true })
  googleId: string;

  @Column({ nullable: true })
  businessName: string;

  @Column({ default: false })
  emailVerified: boolean;

  @OneToMany(() => LoyaltyProgram, (p) => p.owner)
  programs: LoyaltyProgram[];

  @CreateDateColumn()
  createdAt: Date;
}

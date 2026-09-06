import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  private sign(userId: string) {
    return this.jwtService.sign({ sub: userId });
  }

  private toPublic(user: { id: string; email: string; businessName: string }) {
    return { id: user.id, email: user.email, businessName: user.businessName };
  }

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Un compte existe déjà avec cet email');
    }
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({
      email: dto.email,
      passwordHash,
      businessName: dto.businessName,
    });

    await this.sendVerificationEmail(user.id, user.email);

    return { requiresVerification: true, email: user.email };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Identifiants invalides');
    if (!user.passwordHash) {
      throw new UnauthorizedException(
        'Ce compte utilise la connexion Google, utilise le bouton "Continuer avec Google"',
      );
    }
    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Identifiants invalides');
    if (!user.emailVerified) throw new ForbiddenException('EMAIL_NOT_VERIFIED');
    return { accessToken: this.sign(user.id), user: this.toPublic(user) };
  }

  async googleLogin(idToken: string) {
    if (!idToken) throw new BadRequestException('Jeton Google manquant');

    let payload: { sub: string; email?: string; email_verified?: boolean; name?: string };
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload() as typeof payload;
    } catch {
      throw new UnauthorizedException('Jeton Google invalide');
    }

    if (!payload?.email || !payload.email_verified) {
      throw new UnauthorizedException('Email Google non verifie');
    }

    let user = await this.usersService.findByGoogleId(payload.sub);

    if (!user) {
      const existingByEmail = await this.usersService.findByEmail(payload.email);
      if (existingByEmail) {
        user = await this.usersService.linkGoogleId(existingByEmail.id, payload.sub);
      } else {
        user = await this.usersService.create({
          email: payload.email,
          googleId: payload.sub,
          businessName: payload.name,
          emailVerified: true,
        });
      }
    }

    return { accessToken: this.sign(user.id), user: this.toPublic(user) };
  }

  private async sendVerificationEmail(userId: string, email: string) {
    const token = this.jwtService.sign(
      { sub: userId, purpose: 'verify_email' },
      { expiresIn: '7d' },
    );
    const base = process.env.FRONTEND_URL || 'http://localhost:3020';
    const verifyUrl = `${base}/verification/${token}`;
    await this.mailService.sendVerificationEmail({ to: email, verifyUrl });
  }

  async verifyEmail(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      if (payload.purpose !== 'verify_email') throw new Error();
      await this.usersService.setEmailVerified(payload.sub);
      return { success: true };
    } catch {
      throw new UnauthorizedException('Lien invalide ou expiré');
    }
  }

  async resendVerification(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (user && !user.emailVerified) {
      await this.sendVerificationEmail(user.id, user.email);
    }
    return { success: true };
  }
}

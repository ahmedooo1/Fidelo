import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { MembersService } from './members.service';
import { CreateMemberDto } from './dto/create-member.dto';

@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req: any, @Body() dto: CreateMemberDto) {
    return this.membersService.create(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('mine')
  findMine(@Req() req: any, @Query('programId') programId?: string) {
    return this.membersService.findMine(req.user.id, programId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('lookup/:code')
  lookup(@Req() req: any, @Param('code') code: string) {
    return this.membersService.findByCodeOwned(code.toUpperCase(), req.user.id);
  }

  @Get('public/:code')
  findPublic(@Param('code') code: string) {
    return this.membersService.findByCodePublic(code.toUpperCase());
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/stamp')
  addStamp(@Req() req: any, @Param('id') id: string) {
    return this.membersService.addStamp(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/redeem')
  redeem(@Req() req: any, @Param('id') id: string) {
    return this.membersService.redeem(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/send-card')
  sendCard(@Req() req: any, @Param('id') id: string) {
    return this.membersService.sendCardByEmail(id, req.user.id);
  }
}

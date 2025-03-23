import { Module } from '@nestjs/common';
import { RoomsController } from '../rooms/rooms.controller';
import { PrismaService } from '../database/prisma.service';
import { RoomsService } from '../rooms/rooms.service';

@Module({
  imports: [],
  controllers: [RoomsController],
  providers: [RoomsService, PrismaService],
})
export class RoomsModule {}


//precisa importa Roles e dto para cá?
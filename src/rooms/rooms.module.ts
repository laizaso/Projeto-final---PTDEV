import { Module } from '@nestjs/common';
import { RoomsController } from 'src/rooms/rooms.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoomsService } from 'src/rooms/rooms.service';

@Module({
  imports: [],
  controllers: [RoomsController],
  providers: [RoomsService, PrismaService],
})
export class RoomsModule {}


//precisa importa Roles e dto para cá?
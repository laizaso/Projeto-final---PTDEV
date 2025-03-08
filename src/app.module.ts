import { Module } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RoomsModule } from './rooms/rooms.module';
import { ReservationsModule } from './reservations/reservations.module';

@Module({
  imports: [UsersModule, AuthModule, RoomsModule,ReservationsModule],
  controllers: [],
  providers: [PrismaService],
})

export class AppModule {}
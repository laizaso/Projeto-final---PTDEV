import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RoomsModule } from './rooms/rooms.module';

@Module({
  imports: [UsersModule, AuthModule, RoomsModule],
  controllers: [],
  providers: [PrismaService],
})

export class AppModule {}
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '../database/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtconstants } from './constants';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtconstants.secret,
      signOptions: { expiresIn: '72h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
})
export class AuthModule {}

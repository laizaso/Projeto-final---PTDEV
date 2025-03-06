import {
  CanActivate,
  UnauthorizedException,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { jwtconstants } from './constants';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    const isBlacklisted = await this.prismaService.tokenBlacklist.findUnique({
      where: { token },
    });

    if (isBlacklisted) return false; // Bloqueia se estiver na blacklist

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtconstants.secret,
      });

      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    // Bearer laslasklaslakslasakslsa
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }
}

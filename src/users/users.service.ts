import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async updateUser(userId: string, data: { name?: string; email?: string }) {
    await this.prismaService.user.update({
      where: { id: userId },
      data,
      select: {
        name: true,
        email: true,
      },
    });

    return { message: 'Informações alteradas com sucesso!' };
  }
}

import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateRoomDto, UpdateRoomDto } from 'src/rooms/dto/rooms.dtos';
import { User } from '@prisma/client';

//CreatRoomDto define os dados necessarios para criar uma sala

@Injectable()
export class RoomsService {
  constructor(private prisma: PrismaService) {} // a propriedade prisma recebe o PrismaService permitindo a interação com o banco de dados

  async create(data: CreateRoomDto, user: User) {
    if (user.role !== 'ADMIN') {
      throw new ForbiddenException ('somente admin pode criar uma sala uma sala')
    }
    //cria a sala
    return this.prisma.room.create({ data }); //retorna os dados da sala
  }

  async findAll() {
    //lista todas as salas
    return this.prisma.room.findMany({
      where: {
        // que estão ativas retornando os dados
        isActive: true,
      },
    });
  }

  async findOne(id: string) {
    //chama uma sala especifica informando o id
    const room = await this.prisma.room.findUnique({ where: { id } });
    if (!room) throw new NotFoundException('Sala não encontrada'); //se a sala nao for encontrada
    return room;
  }

  async update(id: string, data: UpdateRoomDto, user: User) {
    if (user.role !== 'ADMIN') {
      throw new ForbiddenException ('somente admin pode atualizar os dados da sala')
    }
    //atualiza os dados da sala
    return this.prisma.room.update({ where: { id }, data });
  }

  async toggleStatus(id: string) {
    // desativa ou ativa a sala
    const room = await this.findOne(id); //acha a sala
    return this.prisma.room.update({
      where: { id },
      data: { isActive: !room.isActive }, // confere se esta ativo
    });
  }

  async remove(id: string , user:User ) {
    if (user.role !== 'ADMIN') {
      throw new ForbiddenException ('somente admin pode deletar uma sala uma sala')
    }
    //remove as salas
    await this.findOne(id); // Verifica se a sala existe antes de excluir
    return this.prisma.room.delete({ where: { id } });
  }
}

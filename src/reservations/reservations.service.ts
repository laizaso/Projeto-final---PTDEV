import { Injectable, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { ReservationHistoryDTO } from './dto/reservation-history.dto';
import { differenceInHours } from 'date-fns';
import { User } from '@prisma/client';

@Injectable()
export class ReservationsService {
  constructor(private prisma: PrismaService) {}

  async createReservation(user: User, dto: ReservationHistoryDTO) {
    const { roomId, startTime, endTime } = dto;

    const room = await this.prisma.room.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      throw new NotFoundException('Sala não encontrada');
    }
    
    if (!room.isActive) {
      throw new ForbiddenException('Esta sala está desativada e não pode ser reservada');
    }

    const hasConflict = await this.prisma.reservation.findFirst({
      where: {
        roomId,
        OR: [
          { startTime: { lt: endTime }, endTime: { gt: startTime } }, // Conflito de horário
        ],
      },
    });

    if (hasConflict) {
      throw new BadRequestException('Já existe uma reserva nesse horário para esta sala');
    }

    return this.prisma.reservation.create({
      data: {
        userId: user.id,
        roomId,
        startTime,
        endTime,
      },
    });
  }

  async getReservations(user: User) {
    return this.prisma.reservation.findMany({
      where: { userId: user.id },
      include: { room: true }, 
    });
  }

  async getReservationById(user: User, id: string) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
      include: { room: true },
    });

    if (!reservation) {
      throw new NotFoundException('Reserva não encontrada');
    }

    if (reservation.userId !== user.id && user.role !== 'ADMIN') {
      throw new ForbiddenException('Você não tem permissão para acessar essa reserva');
    }

    return reservation;
  }

  async cancelReservation(user: User, id: string) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
    });

    if (!reservation) {
      throw new NotFoundException('Reserva não encontrada');
    }

    if (reservation.userId !== user.id && user.role !== 'ADMIN') {
      throw new ForbiddenException('Você não tem permissão para cancelar essa reserva');
    }

    const hoursUntilStart = differenceInHours(reservation.startTime, new Date());
    if (hoursUntilStart < 24) {
      throw new ForbiddenException('A reserva só pode ser cancelada com mais de 24 horas de antecedência');
    }

    return this.prisma.reservation.delete({ where: { id } });
  }

  async getReservationsHistory(user: User) {
    return this.prisma.reservation.findMany({
      where: { userId: user.id },
      orderBy: { startTime: 'desc' },
    });
  }

  async getAllReservations(admin: User) {
    if (admin.role !== 'ADMIN') {
      throw new ForbiddenException('Apenas administradores podem visualizar todas as reservas');
    }

    return this.prisma.reservation.findMany({
      include: { user: true, room: true },
      orderBy: { startTime: 'asc' },
    });
  }

  async deleteReservation(admin: User, id: string) {
    if (admin.role !== 'ADMIN') {
      throw new ForbiddenException('Apenas administradores podem remover reservas');
    }

    return this.prisma.reservation.delete({ where: { id } });
  }
}

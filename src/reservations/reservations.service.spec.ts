import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsService } from './reservations.service';
import { PrismaService } from '../database/prisma.service';
import { ReservationHistoryDTO } from './dto/reservation-history.dto';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
const { Role } = require('@prisma/client');

describe('ReservationsService', () => {
  let service: ReservationsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    room: {
      findUnique: jest.fn(),
    },
    reservation: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockUser = {
    id: 'user123',
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedpassword',
    role: Role.USER, 
    resetPasswordToken: null,
    resetPasswordExpires: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ReservationsService>(ReservationsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createReservation', () => {
    it('should create a reservation', async () => {
      const dto: ReservationHistoryDTO = { roomId: 'room1', startTime: new Date(), endTime: new Date() };
      mockPrismaService.room.findUnique.mockResolvedValue({ id: 'room1', isActive: true });
      mockPrismaService.reservation.findFirst.mockResolvedValue(null);
      mockPrismaService.reservation.create.mockResolvedValue({ id: 'res123' });

      const result = await service.createReservation(mockUser, dto);
      expect(result).toEqual({ id: 'res123' });
    });

    it('should throw NotFoundException if room does not exist', async () => {
      mockPrismaService.room.findUnique.mockResolvedValue(null);
      const dto: ReservationHistoryDTO = { roomId: 'room1', startTime: new Date(), endTime: new Date() };

      await expect(service.createReservation(mockUser, dto)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if room is not active', async () => {
      mockPrismaService.room.findUnique.mockResolvedValue({ id: 'room1', isActive: false });
      const dto: ReservationHistoryDTO = { roomId: 'room1', startTime: new Date(), endTime: new Date() };

      await expect(service.createReservation(mockUser, dto)).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequestException if there is a schedule conflict', async () => {
      mockPrismaService.room.findUnique.mockResolvedValue({ id: 'room1', isActive: true });
      mockPrismaService.reservation.findFirst.mockResolvedValue({ id: 'conflict123' });
      const dto: ReservationHistoryDTO = { roomId: 'room1', startTime: new Date(), endTime: new Date() };

      await expect(service.createReservation(mockUser, dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getReservations', () => {
    it('should return all reservations of the user', async () => {
      mockPrismaService.reservation.findMany.mockResolvedValue([{ id: 'res1' }]);

      const result = await service.getReservations(mockUser);
      expect(result).toEqual([{ id: 'res1' }]);
      expect(prisma.reservation.findMany).toHaveBeenCalledWith({
        where: { userId: mockUser.id },
        include: { room: true },
      });
    });
  });

  describe('getReservationById', () => {
    it('should return a reservation by id', async () => {
      mockPrismaService.reservation.findUnique.mockResolvedValue({ id: 'res123', userId: mockUser.id });

      const result = await service.getReservationById(mockUser, 'res123');
      expect(result).toEqual({ id: 'res123', userId: mockUser.id });
    });

    it('should throw NotFoundException if reservation is not found', async () => {
      mockPrismaService.reservation.findUnique.mockResolvedValue(null);

      await expect(service.getReservationById(mockUser, 'res123')).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user is not allowed', async () => {
      mockPrismaService.reservation.findUnique.mockResolvedValue({ id: 'res123', userId: 'anotherUser' });

      await expect(service.getReservationById(mockUser, 'res123')).rejects.toThrow(ForbiddenException);
    });
  });

  describe('cancelReservation', () => {
    it('should cancel a reservation', async () => {
      mockPrismaService.reservation.findUnique.mockResolvedValue({
        id: 'res123',
        userId: mockUser.id,
        startTime: new Date(new Date().getTime() + 25 * 60 * 60 * 1000), // 25 horas depois
      });
      mockPrismaService.reservation.delete.mockResolvedValue({ id: 'res123' });

      const result = await service.cancelReservation(mockUser, 'res123');
      expect(result).toEqual({ id: 'res123' });
    });

    it('should throw NotFoundException if reservation is not found', async () => {
      mockPrismaService.reservation.findUnique.mockResolvedValue(null);

      await expect(service.cancelReservation(mockUser, 'res123')).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user is not allowed', async () => {
      mockPrismaService.reservation.findUnique.mockResolvedValue({
        id: 'res123',
        userId: 'anotherUser',
      });

      await expect(service.cancelReservation(mockUser, 'res123')).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException if cancellation is too late', async () => {
      mockPrismaService.reservation.findUnique.mockResolvedValue({
        id: 'res123',
        userId: mockUser.id,
        startTime: new Date(new Date().getTime() + 10 * 60 * 60 * 1000), // 10 horas depois
      });

      await expect(service.cancelReservation(mockUser, 'res123')).rejects.toThrow(ForbiddenException);
    });
  });
});

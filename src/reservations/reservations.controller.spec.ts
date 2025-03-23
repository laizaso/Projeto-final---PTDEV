import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { ReservationHistoryDTO } from './dto/reservation-history.dto';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('ReservationsController', () => {
  let controller: ReservationsController;
  let service: ReservationsService;

  const mockReservationsService = {
    createReservation: jest.fn(),
    getReservations: jest.fn(),
    getReservationById: jest.fn(),
    cancelReservation: jest.fn(),
    getReservationsHistory: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationsController],
      providers: [
        { provide: ReservationsService, useValue: mockReservationsService },
      ],
    }).compile();

    controller = module.get<ReservationsController>(ReservationsController);
    service = module.get<ReservationsService>(ReservationsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a reservation', async () => {
      const user = { id: 'user123' };
      const dto: ReservationHistoryDTO = { roomId: 'room1', startTime: new Date(), endTime: new Date() };
      mockReservationsService.createReservation.mockResolvedValue({ id: 'res123' });

      const result = await controller.create(user, dto);
      expect(result).toEqual({ id: 'res123' });
      expect(service.createReservation).toHaveBeenCalledWith(user, dto);
    });
  });

  describe('findAll', () => {
    it('should return all reservations of the user', async () => {
      const user = { id: 'user123' };
      mockReservationsService.getReservations.mockResolvedValue([{ id: 'res1' }]);

      const result = await controller.findAll(user);
      expect(result).toEqual([{ id: 'res1' }]);
      expect(service.getReservations).toHaveBeenCalledWith(user);
    });
  });

  describe('findOne', () => {
    it('should return a reservation by id', async () => {
      const user = { id: 'user123' };
      mockReservationsService.getReservationById.mockResolvedValue({ id: 'res123' });

      const result = await controller.findOne(user, 'res123');
      expect(result).toEqual({ id: 'res123' });
      expect(service.getReservationById).toHaveBeenCalledWith(user, 'res123');
    });

    it('should throw NotFoundException if reservation is not found', async () => {
      mockReservationsService.getReservationById.mockRejectedValue(new NotFoundException('Reserva não encontrada'));

      await expect(controller.findOne({ id: 'user123' }, 'res123')).rejects.toThrow(NotFoundException);
    });
  });

  describe('cancel', () => {
    it('should cancel a reservation', async () => {
      const user = { id: 'user123' };
      mockReservationsService.cancelReservation.mockResolvedValue({ id: 'res123' });

      const result = await controller.cancel(user, 'res123');
      expect(result).toEqual({ id: 'res123' });
      expect(service.cancelReservation).toHaveBeenCalledWith(user, 'res123');
    });

    it('should throw ForbiddenException if cancellation is not allowed', async () => {
      mockReservationsService.cancelReservation.mockRejectedValue(new ForbiddenException('Reserva não pode ser cancelada'));

      await expect(controller.cancel({ id: 'user123' }, 'res123')).rejects.toThrow(ForbiddenException);
    });
  });

  describe('history', () => {
    it('should return reservation history', async () => {
      const user = { id: 'user123' };
      mockReservationsService.getReservationsHistory.mockResolvedValue([{ id: 'history1' }]);

      const result = await controller.history(user);
      expect(result).toEqual([{ id: 'history1' }]);
      expect(service.getReservationsHistory).toHaveBeenCalledWith(user);
    });
  });
});

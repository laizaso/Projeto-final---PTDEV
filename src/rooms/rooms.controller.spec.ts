import { Test, TestingModule } from "@nestjs/testing";
import { RoomsController } from "./rooms.controller";
import { RoomsService } from "./rooms.service";
import { AuthGuard } from "../auth/auth.guard";
import { ForbiddenException, NotFoundException } from "@nestjs/common";

const mockRoomsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    toggleStatus: jest.fn(),
    remove: jest.fn(),
  };
  describe('RoomsController', () => {
    let controller: RoomsController;
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        controllers: [RoomsController],
        providers: [{ provide: RoomsService, useValue: mockRoomsService }],
      })
        .overrideGuard(AuthGuard) // Desativando o guard nos testes unitários
        .useValue({})
        .compile();
  
      controller = module.get<RoomsController>(RoomsController);
    });
  
    it('deve ser definido', () => {
      expect(controller).toBeDefined();
    });
  
    describe('create', () => {
      it('deve criar uma sala se o usuário for ADMIN', async () => {
        const dto = {
            name: 'Sala de Reunião',
            capacity: 10, // Adicione um valor adequado
            description: 'Uma sala para reuniões' // Adicione uma descrição
          };
        const user = { role: 'ADMIN' };
        mockRoomsService.create.mockResolvedValue(dto);
  
        expect(await controller.create(dto, user)).toEqual(dto);
        expect(mockRoomsService.create).toHaveBeenCalledWith(user, dto);
      });
  
      it('deve lançar ForbiddenException se o usuário não for ADMIN', async () => {
        const dto = {
            name: 'Sala de Reunião',
            capacity: 10, // Adicione um valor adequado
            description: 'Uma sala para reuniões' // Adicione uma descrição
          };
        const user = { role: 'USER' };
        mockRoomsService.create.mockRejectedValue(new ForbiddenException());
  
        await expect(controller.create(dto, user)).rejects.toThrow(ForbiddenException);
      });
    });
  
    describe('findAll', () => {
      it('deve retornar todas as salas ativas', async () => {
        const rooms = [{ id: '1', name: 'Sala A', isActive: true }];
        mockRoomsService.findAll.mockResolvedValue(rooms);
  
        expect(await controller.findAll()).toEqual(rooms);
        expect(mockRoomsService.findAll).toHaveBeenCalled();
      });
    });
  
    describe('findOne', () => {
      it('deve retornar uma sala específica', async () => {
        const room = { id: '1', name: 'Sala A' };
        mockRoomsService.findOne.mockResolvedValue(room);
  
        expect(await controller.findOne('1')).toEqual(room);
        expect(mockRoomsService.findOne).toHaveBeenCalledWith('1');
      });
  
      it('deve lançar NotFoundException se a sala não existir', async () => {
        mockRoomsService.findOne.mockRejectedValue(new NotFoundException());
  
        await expect(controller.findOne('99')).rejects.toThrow(NotFoundException);
      });
    });
  
    describe('update', () => {
      it('deve atualizar uma sala se o usuário for ADMIN', async () => {
        const updatedRoom = { id: '1', name: 'Sala Atualizada' };
        const dto = { name: 'Sala Atualizada' };
        const user = { role: 'ADMIN' };
        mockRoomsService.update.mockResolvedValue(updatedRoom);
  
        expect(await controller.update('1', dto, user)).toEqual(updatedRoom);
        expect(mockRoomsService.update).toHaveBeenCalledWith('1', dto, user);
      });
  
      it('deve lançar ForbiddenException se o usuário não for ADMIN', async () => {
        const dto = { name: 'Sala Atualizada' };
        const user = { role: 'USER' };
        mockRoomsService.update.mockRejectedValue(new ForbiddenException());
  
        await expect(controller.update('1', dto, user)).rejects.toThrow(ForbiddenException);
      });
    });
  
    describe('toggleStatus', () => {
      it('deve ativar/desativar uma sala', async () => {
        const toggledRoom = { id: '1', isActive: false };
        mockRoomsService.toggleStatus.mockResolvedValue(toggledRoom);
  
        expect(await controller.toggleStatus('1')).toEqual(toggledRoom);
        expect(mockRoomsService.toggleStatus).toHaveBeenCalledWith('1');
      });
    });
  
    describe('remove', () => {
      it('deve remover uma sala se o usuário for ADMIN', async () => {
        const user = { role: 'ADMIN' };
        mockRoomsService.remove.mockResolvedValue({ success: true });
  
        expect(await controller.remove('1', user)).toEqual({ success: true });
        expect(mockRoomsService.remove).toHaveBeenCalledWith('1', user);
      });
  
      it('deve lançar ForbiddenException se o usuário não for ADMIN', async () => {
        const user = { role: 'USER' };
        mockRoomsService.remove.mockRejectedValue(new ForbiddenException());
  
        await expect(controller.remove('1', user)).rejects.toThrow(ForbiddenException);
      });
    });
  });  
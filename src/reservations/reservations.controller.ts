import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationHistoryDTO } from './dto/reservation-history.dto';
import { AuthGuard } from '../auth/auth.guard';
import { GetUser } from '../auth/get-user.decorator'; 
import { ApiBearerAuth } from '@nestjs/swagger';


@ApiBearerAuth()
@Controller('reservations')
@UseGuards(AuthGuard) 
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  //criar uma nova reserva
  @Post()
  async create(@GetUser() user, @Body() dto: ReservationHistoryDTO) {
    console.log(user.role)
    return this.reservationsService.createReservation(user, dto);
  }

  //listar todas as reservas do usuário autenticado
  @Get()
  async findAll(@GetUser() user) {
    return this.reservationsService.getReservations(user);
  }

  //buscar uma reserva específica do usuário
  @Get(':id')
  async findOne(@GetUser() user, @Param('id') id: string) {
    return this.reservationsService.getReservationById(user, id);
  }

  //cancelar reserva 
  @Delete(':id')
  async cancel(@GetUser() user, @Param('id') id: string) {
    return this.reservationsService.cancelReservation(user, id);
  }

  //histórico de reservas do usuário autenticado
  @Get('history')
  async history(@GetUser() user) {
    return this.reservationsService.getReservationsHistory(user);
  }
}

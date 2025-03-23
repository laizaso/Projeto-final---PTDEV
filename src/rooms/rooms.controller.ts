import { Controller, Get, Post, Body, Param, Put, Patch, Delete, UseGuards } from '@nestjs/common';
import { CreateRoomDto, UpdateRoomDto } from '../rooms/dto/rooms.dtos';
import { RoomsService } from '../rooms/rooms.service';
import { GetUser } from '../auth/get-user.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';


@ApiBearerAuth()
@Controller('rooms')
@UseGuards(AuthGuard)  // todas as rotas com /rooms
export class RoomsController {
  constructor(private roomsService: RoomsService) {}

  @Post()  //cria sala
  
  create(@Body() createRoomDto: CreateRoomDto, @GetUser() user) {
    console.log(user)
    return this.roomsService.create(user, createRoomDto );
  }

  @Get() //lista as salas
  findAll() {
    return this.roomsService.findAll();
  }

  @Get(':id') //procurar a sala pelo id
  findOne(@Param('id') id: string) {
    return this.roomsService.findOne(id);
  }

  @Put(':id') //atualizar os dados da sala

  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto, @GetUser() user) {
    return this.roomsService.update(id, updateRoomDto, user);
  }

  @Patch(':id/status') //ativar e desativar sala
  toggleStatus(@Param('id') id: string) {
    return this.roomsService.toggleStatus(id);
  }

  @Delete(':id') //deleta as salas

  remove(@Param('id') id: string, @GetUser()user) {
    return this.roomsService.remove(id,user);
  }
}

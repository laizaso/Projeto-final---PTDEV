import { Controller, Get, Post, Body, Param, Put, Patch, Delete } from '@nestjs/common';
import { Role } from '@prisma/client';
import { CreateRoomDto, UpdateRoomDto } from 'src/rooms/dto/rooms.dtos';
import { Roles } from 'src/roles';
import { RoomsService } from 'src/rooms/rooms.service';

@Controller('rooms')  // todas as rotas com /rooms
export class RoomsController {
  constructor(private roomsService: RoomsService) {}

  @Post()  //cria sala
 @Roles(Role.ADMIN)
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.create(createRoomDto);
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
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomsService.update(id, updateRoomDto);
  }

  @Patch(':id/status') //ativar e desativar sala
  @Roles(Role.ADMIN)
  toggleStatus(@Param('id') id: string) {
    return this.roomsService.toggleStatus(id);
  }

  @Delete(':id') //deleta as salas
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.roomsService.remove(id);
  }
}

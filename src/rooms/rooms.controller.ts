import { Controller, Get, Post, Body, Param, Put, Patch, Delete, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { CreateRoomDto, UpdateRoomDto } from 'src/rooms/dto/rooms.dtos';
import { RoomsService } from 'src/rooms/rooms.service';
import { GetUser } from 'src/auth/get-user.decorator';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('rooms')
@UseGuards(AuthGuard)  // todas as rotas com /rooms
export class RoomsController {
  constructor(private roomsService: RoomsService) {}

  @Post()  //cria sala
  
  create(@Body() createRoomDto: CreateRoomDto, @GetUser() user) {
    console.log("Usuário autenticado:", user)
    return this.roomsService.create(createRoomDto,user );
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

import { Body, Controller, Get, Put, Request, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService){}


  @UseGuards(AuthGuard)
  @Get('me')
  me(@Request() request) {
    return request.user;
  }

  @UseGuards(AuthGuard)
  @Put('me')
  async updateUser(@Req() req, @Body() data:{name?:string; email?: string}){
    const userId = req.user.id;
    return this.usersService.updateUser(userId, data )
  }

}

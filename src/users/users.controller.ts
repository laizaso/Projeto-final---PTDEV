import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
export class UsersController {
  @UseGuards(AuthGuard)
  @Get('me')
  async me(@Request() request) {
    return request.user;
  }
}

/* eslint-disable prettier/prettier */
import { Body, Controller, Post, Req, Request, UseGuards} from '@nestjs/common';
import { LoginDTO, RegisterDTO } from './dtos/auth';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';


@Controller('auth')

//no controller que iremos definir os endpoints da nossa api
export class AuthController {
  constructor(private authService: AuthService) {}
  
  @Post('register')
  async register(@Body() body: RegisterDTO) {
    

    return this.authService.register(body);
  }

  @Post('login')
  async login(@Body() body: LoginDTO) {
    

    return this.authService.login(body);
  }
  @ApiBearerAuth()
  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return await this.authService.forgotPassword(email);
  }
  @ApiBearerAuth()
  @Post('reset-password')
  async resetPassword(@Body() body) {
    return await this.authService.resetPassword(body.token, body.newPassword);
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  async logout(@Req() req){
    const token = req.headers.authorization?.split(' ')[1]

    if(!token){
      return {message: 'Usuário não autenticado'}
    }

    return this.authService.logout(token)
  }

  
}

/* eslint-disable prettier/prettier */
import { Body, Controller, Post} from '@nestjs/common';
import { LoginDTO, RegisterDTO } from './dtos/auth';
import { AuthService } from './auth.service';


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

  
}

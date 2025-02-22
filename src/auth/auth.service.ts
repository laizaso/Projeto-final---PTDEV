/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {JwtService} from '@nestjs/jwt'

import { LoginDTO, RegisterDTO } from './dtos/auth';
import { PrismaService } from 'src/prisma/prisma.service';


//o injectable diz para o nest que a class é um provider. então no module temos que passar como provider
@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService, private jwtService:JwtService) {}

  async register(data: RegisterDTO) {
    const userAlreadyExists = await this.prismaService.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (userAlreadyExists) {
      throw new UnauthorizedException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.prismaService.user.create({data:{
        ...data,
        password: hashedPassword,
    }});

    return {
        id:user.id,
        email:user.email,
        name: user.name,

    };
  }



  async login(data: LoginDTO) {
    const user = await this.prismaService.user.findUnique({
        where: {
          email: data.email,
        },
      });

      if(!user){
        throw new UnauthorizedException('Invalid credentials')
      }

      const passwordMatch = await bcrypt.compare(data.password, user.password)

      if(!passwordMatch){
        throw new UnauthorizedException('Invalid credentials')
      }

      const accessToken = await this.jwtService.signAsync({
        id: user.id,
        name: user.name,
        email: user.email,
      })

    return {accessToken};
  }
}

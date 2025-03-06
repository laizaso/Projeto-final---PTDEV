/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import {JwtService} from '@nestjs/jwt'

import { LoginDTO, RegisterDTO } from './dtos/auth';
import { PrismaService } from 'src/database/prisma.service';


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

  async logout(token:string){
    await this.prismaService.tokenBlacklist.create({
      data:{token},
    })

    return {message: 'Logout realizado com sucesso!'}
  }

















  async forgotPassword(email: string) {

  if (!email) {
    throw new Error('Invalid credentials');
  }

    const user = await this.prismaService.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('Invalid credentials');

    //  Gera um token temporário para redefinição de senha
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = await bcrypt.hash(resetToken, 10);

    //  Salva o token no banco, com um tempo de expiração
    await this.prismaService.user.update({
      where: { email },
      data: {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: new Date(Date.now() + 3600000), // Token expira em 1 hora
      },
    });

    //  Aqui deve enviar um email com o link para resetar a senha
    console.log(`Token de redefinição para o email ${email}: ${resetToken}`);

    return { message: 'Se o email existir, um link de redefinição foi enviado.' };
  }



  async resetPassword(token: string, newPassword: string) {
    const user = await this.prismaService.user.findFirst({
      where: {
        resetPasswordExpires: { gte: new Date() }, // Verifica se o token ainda é válido
      },
    });
  
    if (!user || !user.resetPasswordToken || !(await bcrypt.compare(token, user.resetPasswordToken))) {
      throw new Error("Token inválido ou expirado.");
    }
  
    // Atualiza a senha e remove o token de reset
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.prismaService.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });
  
    return { message: 'Senha redefinida com sucesso' };
  }


  





  
}

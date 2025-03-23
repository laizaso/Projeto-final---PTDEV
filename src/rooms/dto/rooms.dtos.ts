/* eslint-disable prettier/prettier */
//importei a biblioteca class-validator
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
// o dto vai definir os tipos de dados
export class CreateRoomDto {
  @ApiProperty({
    description: "insira seu nome",
    example: "Luis"
  })
  //tipo de dados da sala
  @IsString() //so aceita string
  @IsNotEmpty() //nao pode ser vazio
  name: string;


  @ApiProperty({
    description: "insira qual a capacidade maxima de reserva da sala",
    example: 8
  })
  @IsInt() //so aceita int
  @Min(1) //com no valor minimo de 1
  capacity: number;


  @ApiProperty({
    description: "descreva a funcionalidade da sala",
    example: "sala de trabalho"
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}

export class UpdateRoomDto {
  //tipo de dados para atualizar a sala
  @ApiProperty({
    description: "novo nome"
  })
  @IsString()
  @IsNotEmpty()
  name?: string;


  @ApiProperty({
    description: "nova capacidade"
  })
  @IsInt()
  @Min(1)
  capacity?: number;


  @ApiProperty({
    description: "nova descrição"
  })
  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsBoolean()
  isActive?: boolean;
}

//importei a biblioteca class-validator
import { IsBoolean, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
// o dto vai definir os tipos de dados
export class CreateRoomDto { //tipo de dados da sala
  @IsString() //so aceita string
  @IsNotEmpty() //nao pode ser vazio
  name: string;

  @IsInt() //so aceita int
  @Min(1) //com no valor minimo de 1
  capacity: number;

  @IsString()
  @IsNotEmpty()
  description: string;
}

export class UpdateRoomDto { //tipo de dados para atualizar a sala
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsInt()
  @Min(1)
  capacity?: number;

  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsBoolean()
  isActive?: boolean;
}

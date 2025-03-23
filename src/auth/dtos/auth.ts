import { ApiProperty } from "@nestjs/swagger";
import { Role } from "@prisma/client";

/* eslint-disable prettier/prettier */
export class RegisterDTO {
  @ApiProperty()
  name: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
  @ApiProperty({
    example: "USER"
  })
  role?: Role
}

export class LoginDTO {
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
}

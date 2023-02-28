import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty,IsEmail, MinLength, IsString } from "class-validator"

export class CreateUserDTO {
  @IsNotEmpty()
  @ApiProperty({description: 'required'})
  name: string
  @IsNotEmpty()
  @ApiProperty({description: 'required'})
  firstname: string
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({description: 'type Email, must be unique'})
  email: string
  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty({description: 'need 8 characters minimum'})
  password: string
  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty({description: 'required'})
  confirmpassword: string
}

export class LoginUserDTO {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({description: 'type Email, must be unique'})
  email: string
  @IsNotEmpty()
  @ApiProperty({description: 'required'})
  password: string
}

export class UpdateRoleDTO {
  @IsNotEmpty()
  @ApiProperty({description: 'required'})
  role: string
  @IsString()
  @ApiProperty({description: 'required'})
  id: string
}
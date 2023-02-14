import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty,IsEmail, MinLength, IsString } from "class-validator"

export class CreateUserDTO {
  @IsNotEmpty()
  @ApiProperty({description: 'required'})
  readonly name: string
  @ApiProperty()
  @IsNotEmpty()
  @ApiProperty({description: 'required'})
  readonly firstname: string
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({description: 'type Email, must be unique'})
  readonly email: string
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
  readonly email: string
  @IsNotEmpty()
  @ApiProperty({description: 'required'})
  readonly password: string
}

export class UpdateRoleDTO {
  @IsNotEmpty()
  @ApiProperty({description: 'required'})
  readonly role: string
  @IsString()
  @ApiProperty({description: 'required'})
  readonly id: string
}
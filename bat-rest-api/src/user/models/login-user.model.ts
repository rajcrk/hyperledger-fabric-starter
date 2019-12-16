import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginUserDto {
    @IsString()
    @ApiModelProperty()
    readonly username: string;
    @IsString()
    @ApiModelProperty()
    readonly password: string;
}

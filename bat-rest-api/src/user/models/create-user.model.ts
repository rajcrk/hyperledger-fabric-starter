import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @ApiModelProperty()
    readonly username: string;
    @IsString()
    @ApiModelProperty()
    readonly password: string;
    @IsString()
    @ApiModelProperty()
    readonly employeeId: string;
}

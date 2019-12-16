import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateAdminDto {
    @IsString()
    @ApiModelProperty()
    readonly email: string;
    @IsString()
    @ApiModelProperty()
    readonly userToBeAdmin: string;
}

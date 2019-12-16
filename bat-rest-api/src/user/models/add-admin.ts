import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddAdminDto {
    @IsString()
    @ApiModelProperty()
    public userToAdmin: string;
}

import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ApproveDeviceDto {
    @IsString()
    @ApiModelProperty()
    readonly id: string;
}

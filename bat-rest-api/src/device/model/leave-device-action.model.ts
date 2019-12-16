import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LeaveDeviceActionDto {
    @IsString()
    @ApiModelProperty()
    readonly id: string;
}

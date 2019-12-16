import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ReturnDeviceDto {
    @IsString()
    @ApiModelProperty()
    readonly id: string;
    @IsString()
    @ApiModelProperty()
    readonly dateOfReturn: string;
}

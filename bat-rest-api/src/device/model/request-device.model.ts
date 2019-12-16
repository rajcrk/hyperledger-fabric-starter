import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RequestDeviceDto {
    @IsString()
    @ApiModelProperty()
    readonly deviceId: string;
    @IsString()
    @ApiModelProperty()
    readonly deviceName: string;
    @IsString()
    @ApiModelProperty()
    readonly dateOfReturn: string;
    @IsString()
    @ApiModelProperty()
    readonly requestedBy: string;
    @IsString()
    @ApiModelProperty()
    readonly dateOfRequest: string;
}

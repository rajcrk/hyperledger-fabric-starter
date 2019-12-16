import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateDeviceDto {
    @IsString()
    @ApiModelProperty()
    readonly id: string;
    @IsString()
    @ApiModelProperty()
    readonly name: string;
    @IsString()
    @ApiModelProperty()
    readonly version: string;
    @IsString()
    @ApiModelProperty()
    readonly description: string;
}

import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LeaveDeviceDto {
    @IsString()
    @ApiModelProperty()
    readonly id: string;
    @IsString()
    @ApiModelProperty()
    readonly deviceName: string;
    @IsString()
    @ApiModelProperty()
    readonly comment: string;
    @IsString()
    @ApiModelProperty()
    readonly ownerId: string;
    @IsString()
    @ApiModelPropertyOptional()
    readonly leaveToId: string;
    @IsString()
    @ApiModelPropertyOptional()
    readonly dateOfLeave: string;
}

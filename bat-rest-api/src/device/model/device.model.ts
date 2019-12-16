import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DeviceDto {
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
    @IsString()
    @ApiModelProperty()
    readonly keyword: string;
    @IsString()
    @ApiModelProperty()
    readonly ownerId: string;
    @IsString()
    @ApiModelProperty()
    readonly dateOfIssue: string;
}

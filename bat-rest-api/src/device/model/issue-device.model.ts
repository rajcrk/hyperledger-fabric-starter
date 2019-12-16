import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class IssueDeviceDto {
    @IsString()
    @ApiModelProperty()
    readonly id: string;
    @IsString()
    @ApiModelProperty()
    readonly ownerId: string;
    @IsString()
    @ApiModelProperty()
    readonly dateOfIssue: string;
    @IsString()
    @ApiModelProperty()
    readonly dateOfReturn: string;
    @IsString()
    @ApiModelPropertyOptional()
    readonly comment: string;
}

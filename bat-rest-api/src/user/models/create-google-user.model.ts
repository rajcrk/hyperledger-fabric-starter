import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateGoogleUserDto {
    @IsString()
    @ApiModelProperty()
    readonly email: string;
    @IsString()
    @ApiModelProperty()
    readonly employeeId: string;
    @IsString()
    @ApiModelProperty()
    readonly firstName: string;
    @IsString()
    @ApiModelProperty()
    readonly lastName: string;
    @IsString()
    @ApiModelProperty()
    readonly photoUrl: string;
    @ApiModelPropertyOptional()
    public role: string;
}

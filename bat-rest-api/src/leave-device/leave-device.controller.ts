import { Controller, UseGuards, Post, Body, Req, Get, NotFoundException, Param, Delete } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiOAuth2Auth, ApiBearerAuth, ApiUseTags } from '@nestjs/swagger';
import { LeaveDeviceDto } from '../device/model/leave-device.model';
import { ResponseUtility } from '../common/utils/response/response-utility';
import { LeaveDeviceService } from './leave-device.service';
import { RequestDeviceDto } from '../device/model/request-device.model';
import { LeaveDeviceActionDto } from '../device/model/leave-device-action.model';

@ApiBearerAuth()
@ApiUseTags('leave-device')
@Controller('leave-device')
export class LeaveDeviceController {
    constructor(private readonly _leaveDeviceService: LeaveDeviceService) { }

    /**
     * leave device request to another
     * user
     * @param {LeaveDeviceDto} leaveDeviceRequest
     * @param req
     * @returns {*}
     * @memberof DeviceController
     */
    @UseGuards(AuthGuard('jwt'))
    @Post('')
    @ApiOperation({ title: 'make device leave request' })
    @ApiResponse({
        status: 201,
        description: 'leave device request has been sent.',
    })
    @ApiOAuth2Auth(['write'])
    leaveDeviceRequest(@Body() leaveDeviceRequest: LeaveDeviceDto, @Req() req): Promise<ResponseUtility> {
        return this._leaveDeviceService.leaveDeviceRequest(leaveDeviceRequest, req.auth);
    }

    /**
    * get leave device request 
    * that are made to an employee
    * @returns {Promise<DeviceDto[]>}
    * @memberof DeviceController
    * @param employeeId
    */
    @UseGuards(AuthGuard('jwt'))
    @Get('/:employeeId/:type')
    @ApiOperation({ title: 'get leave device request that are made to an employee' })
    @ApiOAuth2Auth(['read'])
    @ApiResponse({
        status: 200,
        description: 'returns an array of LeaveDeviceRequest object',
        type: RequestDeviceDto,
    })
    @ApiResponse({
        status: 404,
        description: 'does not exist!',
        type: NotFoundException
    })
    getLeaveDeviceRequest(@Param('employeeId') employeeId: string, @Param('type') typeOfLeaveRequest: string): Promise<ResponseUtility> {
        return this._leaveDeviceService.getLeaveDeviceRequest(employeeId, typeOfLeaveRequest);
    }

    /**
     * delete request for leave device
     *
     * @param {string} id
     * @param req
     * @returns {*}
     * @memberof DeviceController
     */
    @Delete('/:id')
    @ApiOperation({ title: 'delete a previously made leave device request' })
    @ApiResponse({
        status: 201,
        description: 'The leave device request has been successfully deleted',
    })
    @ApiOAuth2Auth(['write'])
    deleteLeaveDeviceRequest(@Param('id') id: string, @Req() req): Promise<ResponseUtility> {
        return this._leaveDeviceService.deleteLeaveDeviceRequest(id, req.auth);
    }

    /**
     * decline leave device request,
     * @param {LeaveDeviceActionDto} leaveDeviceActionDto
     * @param req
     * @returns {*}
     * @memberof DeviceController
     */
    @UseGuards(AuthGuard('jwt'))
    @Post('decline-leave-device')
    @ApiOperation({ title: 'decline the leave device request' })
    @ApiResponse({
        status: 201,
        description: 'leave device request has been decline.',
    })
    @ApiOAuth2Auth(['write'])
    declineLeaveDeviceRequest(@Body() leaveDeviceActionDto: LeaveDeviceActionDto, @Req() req): Promise<ResponseUtility> {
        return this._leaveDeviceService.declineDeviceRequest(leaveDeviceActionDto.id, req.auth);
    }

    /**
     * accept leave device request,
     * 
     * @param {LeaveDeviceActionDto} leaveDeviceActionDto
     * @param req
     * @returns {*}
     * @memberof DeviceController
     */
    @UseGuards(AuthGuard('jwt'))
    @Post('accept-leave-device')
    @ApiOperation({ title: 'accept the leave device request' })
    @ApiResponse({
        status: 201,
        description: 'leave device request has been approved.',
    })
    @ApiOAuth2Auth(['write'])
    acceptLeaveDeviceRequest(@Body() leaveDeviceActionDto: LeaveDeviceActionDto, @Req() req): Promise<ResponseUtility> {
        return this._leaveDeviceService.acceptDeviceLeaveRequest(leaveDeviceActionDto.id, req.auth);
    }
}

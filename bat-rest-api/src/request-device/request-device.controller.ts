import { Controller, Post, Body, Req, Delete, Param, Get, NotFoundException, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiOAuth2Auth, ApiBearerAuth, ApiUseTags } from '@nestjs/swagger';
import { RequestDeviceDto } from '../device/model/request-device.model';
import { ResponseUtility } from '../common/utils/response/response-utility';
import { RequestDeviceService } from './request-device.service';
import { AuthGuard } from '@nestjs/passport';
import { ApproveDeviceDto } from '../device/model/approve.model';
import { InvokeResult } from '../common/utils/invokeresult.model';

@ApiBearerAuth()
@ApiUseTags('request-device')
@Controller('request-device')
export class RequestDeviceController {
    constructor(private readonly _requestDeviceService: RequestDeviceService) {

    }

    /**
    * request device
    *
    * @param {RequestDeviceDto} requestDeviceDto
    * @param req
    * @returns {*}
    * @memberof DeviceController
    */
    @Post('')
    @ApiOperation({ title: 'request device' })
    @ApiResponse({
        status: 201,
        description: 'The device has been successfully requested',
    })
    @ApiOAuth2Auth(['write'])
    requestDevice(@Body() requestDevice: RequestDeviceDto, @Req() req): Promise<ResponseUtility> {
        return this._requestDeviceService.requestDevice(requestDevice, req.auth);
    }

    /**
     * delete request for device
     *
     * @param {RequestDeviceDto} requestDeviceDto
     * @param req
     * @returns {*}
     * @memberof DeviceController
     */
    @Delete('/:id')
    @ApiOperation({ title: 'delete a previously made request' })
    @ApiResponse({
        status: 201,
        description: 'The device request has been successfully deleted',
    })
    @ApiOAuth2Auth(['write'])
    deleteRequest(@Param('id') id: string, @Req() req): Promise<ResponseUtility> {
        return this._requestDeviceService.deleteDeviceRequest(id, req.auth);
    }

    /**
     * Get users their requested devices
     *
     * @returns {Promise<DeviceDto[]>}
     * @memberof DeviceController
     * @param ownerId
     */
    @UseGuards(AuthGuard('jwt'))
    @Get('/:ownerId')
    @ApiOperation({ title: 'Get users their requested devices' })
    @ApiOAuth2Auth(['read'])
    @ApiResponse({
        status: 200,
        description: 'Returns an array of RequestedDevice object',
        type: RequestDeviceDto,
    })
    @ApiResponse({
        status: 404,
        description: 'does not exist!',
        type: NotFoundException
    })
    getRequestedDeviceByOwnerId(@Param('ownerId') ownerId: string): Promise<ResponseUtility> {
        return this._requestDeviceService.queryRequestedDeviceByOwnerId(ownerId);
    }

    /**
     * approve device
     *
     * @param {DeviceDto} deviceDto
     * @param req
     * @returns {*}
     * @memberof DeviceController
     */
    @UseGuards(AuthGuard('jwt'))
    @Post('approve')
    @ApiOperation({ title: 'approve device request' })
    @ApiResponse({
        status: 201,
        description: 'device request has been approved.',
    })
    @ApiOAuth2Auth(['write'])
    approveDeviceRequest(@Body() deviceRequest: ApproveDeviceDto, @Req() req): Promise<InvokeResult> {
        return this._requestDeviceService.approveDeviceRequest(deviceRequest.id, req.auth);
    }
}

import { Body, Controller, Get, NotFoundException, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOAuth2Auth, ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { InvokeResult } from '../common/utils/invokeresult.model';
import { ResponseUtility } from '../common/utils/response/response-utility';
import { DeviceService as DeviceService } from './device.service';
import { DeviceDto } from './model/device.model';
import { IssueDeviceDto } from './model/issue-device.model';
import { RequestDeviceDto } from './model/request-device.model';
import { ReturnDeviceDto } from './model/return-device.model';
import { UpdateDeviceDto } from './model/update-device';

@ApiBearerAuth()
@ApiUseTags('device')
@Controller('device')
export class DeviceController {

    /**
     * Creates an instance of DeviceService.
     * @memberof DeviceController
     * @param {DeviceService} deviceService
     */
    constructor(private readonly deviceService: DeviceService) {
    }

    /**
     * get un approved device request
     *
     * @returns {Promise<DeviceDto[]>}
     * @memberof DeviceController
     */
    @UseGuards(AuthGuard('jwt'))
    @Get('unapproved-request')
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
    getUnApprovedDeviceRequest(): Promise<ResponseUtility> {
        return this.deviceService.queryUnApprovedRequest();
    }

    /**
     * Get all devices
     *
     * @returns {Promise<DeviceDto[]>}
     * @memberof DeviceController
     */
    @UseGuards(AuthGuard('jwt'))
    @Get()
    @ApiOperation({ title: 'Get all devices' })
    @ApiOAuth2Auth(['read'])
    @ApiResponse({
        status: 200,
        description: 'Returns a list of device objects',
        type: DeviceDto,
        isArray: true
    })
    getAll(): Promise<DeviceDto[]> {
        return this.deviceService.getAll();
    }

    /**
     * Get device by id
     *
     * @returns {Promise<DeviceDto[]>}
     * @memberof DeviceController
     * @param id
     */
    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    @ApiOperation({ title: 'Get a device by id' })
    @ApiOAuth2Auth(['read'])
    @ApiResponse({
        status: 200,
        description: 'Returns a Device object',
        type: DeviceDto,
    })
    @ApiResponse({
        status: 404,
        description: 'Device does not exist!',
        type: NotFoundException
    })
    getById(@Param('id') id: string): Promise<DeviceDto> {
        return this.deviceService.getById(id);
    }

    /**
     * Get device history by id
     *
     * @returns {Promise<DeviceDto[]>}
     * @memberof DeviceController
     * @param id
     */
    @UseGuards(AuthGuard('jwt'))
    @Get('/history/:id')
    @ApiOperation({ title: 'Get device history by id' })
    @ApiOAuth2Auth(['read'])
    @ApiResponse({
        status: 200,
        description: 'Returns a Device object',
        type: DeviceDto,
    })
    @ApiResponse({
        status: 404,
        description: 'Device does not exist!',
        type: NotFoundException
    })
    getDevicehistoryById(@Param('id') id: string): Promise<DeviceDto> {
        return this.deviceService.getDeviceHistoryById(id);
    }

    /**
     * Search devices by keyword
     *
     * @returns {Promise<DeviceDto[]>}
     * @memberof DeviceController
     * @param keyword
     */
    @UseGuards(AuthGuard('jwt'))
    @Get('/search/:keyword')
    @ApiOperation({ title: 'Search device by keyword' })
    @ApiOAuth2Auth(['read'])
    @ApiResponse({
        status: 200,
        description: 'Returns an array of Device object',
        type: DeviceDto,
    })
    @ApiResponse({
        status: 404,
        description: 'Device does not exist!',
        type: NotFoundException
    })
    queryDeviceByKeyword(@Param('keyword') keyword: string): Promise<DeviceDto> {
        return this.deviceService.queryDeviceByKeyword(keyword);
    }

    /**
     * Search devices by query
     *
     * @returns {Promise<DeviceDto[]>}
     * @memberof DeviceController
     * @param queryString
     */
    @UseGuards(AuthGuard('jwt'))
    @Get('/searchByQuery/:queryString')
    @ApiOperation({ title: 'Search device by query string' })
    @ApiOAuth2Auth(['read'])
    @ApiResponse({
        status: 200,
        description: 'Returns an array of Device object',
        type: DeviceDto,
    })
    @ApiResponse({
        status: 404,
        description: 'Device does not exist!',
        type: NotFoundException
    })
    getDeviceBySearchQuery(@Param('queryString') queryString: string): Promise<DeviceDto> {
        return this.deviceService.queryDeviceBySearch(queryString);
    }

    /**
     * Create new device
     *
     * @param {DeviceDto} deviceDto
     * @param req
     * @returns {*}
     * @memberof DeviceController
     */
    @UseGuards(AuthGuard('jwt'))
    @Post()
    @ApiOperation({ title: 'Create new device' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
    })
    @ApiOAuth2Auth(['write'])
    create(@Body() deviceDto: DeviceDto, @Req() req): Promise<InvokeResult> {
        return this.deviceService.create(deviceDto, req.auth);
    }

    /**
     * Issue Device
     *
     * @param {IssueDeviceDto} issueDeviceDto
     * @param req
     * @returns {*}
     * @memberof DeviceController
     */
    @UseGuards(AuthGuard('jwt'))
    @Post('/issue')
    @ApiOperation({ title: 'Issue a device to an employee' })
    @ApiResponse({
        status: 201,
        description: 'The device has been successfully issued',
    })
    @ApiOAuth2Auth(['write'])
    issueDevice(@Body() issueDeviceDto: IssueDeviceDto, @Req() req): Promise<InvokeResult> {
        return this.deviceService.issueDevice(issueDeviceDto, req.auth);
    }

    /**
     * Return Device
     *
     * @param {ReturnDeviceDto} returnDeviceDto
     * @param req
     * @returns {*}
     * @memberof DeviceController
     */
    @UseGuards(AuthGuard('jwt'))
    @Post('/return')
    @ApiOperation({ title: 'Return device back to the admin' })
    @ApiResponse({
        status: 201,
        description: 'The device has been successfully returned',
    })
    @ApiOAuth2Auth(['write'])
    returnDevice(@Body() returnDeviceDto: ReturnDeviceDto, @Req() req): Promise<InvokeResult> {
        return this.deviceService.returnDevice(returnDeviceDto, req.auth);
    }

    /**
     * Update Device
     *
     * @param {UpdateDeviceDto} updateDeviceDto
     * @param req
     * @returns {*}
     * @memberof DeviceController
     */
    @UseGuards(AuthGuard('jwt'))
    @Post('/update')
    @ApiOperation({ title: 'Update device information' })
    @ApiResponse({
        status: 201,
        description: 'The device has been successfully updated',
    })
    @ApiOAuth2Auth(['write'])
    updateDevice(@Body() updateDeviceDto: UpdateDeviceDto, @Req() req): Promise<InvokeResult> {
        return this.deviceService.updateDevice(updateDeviceDto, req.auth);
    }

    /**
     * Get users their borrowed devices
     *
     * @returns {Promise<DeviceDto[]>}
     * @memberof DeviceController
     * @param ownerId
     */
    @UseGuards(AuthGuard('jwt'))
    @Get('/myDevices/:ownerId')
    @ApiOperation({ title: 'Get users their borrowed devices' })
    @ApiOAuth2Auth(['read'])
    @ApiResponse({
        status: 200,
        description: 'Returns an array of Device object',
        type: DeviceDto,
    })
    @ApiResponse({
        status: 404,
        description: 'Device does not exist!',
        type: NotFoundException
    })
    getDeviceByOwnerId(@Param('ownerId') ownerId: string): Promise<DeviceDto> {
        return this.deviceService.queryDeviceByOwnerId(ownerId);
    }
}
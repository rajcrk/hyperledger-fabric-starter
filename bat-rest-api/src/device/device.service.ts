import { Inject, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { ChainMethod } from '../chainmethods.enum';
import { InvokeResult } from '../common/utils/invokeresult.model';
import { Log } from '../common/utils/logging/log.service';
import { ResponseUtility } from '../common/utils/response/response-utility';
import { IAuthUser } from '../core/authentication/interfaces/authenticateduser';
import { RequestHelper } from '../core/chain/requesthelper';
import { IGoogleUser } from '../user/interfaces/google-user.interface';
import { IUser } from '../user/interfaces/user.interface';
import { ILeaveDeviceRequest } from './interface/leave-device-request.interface';
import { IRequestDevice } from './interface/request-device.interface';
import { DeviceDto } from './model/device.model';
import { IssueDeviceDto } from './model/issue-device.model';
import { ReturnDeviceDto } from './model/return-device.model';
import { UpdateDeviceDto } from './model/update-device';

@Injectable()
export class DeviceService {

    /**
     * 
     * @param _requestHelper 
     * @param _deviceRequestModel 
     * @param _userModel 
     * @memberof DeviceService
     */
    constructor(private _requestHelper: RequestHelper,
        @Inject('DEVICE_REQUEST_MODEL') private readonly _deviceRequestModel: Model<IRequestDevice>,
        @Inject('GOOGLE_USER_MODEL') private readonly _googleUserModel: Model<IGoogleUser>) {
    }

    /**
     * Get all devices
     *
     * @returns {Promise<DeviceDto[]>}
     * @memberof DeviceService
     */
    getAll(): Promise<DeviceDto[]> {
        return this._requestHelper.queryRequest(ChainMethod.getAllDevices).catch((error) => {
            throw new InternalServerErrorException(error);
        });
    }

    /**
     * Get device by id
     * @param id
     * @returns {Promise<DeviceDto>}
     * @memberof DeviceService
     */
    getById(id: string): Promise<DeviceDto> {
        Log.service.info('Entering getById of DeviceService');
        return this._requestHelper.queryRequest(ChainMethod.queryDeviceById, id).then(
            (device) => {
                if (!device) {
                    throw new NotFoundException('Device does not exist!');
                }
                return device;
            },
            (error) => {
                throw new InternalServerErrorException(error);
            },
        );
    }

    /**
     * Create new device
     *
     * @param {DeviceDto} deviceDto
     * @param {IAuthUser} authUser
     * @returns {Promise<InvokeResult>}
     * @memberof DeviceService
     */
    create(deviceDto: DeviceDto, authUser: IAuthUser): Promise<InvokeResult> {
        Log.service.info('Entering create of DeviceService');
        let deviceData = [deviceDto.id, deviceDto.name, deviceDto.description, deviceDto.ownerId, deviceDto.dateOfIssue, deviceDto.keyword, deviceDto.version];
        return this._requestHelper.invokeRequest(ChainMethod.createDevice, deviceData)
            .catch((error) => {
                throw new InternalServerErrorException(error);
            });
    }

    /**
     * Issue device
     *
     * @param {IssueDeviceDto} issueDeviceDto
     * @param {IAuthUser} authUser
     * @returns {Promise<InvokeResult>}
     * @memberof DeviceService
     */
    async issueDevice(issueDeviceDto: IssueDeviceDto, authUser: IAuthUser): Promise<any> {
        Log.service.info('Entering issueDevice of DeviceService');
        let deviceData = [issueDeviceDto.id, issueDeviceDto.ownerId, issueDeviceDto.dateOfIssue, issueDeviceDto.dateOfReturn, issueDeviceDto.comment.length == 0 ? 'null' : issueDeviceDto.comment];
        // Validation for ownerId
        const user = await this._googleUserModel.findOne({ email: issueDeviceDto.ownerId }).exec();
        if (user == null) {
            return ResponseUtility.generateErrorResponse(`not a valid employee id`);
        }
        return this._requestHelper.invokeRequest(ChainMethod.issueDevice, deviceData)
            .catch((error) => {
                throw new InternalServerErrorException(error);
            });
    }

    /**
     * Return device
     *
     * @param {ReturnDeviceDto} reuturnDeviceDto
     * @param {IAuthUser} authUser
     * @returns {Promise<InvokeResult>}
     * @memberof DeviceService
     */
    returnDevice(returnDeviceDto: ReturnDeviceDto, authUser: IAuthUser): Promise<InvokeResult> {
        Log.service.info('Entering returnDevice of DeviceService');
        let deviceData = [returnDeviceDto.id, returnDeviceDto.dateOfReturn];
        return this._requestHelper.invokeRequest(ChainMethod.returnDevice, deviceData)
            .catch((error) => {
                throw new InternalServerErrorException(error);
            });
    }

    /**
     * Update device
     *
     * @param {DeviceDto} deviceDto
     * @param {IAuthUser} authUser
     * @returns {Promise<InvokeResult>}
     * @memberof DeviceService
     */
    updateDevice(deviceDto: UpdateDeviceDto, authUser: IAuthUser): Promise<InvokeResult> {
        let deviceData = [deviceDto.id, deviceDto.name, deviceDto.description, deviceDto.version];  
        return this._requestHelper.invokeRequest(ChainMethod.updateDevice, deviceData)
            .catch((error) => {
                throw new InternalServerErrorException(error);
            });
    }

    /**
     * Get device history by id
     *
     * @returns {Promise<DeviceDto>}
     * @memberof DeviceService
     */
    getDeviceHistoryById(id: string): Promise<DeviceDto> {
        return this._requestHelper.queryRequest(ChainMethod.getDeviceHistoryById, id).then(
            (device) => {
                if (!device) {
                    throw new NotFoundException('Device does not exist!');
                }
                return device;
            },
            (error) => {
                throw new InternalServerErrorException(error);
            },
        );
    }

    /**
     * Search device by name
     *
     * @returns {Promise<DeviceDto>}
     * @memberof DeviceService
     */
    queryDeviceByKeyword(keyword: string): Promise<DeviceDto> {
        Log.service.info(`Chaincode name is ${ChainMethod.getDeviceByKeyword} and the deviceName is ${keyword}`);
        return this._requestHelper.queryRequest(ChainMethod.getDeviceByKeyword, keyword).then(
            (device) => {
                if (!device) {
                    throw new NotFoundException('Device does not exist!');
                }
                return device;
            },
            (error) => {
                throw new InternalServerErrorException(error);
            },
        );
    }

    /**
     * Search device by name
     *
     * @returns {Promise<DeviceDto>}
     * @memberof DeviceService
     */
    queryDeviceBySearch(queryString: string): Promise<DeviceDto> {
        Log.service.info(`Chaincode name is ${ChainMethod.getDeviceBySearchQuery} and the deviceName is ${queryString}`);
        return this._requestHelper.queryRequest(ChainMethod.getDeviceBySearchQuery, queryString).then(
            (device) => {
                if (!device) {
                    throw new NotFoundException('Device does not exist!');
                }
                return device;
            },
            (error) => {
                throw new InternalServerErrorException(error);
            },
        );
    }

    /**
     * Search device by ownerId
     *
     * @returns {Promise<DeviceDto>}
     * @memberof DeviceService
     */
    queryDeviceByOwnerId(ownerId: string): Promise<DeviceDto> {
        Log.service.info(`Chaincode name is ${ChainMethod.getMyDevices} and the deviceName is ${ownerId}`);
        return this._requestHelper.queryRequest(ChainMethod.getMyDevices, ownerId).then(
            (device) => {
                if (!device) {
                    throw new NotFoundException('Device does not exist!');
                }
                return device;
            },
            (error) => {
                throw new InternalServerErrorException(error);
            },
        );
    }

    /**
     * Search device by ownerId
     *
     * @returns {Promise<DeviceDto>}
     * @memberof DeviceService
     */
    async queryUnApprovedRequest(): Promise<ResponseUtility> {
        try {
            let requestedDevices = await this._deviceRequestModel.find({ status: 'pending' }).exec();
            return ResponseUtility.generateSuccessResponse(requestedDevices);
        } catch (error) {
            return ResponseUtility.generateErrorResponse(error);
        }
    }
}

import { Injectable, Inject, InternalServerErrorException } from '@nestjs/common';
import { Model } from 'mongoose';
import { RequestDeviceDto } from '../device/model/request-device.model';
import { IAuthUser } from '../core/authentication/interfaces/authenticateduser';
import { ResponseUtility } from '../common/utils/response/response-utility';
import { IRequestDevice } from '../device/interface/request-device.interface';
import { RequestHelper } from '../core/chain/requesthelper';
import { ChainMethod } from '../chainmethods.enum';

@Injectable()
export class RequestDeviceService {

    /**
     * 
     * @param _deviceRequestModel 
     * @param _requestHelper 
     */
    constructor(@Inject('DEVICE_REQUEST_MODEL') private readonly _deviceRequestModel: Model<IRequestDevice>,
        private _requestHelper: RequestHelper) {

    }

    /**
     * request device to be borrowed
     * from the admin
     * @param {RequestDeviceDto} requestDeviceDto
     * @param {IAuthUser} authUser
     * @returns {Promise<InvokeResult>}
     * @memberof DeviceService
     */
    async requestDevice(requestDeviceDto: RequestDeviceDto, authUser: IAuthUser): Promise<ResponseUtility> {
        const deviceRequest = new this._deviceRequestModel(requestDeviceDto);
        let response = await deviceRequest.save();
        if (response != null) {
            return ResponseUtility.generateSuccessResponse(`device ${requestDeviceDto.deviceId} requested successfully `);
        } else {
            return ResponseUtility.generateErrorResponse(`request failed`);
        }
    }

    /**
    * delete device request
    * made by owner
    * @param {RequestDeviceDto} requestDeviceDto
    * @param {IAuthUser} authUser
    * @returns {Promise<InvokeResult>}
    * @memberof DeviceService
    */
    async deleteDeviceRequest(id: string, authUser: IAuthUser): Promise<ResponseUtility> {
        try {
            // await this._deviceRequestModel.findByIdAndDelete(id).exec();
            await this._deviceRequestModel.findByIdAndUpdate(id, { status: 'declined' }).exec();
            return ResponseUtility.generateSuccessResponse(`request for device is deleted`);
        } catch (error) {
            return ResponseUtility.generateErrorResponse(error);
        }
    }

    /**
     * search device by ownerId
     *
     * @returns {Promise<DeviceDto>}
     * @memberof DeviceService
     */
    async queryRequestedDeviceByOwnerId(ownerId: string): Promise<ResponseUtility> {
        try {
            let requestedDevices = await this._deviceRequestModel.find({ requestedBy: ownerId }).exec();
            return ResponseUtility.generateSuccessResponse(requestedDevices);
        } catch (error) {
            return ResponseUtility.generateErrorResponse(error);
        }
    }

    /**
    * approve device request to be borrowed
    * @param {RequestDeviceDto} requestDeviceDto
    * @param {IAuthUser} authUser
    * @returns {Promise<InvokeResult>}
    * @memberof DeviceService
    */
    async approveDeviceRequest(id: string, authUser: IAuthUser): Promise<any> {
        let requestedDevice = await this._deviceRequestModel.findByIdAndUpdate(id, { status: 'approved' }).exec();
        let deviceData = [requestedDevice.deviceId, requestedDevice.requestedBy, requestedDevice.dateOfRequest, requestedDevice.dateOfReturn, 'null'];
        return this._requestHelper.invokeRequest(ChainMethod.issueDevice, deviceData)
            .catch((error) => {
                throw new InternalServerErrorException(error);
            });
    }
}

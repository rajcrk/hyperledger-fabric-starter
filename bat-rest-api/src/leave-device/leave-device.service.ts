import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { LeaveDeviceDto } from '../device/model/leave-device.model';
import { IAuthUser } from '../core/authentication/interfaces/authenticateduser';
import { ResponseUtility } from '../common/utils/response/response-utility';
import { ILeaveDeviceRequest } from '../device/interface/leave-device-request.interface';
import { IssueDeviceDto } from '../device/model/issue-device.model';
import { DeviceService } from '../device/device.service';
import { IGoogleUser } from '../user/interfaces/google-user.interface';

@Injectable()
export class LeaveDeviceService {

    constructor(@Inject('LEAVE_DEVICE_REQUEST') private readonly _leaveDeviceRequestModel: Model<ILeaveDeviceRequest>,
        @Inject('GOOGLE_USER_MODEL') private readonly googleUserModel: Model<IGoogleUser>,
        private readonly _deviceService: DeviceService) { }

    /**
    * request device to be
    * left to another employee
    * @param {LeaveDeviceDto} leaveDeviceRequestDto
    * @param {IAuthUser} authUser
    * @returns {Promise<InvokeResult>}
    * @memberof DeviceService
    */
    async leaveDeviceRequest(leaveDeviceRequestDto: LeaveDeviceDto, authUser: IAuthUser): Promise<ResponseUtility> {
        const user = await this.googleUserModel.findOne({ email: leaveDeviceRequestDto.leaveToId }).exec();
        if (user == null) {
            return ResponseUtility.generateErrorResponse(`not a valid employee id`);
        }
        const leaveDeviceRequest = new this._leaveDeviceRequestModel(leaveDeviceRequestDto);
        let response = await leaveDeviceRequest.save();
        if (response != null) {
            return ResponseUtility.generateSuccessResponse(`request to leave device - ${leaveDeviceRequestDto.id} has been placed`);
        } else {
            return ResponseUtility.generateErrorResponse(`request failed`);
        }
    }

    /**
     * Search device by ownerId
     *
     * @returns {Promise<DeviceDto>}
     * @memberof DeviceService
     */
    async getLeaveDeviceRequest(employeeId: string, typeOfLeaveDevice: string): Promise<ResponseUtility> {
        try {
            let leaveDeviceRequest;
            if (typeOfLeaveDevice == 'tome') {
                leaveDeviceRequest = await this._leaveDeviceRequestModel.find({ leaveToId: employeeId }).exec();
            } else {
                leaveDeviceRequest = await this._leaveDeviceRequestModel.find({ ownerId: employeeId }).exec();
            }
            return ResponseUtility.generateSuccessResponse(leaveDeviceRequest);
        } catch (error) {
            return ResponseUtility.generateErrorResponse(error);
        }
    }

    /**
    * delete leave device request
    *
    * @param {RequestDeviceDto} requestDeviceDto
    * @param {IAuthUser} authUser
    * @returns {Promise<InvokeResult>}
    * @memberof DeviceService
    */
    async deleteLeaveDeviceRequest(id: string, authUser: IAuthUser): Promise<ResponseUtility> {
        try {
            await this._leaveDeviceRequestModel.findByIdAndDelete(id).exec();
            return ResponseUtility.generateSuccessResponse(`request for device is deleted`);
        } catch (error) {
            return ResponseUtility.generateErrorResponse(error);
        }
    }

    /**
    * decine device leave request
    * @param {string} id
    * @param {IAuthUser} authUser
    * @returns {Promise<InvokeResult>}
    * @memberof DeviceService
    */
    async declineDeviceRequest(id: string, authUser: IAuthUser): Promise<ResponseUtility> {
        try {
            await this._leaveDeviceRequestModel.findByIdAndUpdate(id, { status: 'declined' });
            return ResponseUtility.generateSuccessResponse(`request to leave device - ${id} has been approved`);
        } catch (error) {
            return ResponseUtility.generateErrorResponse(`request failed`);
        }
    }

    /**
    * accept device leave request
    * @param {string} id
    * @param {IAuthUser} authUser
    * @returns {Promise<InvokeResult>}
    * @memberof DeviceService
    */
    async acceptDeviceLeaveRequest(id: string, authUser: IAuthUser): Promise<ResponseUtility> {
        try {
            let leaveDeviceRequest = await this._leaveDeviceRequestModel.findById(id);
            let deviceIssue: IssueDeviceDto = {
                id: leaveDeviceRequest.id,
                ownerId: leaveDeviceRequest.leaveToId,
                comment: leaveDeviceRequest.comment,
                dateOfIssue: leaveDeviceRequest.dateOfLeave,
                dateOfReturn: leaveDeviceRequest.dateOfLeave
            };

            let response = await this._deviceService.issueDevice(deviceIssue, authUser);
            await this._leaveDeviceRequestModel.findByIdAndUpdate(id, { status: 'accepted' });
            return ResponseUtility.generateSuccessResponse(`request to leave device - ${id} has been approved`);
        } catch (error) {
            console.log(error);
            return ResponseUtility.generateErrorResponse(`failed to accept device leave request`);
        }
    }
}

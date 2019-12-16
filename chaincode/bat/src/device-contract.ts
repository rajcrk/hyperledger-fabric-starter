/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import { ErrorConstants } from './constants/error-constants';
import { Device } from './models/device';
import { ErrorResponse } from './models/response/ErrorResponse';
import { GetQuery } from './query-generator/get-query';
import { Logger } from './utility/logger-utility';
import { ResponseUtility } from './utility/response-utility';

@Info({ title: 'DeviceContract', description: 'My Smart Contract' })
export class DeviceContract extends Contract {

    @Transaction(false)
    @Returns('boolean')
    public async deviceExists(ctx: Context, deviceId: string): Promise<boolean> {
        const buffer = await ctx.stub.getState(deviceId);
        return (!!buffer && buffer.length > 0);
    }

    @Transaction()
    public async createDevice(ctx: Context, deviceId: string, name: string, description: string, ownerId: string, dateOfIssue: string, keyword: string, version: string): Promise<any> {
        try {
            const exists = await this.deviceExists(ctx, deviceId);
            if (exists) {
                throw new Error(`The device ${deviceId} already exists`);
            }
            const device = new Device();
            device.id = deviceId;
            device.name = name;
            device.description = description;
            device.ownerId = ownerId;
            device.dateOfIssue = dateOfIssue;
            device.keyword = keyword;
            device.version = version;
            const buffer = Buffer.from(JSON.stringify(device));
            await ctx.stub.putState(deviceId, buffer);

            return ResponseUtility.generateSuccessResponse(`Device with id - ${deviceId} was created successfully`);
        } catch (error) {
            return ResponseUtility.generateErrorResponse(ErrorConstants.INTERNAL_SERVER_ERR);
        }
    }

    @Transaction(false)
    @Returns('Device')
    public async readDeviceById(ctx: Context, deviceId: string): Promise<any> {
        try {
            Logger.logger('readDevice', 'Entering readDeviceById transaction');
            const exists = await this.deviceExists(ctx, deviceId);
            if (!exists) {
                return ResponseUtility.generateErrorResponse(`The device with asset id ${deviceId} does not exist`);
            }
            const buffer = await ctx.stub.getState(deviceId);
            const device = JSON.parse(buffer.toString());
            return ResponseUtility.generateSuccessResponse(device);
        } catch (error) {
            return ResponseUtility.generateErrorResponse(ErrorConstants.INTERNAL_SERVER_ERR);
        }
    }

    @Transaction()
    public async updateDevice(ctx: Context, deviceId: string, name: string, description: string, version: string): Promise<any> {
        try {
            const exists = await this.deviceExists(ctx, deviceId);
            if (!exists) {
                throw new Error(`The device ${deviceId} does not exist`);
            }
            const oldDevice = await this.readDeviceById(ctx, deviceId);
            const device = new Device();
            device.id = deviceId;
            device.name = name;
            device.description = description;
            device.keyword = oldDevice.data.keyword;
            device.ownerId = oldDevice.data.ownerId;
            device.dateOfIssue = oldDevice.data.dateOfIssue;
            device.dateOfReturn = oldDevice.data.dateOfReturn;
            device.version = version;

            const buffer = Buffer.from(JSON.stringify(device));
            await ctx.stub.putState(deviceId, buffer);

            return ResponseUtility.generateSuccessResponse(`Device with id - ${deviceId} updated successfully`);
        } catch (error) {
            Logger.logger(ErrorConstants.UPDATION_ERR, error);
            return Promise.reject(new ErrorResponse(ErrorConstants.INTERNAL_SERVER_ERR));
        }
    }

    @Transaction()
    public async deleteDevice(ctx: Context, deviceId: string) {
        try {
            const exists = await this.deviceExists(ctx, deviceId);
            if (!exists) {
                throw new Error(`The device ${deviceId} does not exist`);
            }
            await ctx.stub.deleteState(deviceId);
            return ResponseUtility.generateSuccessResponse(`Device ${deviceId} deleted Successfully`);
        } catch (error) {
            return ResponseUtility.generateErrorResponse(ErrorConstants.INTERNAL_SERVER_ERR);
        }
    }

    @Transaction()
    @Returns('Device')
    public async getAllDevices(ctx: Context): Promise<any> {
        try {
            const iterator = await ctx.stub.getStateByRange("", "");
            let results = await this.getAllResults(iterator);
            return ResponseUtility.generateSuccessResponse(JSON.parse(results));
        } catch (error) {
            return ResponseUtility.generateErrorResponse(ErrorConstants.INTERNAL_SERVER_ERR);
        }
    }

    @Transaction()
    @Returns('Device')
    public async getDeviceHistory(ctx: Context, deviceId: string): Promise<any> {
        try {
            const exists = await this.deviceExists(ctx, deviceId);
            if (!exists) {
                throw new Error(`The device with id ${deviceId} does not exist`);
            }
            const iterator = await ctx.stub.getHistoryForKey(deviceId);
            let results = await this.getAllResults(iterator);
            return ResponseUtility.generateSuccessResponse(JSON.parse(results));
        } catch (error) {
            return ResponseUtility.generateErrorResponse(ErrorConstants.INTERNAL_SERVER_ERR);
        }
    }

    @Transaction()
    @Returns('Device')
    public async issueDevice(ctx: Context, deviceId: string, newOwnerId: string, dateOfIssue: string, dateOfReturn: string, comment?: string): Promise<any> {
        try {
            const exists = await this.deviceExists(ctx, deviceId);
            if (!exists) {
                return Promise.reject(ResponseUtility.generateErrorResponse(`The device with asset id ${deviceId} does not exist`));
            }
            const oldDevice = await this.readDeviceById(ctx, deviceId);
            const device = new Device();
            device.id = deviceId;
            device.name = oldDevice.data.name;
            device.description = oldDevice.data.description;
            device.keyword = oldDevice.data.keyword;
            device.ownerId = newOwnerId;
            device.dateOfIssue = dateOfIssue;
            device.dateOfReturn = dateOfReturn;
            device.comment = comment;
            device.version = oldDevice.data.version;
            const buffer = Buffer.from(JSON.stringify(device));
            await ctx.stub.putState(deviceId, buffer);
            return ResponseUtility.generateSuccessResponse(`device issued successfully to ${newOwnerId}`);
        } catch{
            return ResponseUtility.generateErrorResponse(ErrorConstants.INTERNAL_SERVER_ERR);
        }
    }

    @Transaction()
    public async returnDevice(ctx: Context, deviceId: string, dateOfReturn: string): Promise<any> {
        try {
            const exists = await this.deviceExists(ctx, deviceId);
            if (!exists) {
                throw new Error(`The device with asset id ${deviceId} does not exist`);
            }
            const oldDevice = await this.readDeviceById(ctx, deviceId);
            const device = new Device();
            device.id = deviceId;
            device.name = oldDevice.data.name;
            device.description = oldDevice.data.description;
            device.keyword = oldDevice.data.keyword;
            device.ownerId = 'ADMIN';
            device.dateOfIssue = dateOfReturn;
            device.dateOfReturn = dateOfReturn;
            device.version = oldDevice.data.version;
            
            const buffer = Buffer.from(JSON.stringify(device));
            await ctx.stub.putState(deviceId, buffer);

            return ResponseUtility.generateSuccessResponse(`device successfully returned to ADMIN`);
        } catch{
            return ResponseUtility.generateErrorResponse(ErrorConstants.INTERNAL_SERVER_ERR);
        }
    }

    @Transaction(false)
    @Returns('Device')
    public async getDeviceByKeyword(ctx: Context, keyword: string): Promise<any> {
        try {
            let iterator = await ctx.stub.getQueryResult(GetQuery.getDeviceByKeyword(keyword));
            let results = await this.getAllResults(iterator);
            return ResponseUtility.generateSuccessResponse(JSON.parse(results));
        } catch (error) {
            return ResponseUtility.generateErrorResponse(ErrorConstants.INTERNAL_SERVER_ERR);
        }
    }

    @Transaction(false)
    @Returns('Device')
    public async getDeviceBySearchQuery(ctx: Context, queryString: string): Promise<any> {
        try {
            let iterator = await ctx.stub.getQueryResult(GetQuery.getDeviceByDeviceName(queryString));
            let results = await this.getAllResults(iterator);
            return ResponseUtility.generateSuccessResponse(JSON.parse(results));
        } catch (error) {
            return ResponseUtility.generateErrorResponse(ErrorConstants.INTERNAL_SERVER_ERR);
        }
    }

    @Transaction(false)
    @Returns('Device')
    public async getMyDevices(ctx: Context, ownerId: string): Promise<any> {
        try {
            let iterator = await ctx.stub.getQueryResult(GetQuery.getMyDevices(ownerId));
            let results = await this.getAllResults(iterator);
            return ResponseUtility.generateSuccessResponse(JSON.parse(results));
        } catch (error) {
            return ResponseUtility.generateErrorResponse(ErrorConstants.INTERNAL_SERVER_ERR);
        }
    }

    async getAllResults(iterator) {
        let allResults = [];
        while (true) {
            const res = await iterator.next();
            if (res.value && res.value.value.toString()) {
                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    Logger.logger('JSON Parsing Error in getAllResults - ', err);
                    Record = res.value.value.toString('utf8');
                }
                allResults.push({ Key, Record });
            }
            if (res.done) {
                await iterator.close();
                return JSON.stringify(allResults);
            }
        }
    }
}

"use strict";
/*
 * SPDX-License-Identifier: Apache-2.0
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const fabric_contract_api_1 = require("fabric-contract-api");
const error_constants_1 = require("./constants/error-constants");
const device_1 = require("./models/device");
const ErrorResponse_1 = require("./models/response/ErrorResponse");
const get_query_1 = require("./query-generator/get-query");
const logger_utility_1 = require("./utility/logger-utility");
const response_utility_1 = require("./utility/response-utility");
let DeviceContract = class DeviceContract extends fabric_contract_api_1.Contract {
    async deviceExists(ctx, deviceId) {
        const buffer = await ctx.stub.getState(deviceId);
        return (!!buffer && buffer.length > 0);
    }
    async createDevice(ctx, deviceId, name, description, ownerId, dateOfIssue, keyword, version) {
        try {
            const exists = await this.deviceExists(ctx, deviceId);
            if (exists) {
                throw new Error(`The device ${deviceId} already exists`);
            }
            const device = new device_1.Device();
            device.id = deviceId;
            device.name = name;
            device.description = description;
            device.ownerId = ownerId;
            device.dateOfIssue = dateOfIssue;
            device.keyword = keyword;
            device.version = version;
            const buffer = Buffer.from(JSON.stringify(device));
            await ctx.stub.putState(deviceId, buffer);
            return response_utility_1.ResponseUtility.generateSuccessResponse(`Device with id - ${deviceId} was created successfully`);
        }
        catch (error) {
            return response_utility_1.ResponseUtility.generateErrorResponse(error_constants_1.ErrorConstants.INTERNAL_SERVER_ERR);
        }
    }
    async readDeviceById(ctx, deviceId) {
        try {
            logger_utility_1.Logger.logger('readDevice', 'Entering readDeviceById transaction');
            const exists = await this.deviceExists(ctx, deviceId);
            if (!exists) {
                return response_utility_1.ResponseUtility.generateErrorResponse(`The device with asset id ${deviceId} does not exist`);
            }
            const buffer = await ctx.stub.getState(deviceId);
            const device = JSON.parse(buffer.toString());
            return response_utility_1.ResponseUtility.generateSuccessResponse(device);
        }
        catch (error) {
            return response_utility_1.ResponseUtility.generateErrorResponse(error_constants_1.ErrorConstants.INTERNAL_SERVER_ERR);
        }
    }
    async updateDevice(ctx, deviceId, name, description, version) {
        try {
            const exists = await this.deviceExists(ctx, deviceId);
            if (!exists) {
                throw new Error(`The device ${deviceId} does not exist`);
            }
            const oldDevice = await this.readDeviceById(ctx, deviceId);
            const device = new device_1.Device();
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
            return response_utility_1.ResponseUtility.generateSuccessResponse(`Device with id - ${deviceId} updated successfully`);
        }
        catch (error) {
            logger_utility_1.Logger.logger(error_constants_1.ErrorConstants.UPDATION_ERR, error);
            return Promise.reject(new ErrorResponse_1.ErrorResponse(error_constants_1.ErrorConstants.INTERNAL_SERVER_ERR));
        }
    }
    async deleteDevice(ctx, deviceId) {
        try {
            const exists = await this.deviceExists(ctx, deviceId);
            if (!exists) {
                throw new Error(`The device ${deviceId} does not exist`);
            }
            await ctx.stub.deleteState(deviceId);
            return response_utility_1.ResponseUtility.generateSuccessResponse(`Device ${deviceId} deleted Successfully`);
        }
        catch (error) {
            return response_utility_1.ResponseUtility.generateErrorResponse(error_constants_1.ErrorConstants.INTERNAL_SERVER_ERR);
        }
    }
    async getAllDevices(ctx) {
        try {
            const iterator = await ctx.stub.getStateByRange("", "");
            let results = await this.getAllResults(iterator);
            return response_utility_1.ResponseUtility.generateSuccessResponse(JSON.parse(results));
        }
        catch (error) {
            return response_utility_1.ResponseUtility.generateErrorResponse(error_constants_1.ErrorConstants.INTERNAL_SERVER_ERR);
        }
    }
    async getDeviceHistory(ctx, deviceId) {
        try {
            const exists = await this.deviceExists(ctx, deviceId);
            if (!exists) {
                throw new Error(`The device with id ${deviceId} does not exist`);
            }
            const iterator = await ctx.stub.getHistoryForKey(deviceId);
            let results = await this.getAllResults(iterator);
            return response_utility_1.ResponseUtility.generateSuccessResponse(JSON.parse(results));
        }
        catch (error) {
            return response_utility_1.ResponseUtility.generateErrorResponse(error_constants_1.ErrorConstants.INTERNAL_SERVER_ERR);
        }
    }
    async issueDevice(ctx, deviceId, newOwnerId, dateOfIssue, dateOfReturn, comment) {
        try {
            const exists = await this.deviceExists(ctx, deviceId);
            if (!exists) {
                return Promise.reject(response_utility_1.ResponseUtility.generateErrorResponse(`The device with asset id ${deviceId} does not exist`));
            }
            const oldDevice = await this.readDeviceById(ctx, deviceId);
            const device = new device_1.Device();
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
            return response_utility_1.ResponseUtility.generateSuccessResponse(`device issued successfully to ${newOwnerId}`);
        }
        catch (_a) {
            return response_utility_1.ResponseUtility.generateErrorResponse(error_constants_1.ErrorConstants.INTERNAL_SERVER_ERR);
        }
    }
    async returnDevice(ctx, deviceId, dateOfReturn) {
        try {
            const exists = await this.deviceExists(ctx, deviceId);
            if (!exists) {
                throw new Error(`The device with asset id ${deviceId} does not exist`);
            }
            const oldDevice = await this.readDeviceById(ctx, deviceId);
            const device = new device_1.Device();
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
            return response_utility_1.ResponseUtility.generateSuccessResponse(`device successfully returned to ADMIN`);
        }
        catch (_a) {
            return response_utility_1.ResponseUtility.generateErrorResponse(error_constants_1.ErrorConstants.INTERNAL_SERVER_ERR);
        }
    }
    async getDeviceByKeyword(ctx, keyword) {
        try {
            let iterator = await ctx.stub.getQueryResult(get_query_1.GetQuery.getDeviceByKeyword(keyword));
            let results = await this.getAllResults(iterator);
            return response_utility_1.ResponseUtility.generateSuccessResponse(JSON.parse(results));
        }
        catch (error) {
            return response_utility_1.ResponseUtility.generateErrorResponse(error_constants_1.ErrorConstants.INTERNAL_SERVER_ERR);
        }
    }
    async getDeviceBySearchQuery(ctx, queryString) {
        try {
            let iterator = await ctx.stub.getQueryResult(get_query_1.GetQuery.getDeviceByDeviceName(queryString));
            let results = await this.getAllResults(iterator);
            return response_utility_1.ResponseUtility.generateSuccessResponse(JSON.parse(results));
        }
        catch (error) {
            return response_utility_1.ResponseUtility.generateErrorResponse(error_constants_1.ErrorConstants.INTERNAL_SERVER_ERR);
        }
    }
    async getMyDevices(ctx, ownerId) {
        try {
            let iterator = await ctx.stub.getQueryResult(get_query_1.GetQuery.getMyDevices(ownerId));
            let results = await this.getAllResults(iterator);
            return response_utility_1.ResponseUtility.generateSuccessResponse(JSON.parse(results));
        }
        catch (error) {
            return response_utility_1.ResponseUtility.generateErrorResponse(error_constants_1.ErrorConstants.INTERNAL_SERVER_ERR);
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
                }
                catch (err) {
                    logger_utility_1.Logger.logger('JSON Parsing Error in getAllResults - ', err);
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
};
__decorate([
    fabric_contract_api_1.Transaction(false),
    fabric_contract_api_1.Returns('boolean'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], DeviceContract.prototype, "deviceExists", null);
__decorate([
    fabric_contract_api_1.Transaction(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], DeviceContract.prototype, "createDevice", null);
__decorate([
    fabric_contract_api_1.Transaction(false),
    fabric_contract_api_1.Returns('Device'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], DeviceContract.prototype, "readDeviceById", null);
__decorate([
    fabric_contract_api_1.Transaction(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, String, String, String]),
    __metadata("design:returntype", Promise)
], DeviceContract.prototype, "updateDevice", null);
__decorate([
    fabric_contract_api_1.Transaction(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], DeviceContract.prototype, "deleteDevice", null);
__decorate([
    fabric_contract_api_1.Transaction(),
    fabric_contract_api_1.Returns('Device'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context]),
    __metadata("design:returntype", Promise)
], DeviceContract.prototype, "getAllDevices", null);
__decorate([
    fabric_contract_api_1.Transaction(),
    fabric_contract_api_1.Returns('Device'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], DeviceContract.prototype, "getDeviceHistory", null);
__decorate([
    fabric_contract_api_1.Transaction(),
    fabric_contract_api_1.Returns('Device'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], DeviceContract.prototype, "issueDevice", null);
__decorate([
    fabric_contract_api_1.Transaction(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, String]),
    __metadata("design:returntype", Promise)
], DeviceContract.prototype, "returnDevice", null);
__decorate([
    fabric_contract_api_1.Transaction(false),
    fabric_contract_api_1.Returns('Device'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], DeviceContract.prototype, "getDeviceByKeyword", null);
__decorate([
    fabric_contract_api_1.Transaction(false),
    fabric_contract_api_1.Returns('Device'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], DeviceContract.prototype, "getDeviceBySearchQuery", null);
__decorate([
    fabric_contract_api_1.Transaction(false),
    fabric_contract_api_1.Returns('Device'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], DeviceContract.prototype, "getMyDevices", null);
DeviceContract = __decorate([
    fabric_contract_api_1.Info({ title: 'DeviceContract', description: 'My Smart Contract' })
], DeviceContract);
exports.DeviceContract = DeviceContract;
//# sourceMappingURL=device-contract.js.map
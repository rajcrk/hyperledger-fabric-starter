import { Context, Contract } from 'fabric-contract-api';
import { ErrorResponse } from './models/response/ErrorResponse';
export declare class DeviceContract extends Contract {
    deviceExists(ctx: Context, deviceId: string): Promise<boolean>;
    createDevice(ctx: Context, deviceId: string, name: string, description: string, ownerId: string, dateOfIssue: string, keyword: string, version: string): Promise<any>;
    readDeviceById(ctx: Context, deviceId: string): Promise<any>;
    updateDevice(ctx: Context, deviceId: string, name: string, description: string, version: string): Promise<any>;
    deleteDevice(ctx: Context, deviceId: string): Promise<ErrorResponse | import("./models/response/SuccessResponse").SuccessResponse>;
    getAllDevices(ctx: Context): Promise<any>;
    getDeviceHistory(ctx: Context, deviceId: string): Promise<any>;
    issueDevice(ctx: Context, deviceId: string, newOwnerId: string, dateOfIssue: string, dateOfReturn: string, comment?: string): Promise<any>;
    returnDevice(ctx: Context, deviceId: string, dateOfReturn: string): Promise<any>;
    getDeviceByKeyword(ctx: Context, keyword: string): Promise<any>;
    getDeviceBySearchQuery(ctx: Context, queryString: string): Promise<any>;
    getMyDevices(ctx: Context, ownerId: string): Promise<any>;
    getAllResults(iterator: any): Promise<string>;
}

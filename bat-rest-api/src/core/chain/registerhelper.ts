import { Injectable } from '@nestjs/common';
import { Appconfig } from '../../common/config/appconfig';
import { HlfCaClient } from './hlfcaclient';

@Injectable()
export class RegisterHelper {

    /**
     * Creates an instance of RequestHelper.
     * @memberof RegisterHelper
     */
    constructor(private hlfCaClient: HlfCaClient) {
    }

    /**
     * 
     *
     * @param {string} userId
     * @param {string} userName
     * @param {string} employeeId
     * @returns {Promise<any>}
     * @memberof RegisterHelper
     */
    public async registerUser(userName: any, employeeId: string): Promise<any> {
        return this.hlfCaClient.createUser(userName, Appconfig.hlf.admin.MspID, '', [{name: userName, value: employeeId}])
            .then((response) => {
                return Promise.resolve(response);
            })
            .catch((error) => {
                return Promise.reject(error);
            });
    }

    /**
     * 
     *
     * @param {string} userId
     * @returns {Promise<any>}
     * @memberof RegisterHelper
     */
    public async loginUser(userId: string): Promise<any> {
        return this.hlfCaClient.getUserFromStore(userId)
            .then((response) => {
                return Promise.resolve(response);
            })
            .catch((error) => {
                return Promise.reject(error);
            });
    }
}

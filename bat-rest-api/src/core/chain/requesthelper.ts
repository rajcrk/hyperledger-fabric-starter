import { Inject, Injectable } from '@nestjs/common';
import { ChainMethod } from '../../chainmethods.enum';
import { EnvConfig } from '../../common/config/env';
import { InvokeResult } from '../../common/utils/invokeresult.model';
import { Log } from '../../common/utils/logging/log.service';
import { IEventService } from '../events/interfaces/event.interface';
import { PusherService } from '../events/pusher/pusher.service';
import { HlfClient } from './hlfclient';
import { map } from 'rxjs/operators';

@Injectable()
export class RequestHelper {
    // TODO: refactor invokes according to https://docs.nestjs.com/recipes/cqrs

    /**
     * Creates an instance of RequestHelper.
     * @param {HlfClient} hlfClient
     * @param {PusherService} eventService
     * @memberof RequestHelper
     */
    constructor(private hlfClient: HlfClient,
        @Inject('IEventService') private eventService: IEventService
    ) {
    }

    /**
     * 
     *
     * @param {ChainMethod} chainMethod
     * @param {Object} params
     * @param {string} userId
     * @param invokeAlways - Workaround for message deduplication SQS
     * @param transientMap
     * @returns {Promise<InvokeResult>}
     * @memberof RequestHelper
     */
    public invokeRequest(chainMethod: ChainMethod, params: any, userId?: string, invokeAlways = false, transientMap?: Object): Promise<InvokeResult | any> {
        return this.hlfClient
            .invoke(chainMethod, params, transientMap)
            .then((response) => {
                Log.hlf.debug('Invoke successfully executed: the response is ', response);
                // this.eventService.triggerSuccess(userId, chainMethod, params);
                return { txHash: response };
            })
            .catch((error) => {
                Log.hlf.error(` Invoke chaincode has an error on method ${chainMethod}`, error);
                this.eventService.triggerError(userId, chainMethod, params);
                throw error;
            });
    }

    /**
     * Query hlf chain and return response
     *
     * @param {ChainMethod} chainMethod
     * @param {Object} params
     * @param transientMap
     * @returns {Promise<any>}
     * @memberof RequestHelper
     */
    public queryRequest(chainMethod: ChainMethod, params?: any, transientMap?: Object): Promise<any> {
        let args;
        /**
         * Condition to check if the params is null or not
         * getAllDevices would require args = []
         */
        if(params != null){
            args = [params];
        }else{
            args = [];
        }
        return this.hlfClient
            .query(chainMethod, args, transientMap)
            .then((response) => {
                Log.hlf.debug('Query successfully executed!');
                return response;
            })
            .catch((error) => {
                Log.hlf.error(`${chainMethod}`, error);
                throw error;
            });
    }
}

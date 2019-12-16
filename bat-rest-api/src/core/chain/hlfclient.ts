import { HlfInfo } from './logging.enum';
import { Injectable } from '@nestjs/common';
import { ChainService } from './chain.service';
import { HlfConfig } from './hlfconfig';
import { IKeyValueStore, ProposalResponseObject, TransactionRequest } from 'fabric-client';
import FabricClient = require('fabric-client');
import { Appconfig } from '../../common/config/appconfig';
import { ChainMethod } from '../../chainmethods.enum';
import { Log } from '../../common/utils/logging/log.service';


var fs = require('fs');
var path = require('path');

const ccpPath = path.resolve(__dirname, '..', '..', 'first-network', 'connection-org1.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);


@Injectable()
export class HlfClient extends ChainService {

    constructor(public hlfConfig: HlfConfig) {
        super(hlfConfig);
    }

    /**
     * init
     * @returns {Promise<any>}
     * @memberof ChainService
     */
    init(): Promise<any> {

        this.hlfConfig.options = Appconfig.hlf;
        this.hlfConfig.client = new FabricClient();
        // Create a new CA client for interacting with the CA.
        const peerInfo =  ccp.peers['peer0.org1.example.com'];
        var peer1TLSCACerts = peerInfo.tlsCACerts.pem;

        Log.hlf.info('PEER CERTIFICATE - [peer0.org1.example.com]\n');
        Log.hlf.info(peer1TLSCACerts);
        return FabricClient
            .newDefaultKeyValueStore({
                path: this.hlfConfig.options.walletPath
            })
            .then((wallet: IKeyValueStore) => {
                console.log(wallet);
                // assign the store to the fabric client
                this.hlfConfig.client.setStateStore(wallet);
                let cryptoSuite = FabricClient.newCryptoSuite();
                // use the same location for the state store (where the users' certificate are kept)
                // and the crypto store (where the users' keys are kept)
                let cryptoStore = FabricClient.newCryptoKeyStore({ path: this.hlfConfig.options.walletPath });
                cryptoSuite.setCryptoKeyStore(cryptoStore);
                this.hlfConfig.client.setCryptoSuite(cryptoSuite);

                this.hlfConfig.channel = this.hlfConfig.client.newChannel(this.hlfConfig.options.channelId);
                const peerObj = this.hlfConfig.client.newPeer(this.hlfConfig.options.networkUrl, {
                    'ssl-target-name-override': 'peer0.org1.example.com',
                    pem: peer1TLSCACerts
                });

                this.hlfConfig.channel.addPeer(peerObj, 'Org1MSP');
                this.hlfConfig.channel.addOrderer(this.hlfConfig.client.newOrderer(this.hlfConfig.options.ordererUrl, {
                    'ssl-target-name-override': 'orderer.example.com',
                    pem: peer1TLSCACerts
                }));
                this.hlfConfig.targets.push(peerObj);

                Log.hlf.info(HlfInfo.INIT_SUCCESS);
            });
    }

    /**
     * Query hlf
     *
     * @param {ChainMethod} chainMethod
     * @param {string[]} params
     * @param transientMap
     * @returns {Promise<any>}
     * @memberof HlfClient
     */
    query(chainMethod: ChainMethod, params: string[], transientMap?: Object): Promise<any> {
        Log.hlf.info(HlfInfo.MAKE_QUERY, chainMethod, params);
        return this.newQuery(chainMethod, params, this.hlfConfig.options.chaincodeId, transientMap)
            .then((queryResponses: Buffer[]) => {
                return Promise.resolve(this.getQueryResponse(queryResponses));
            });
    }

    /**
     * invoke
     *
     * @param {ChainMethod} chainMethod
     * @param { string[]} params
     * @param transientMap
     * @returns
     * @memberof ChainService
     */
    invoke(chainMethod: ChainMethod, params: string[], transientMap?: Object) {
        Log.hlf.info(chainMethod, params);
        return this.sendTransactionProposal(chainMethod, params, this.hlfConfig.options.chaincodeId, transientMap)
            .then((result: { txHash: string; buffer: ProposalResponseObject }) => {
                // Log.hlf.debug(JSON.stringify(result.buffer));
                Log.hlf.info(HlfInfo.CHECK_TRANSACTION_PROPOSAL);

                if (this.isProposalGood(result.buffer)) {
                    try {
                        this.logSuccessfulProposalResponse(result.buffer);

                        let request: TransactionRequest = {
                            proposalResponses: result.buffer[0],
                            proposal: result.buffer[1]
                        };
                        Log.hlf.info(HlfInfo.REGISTERING_TRANSACTION_EVENT);

                        let sendPromise = this.hlfConfig.channel.sendTransaction(request);

                        let txPromise = this.registerTxEvent(result.txHash);

                        return Promise.all([sendPromise, txPromise]);
                    } catch (error) {
                        Log.hlf.error(error);
                    }
                } else {
                    let message = result.buffer[0][0].response.message;

                    if (message.indexOf(' transaction returned with failure: ') !== -1) {
                        message = message.split(' transaction returned with failure: ')[1];

                        try {
                            message = JSON.parse(message);
                        } catch (e) {
                            Log.hlf.error(e);
                        }
                    }
                    return Promise.reject(message);
                }
            })
            .then((results) => {
                if (!results || (results && results[0] && results[0].status !== 'SUCCESS')) {
                    Log.hlf.error('Failed to order the transaction. Error code: ' + results[0].status);
                    return Promise.reject('Failed to order the transaction. Error code: ' + results[0].status);
                }
                if (!results || (results && results[1] && results[1].event_status !== 'VALID')) {
                    Log.hlf.error('Transaction failed to be committed to the ledger due to ::' + results[1].event_status);
                    return Promise.reject('Transaction failed to be committed to the ledger due to ::' + results[1].event_status);
                }
                /**
                 * Return only the response of the sendTransaction promise, with 
                 * the status property of SUCCESS
                 */
                return Promise.resolve(results[0]);
            });
    }
}

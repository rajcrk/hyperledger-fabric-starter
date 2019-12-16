import { EnvConfig } from './env';
import * as path from 'path';
import { ConfigOptions } from './config.model';
import { PusherService } from '../../core/events/pusher/pusher.service';
import { Auth0AuthenticationService } from '../../core/authentication/auth0/auth0-authentication.service';
import { HeaderAuthenticationService } from '../../core/authentication/headerMock/header-authentication.service';


var fs = require('fs');

const ccpPath = path.resolve(__dirname, '..', '..', 'first-network', 'connection-org1.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

// Create a new CA client for interacting with the CA.
const caInfo = ccp.certificateAuthorities['ca.org1.example.com'];
const caTLSCACerts = caInfo.tlsCACerts.pem;

export const Appconfig: ConfigOptions = {
    hlf: {
        walletPath: path.resolve(__dirname, `creds`),
        userId: 'admin',
        channelId: 'mychannel',
        chaincodeId: 'bat',
        networkUrl: `grpcs://peer0.org1.example.com:7051`,
        eventUrl: `grpcs:/peer0.org1.example.com:7053`,
        ordererUrl: `grpcs://orderer.example.com:7050`,
        caUrl: "https://ca0:7054",
        admin: {
            enrollmentID: 'admin',
            enrollmentSecret: 'adminpw',
            MspID: ccp.organizations.mspid,
        },
        tlsOptions: {
            trustedRoots: caTLSCACerts,
            verify: false
        },
        caName: caInfo.caName
    },
    allowguest: true
} as ConfigOptions;

export const EventService = { provide: 'IEventService', useClass: PusherService };
export const AuthService = { provide: 'IAuthService', useClass: EnvConfig.AUTH0_DOMAIN ? Auth0AuthenticationService : HeaderAuthenticationService };

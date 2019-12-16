import {log} from 'winston';
import { stringify } from 'querystring';

export class Logger {
    public static logger(transactionName: string, logMessage: string) {
        log('info',`Log from transaction - ${transactionName} | Log message - ${logMessage}`);
    }
}
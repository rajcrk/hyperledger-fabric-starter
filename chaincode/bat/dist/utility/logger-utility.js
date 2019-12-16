"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
class Logger {
    static logger(transactionName, logMessage) {
        winston_1.log('info', `Log from transaction - ${transactionName} | Log message - ${logMessage}`);
    }
}
exports.Logger = Logger;
//# sourceMappingURL=logger-utility.js.map
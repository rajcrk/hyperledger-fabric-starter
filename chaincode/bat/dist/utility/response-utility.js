"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SuccessResponse_1 = require("../models/response/SuccessResponse");
const ErrorResponse_1 = require("../models/response/ErrorResponse");
class ResponseUtility {
    static generateSuccessResponse(responseMessage) {
        return new SuccessResponse_1.SuccessResponse(responseMessage);
    }
    static generateErrorResponse(responseMessage) {
        return new ErrorResponse_1.ErrorResponse(responseMessage);
    }
}
exports.ResponseUtility = ResponseUtility;
//# sourceMappingURL=response-utility.js.map
import { SuccessResponse } from "../models/response/SuccessResponse";
import { ErrorResponse } from "../models/response/ErrorResponse";

export class ResponseUtility {
    static generateSuccessResponse(responseMessage: string) {
        return new SuccessResponse(responseMessage);
    }

    static generateErrorResponse(responseMessage: string) {
        return new ErrorResponse(responseMessage);
    }
}
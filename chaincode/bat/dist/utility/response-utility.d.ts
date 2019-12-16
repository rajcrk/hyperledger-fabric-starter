import { SuccessResponse } from "../models/response/SuccessResponse";
import { ErrorResponse } from "../models/response/ErrorResponse";
export declare class ResponseUtility {
    static generateSuccessResponse(responseMessage: string): SuccessResponse;
    static generateErrorResponse(responseMessage: string): ErrorResponse;
}

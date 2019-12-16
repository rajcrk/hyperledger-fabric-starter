import { SuccessResponse } from './SuccessResponse';
import { ErrorResponse } from './ErrorResponse';

export class ResponseUtility {
    static generateSuccessResponse(responseMessage: string) {
        return new SuccessResponse(responseMessage);
    }

    static generateErrorResponse(responseMessage: string) {
        return new ErrorResponse(responseMessage);
    }
}
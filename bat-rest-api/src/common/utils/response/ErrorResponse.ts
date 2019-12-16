export class ErrorResponse {

    isSuccess = false;
    message: any;

    constructor(response: any) {
        this.message = response;
    }
}

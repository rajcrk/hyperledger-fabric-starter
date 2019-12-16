export class ErrorResponse {

    isSuccess: boolean = false;
    message: any;

    constructor(response: any) {
        this.message = response;
    }
}

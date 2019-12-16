export class SuccessResponse {

    isSuccess = true;
    data: any;

    constructor(response: any) {
        this.data = response;
    }

}
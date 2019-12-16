export class SuccessResponse {

    isSuccess: boolean = true;
    data: any;

    constructor(response: any) {
        this.data = response;
    }

}
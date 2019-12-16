export class GetQuery {

    public static getDeviceByKeyword(deviceKeyword: string) {

        const selector = {
            selector: {
                keyword: {
                    "$regex": deviceKeyword
                }
            }
        }
        return JSON.stringify(selector);
    }

    public static getDeviceByDeviceName(searchQuery: string) {

        const selector = {
            selector: {
                name: {
                    "$regex": "(?i)"+searchQuery
                }
            }
        }
        return JSON.stringify(selector);
    }

    public static getMyDevices(ownerId: string) {

        const selector = {
            selector: {
                ownerId: {
                    "$regex": ownerId
                }
            }
        }
        return JSON.stringify(selector);
    }

    
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GetQuery {
    static getDeviceByKeyword(deviceKeyword) {
        const selector = {
            selector: {
                keyword: {
                    "$regex": deviceKeyword
                }
            }
        };
        return JSON.stringify(selector);
    }
    static getDeviceByDeviceName(searchQuery) {
        const selector = {
            selector: {
                name: {
                    "$regex": "(?i)" + searchQuery
                }
            }
        };
        return JSON.stringify(selector);
    }
    static getMyDevices(ownerId) {
        const selector = {
            selector: {
                ownerId: {
                    "$regex": ownerId
                }
            }
        };
        return JSON.stringify(selector);
    }
}
exports.GetQuery = GetQuery;
//# sourceMappingURL=get-query.js.map
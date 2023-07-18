import {CustomHttp} from "./custom-http.js";
import config from "../../config/config.js";

export class Balance {
    static async balanceInfo () {
        try {
            const result = await CustomHttp.request(config.host + '/balance');
            if (result) {
                if (result.error) {
                    throw new Error(result.message);
                }
                return result.balance;
            }
        } catch (error) {
            console.log(error);
        }
    };

    static async balanceUpdate () {
        const balanceInfo = await this.balanceInfo();
        try {
            const result = await CustomHttp.request(config.host + '/balance', 'PUT', {
                newBalance: balanceInfo
            });
            if (result) {
                if (result.error) {
                    throw new Error(result.message);
                }
                return result.balance;
            }
        } catch (error) {
            console.log(error);
        }
    };
}
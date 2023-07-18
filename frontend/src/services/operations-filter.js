import {CustomHttp} from "./custom-http.js";
import config from "../../config/config.js";

export class OperationsFilter {
    static async filter(activeItemFilter) {
        try {
            let result;
            const dateFrom = document.getElementById('dateFrom').value;
            const dateTo = document.getElementById('dateTo').value;

            switch (activeItemFilter) {
                case 'today':
                    result = await CustomHttp.request(config.host + '/operations');
                    break;
                case 'week':
                    result = await CustomHttp.request(config.host + '/operations/?period=week');
                    break;
                case 'month':
                    result = await CustomHttp.request(config.host + '/operations/?period=month');
                    break;
                case 'year':
                    result = await CustomHttp.request(config.host + '/operations/?period=year');
                    break;
                case 'all':
                    result = await CustomHttp.request(config.host + '/operations/?period=all');
                    break;
                case 'interval':
                    result = await CustomHttp.request(config.host +
                        '/operations?period=interval&dateFrom=' + dateFrom + '&dateTo=' + dateTo);
                    break;
            }
            if (result) {
                if (result.error) {
                    throw new Error(result.message);
                }
                return result;
            }
        } catch (error) {
            console.log(error);
        }
    };
}
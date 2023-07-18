import {UrlManager} from "../utils/url-manager.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class CategoryCreateUpdate {
    constructor(page) {
        this.inputCategory = document.getElementById('input-category');
        this.routeParams = UrlManager.getQueryParams();
        this.page = page;

        this.init();

        const that = this;
        document.getElementById('save').onclick = function () {
            that.processCreateUpdateCategory();
        };
    };

    init() {
        if (this.page === 'income-update' || this.page === 'expense-update') {
            this.inputCategory.value = this.routeParams.title;
        }
    };

    async processCreateUpdateCategory() {
        if (this.inputCategory.value) {
            this.inputCategory.removeAttribute("style");

            if (this.page === 'income-create') {
                try {
                    const result = await CustomHttp.request(config.host + '/categories/income/', 'POST', {
                        title: this.inputCategory.value
                    });
                    if (result) {
                        if (result.error) {
                            throw new Error(result.message);
                        }
                        location.href = '#/income';
                    }
                } catch (error) {
                    console.log(error);
                }
            }

            if (this.page === 'expense-create') {
                try {
                    const result = await CustomHttp.request(config.host + '/categories/expense/', 'POST', {
                        title: this.inputCategory.value
                    });
                    if (result) {
                        if (result.error) {
                            throw new Error(result.message);
                        }
                        location.href = '#/expense';
                    }
                } catch (error) {
                    console.log(error);
                }
            }


            if (this.page === 'income-update') {
                try {
                    const result = await CustomHttp.request(config.host + '/categories/income/' + Number(this.routeParams.id), 'PUT', {
                        title: this.inputCategory.value
                    });
                    if (result) {
                        if (result.error) {
                            throw new Error(result.message);
                        }
                        location.href = '#/income';
                    }
                } catch (error) {
                    console.log(error);
                }
            }

            if (this.page === 'expense-update') {
                try {
                    const result = await CustomHttp.request(config.host + '/categories/expense/' + Number(this.routeParams.id), 'PUT', {
                        title: this.inputCategory.value
                    });
                    if (result) {
                        if (result.error) {
                            throw new Error(result.message);
                        }
                        location.href = '#/expense';
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        } else {
            this.inputCategory.style.borderColor = "red";
        }
    };
}
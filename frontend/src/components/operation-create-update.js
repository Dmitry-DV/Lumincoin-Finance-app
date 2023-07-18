import {UrlManager} from "../utils/url-manager.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Balance} from "../services/balance.js";

export class OperationCreateUpdate {
    constructor(page) {
        this.page = page;
        this.categoryIncome = [];
        this.categoryExpense = [];
        this.routeParams = UrlManager.getQueryParams();

        this.init();

        const that = this;
        document.getElementById('save').onclick = function () {
            that.processUpdateOperation();
        };
    };

    async init() {
        try {
            const result = await CustomHttp.request(config.host + '/categories/income');
            if (result) {
                if (result.error) {
                    throw new Error(result.message);
                }
                this.categoryIncome = result;
            }
        } catch (error) {
            console.log(error);
        }

        try {
            const result = await CustomHttp.request(config.host + '/categories/expense');
            if (result) {
                if (result.error) {
                    throw new Error(result.message);
                }
                this.categoryExpense = result;
            }
        } catch (error) {
            console.log(error);
        }

        this.infoOperation();
    };

    infoOperation() {
        const that = this;
        const selectType = document.getElementById('select-type');
        const selectOptionType = document.getElementsByClassName('select-option-type');
        const selectCategory = document.getElementById('select-category');
        const inputAmount = document.getElementById('input-amount');
        const inputDate = document.getElementById('input-date');
        const inputComment = document.getElementById('input-comment');

        Array.from(selectOptionType).find(optionItem => {
            if (optionItem.value === this.routeParams.type) {
                optionItem.selected = true;

                if (that.routeParams.type === 'income') {
                    that.categoryIncome.forEach(incomeItem => {
                        const optionCategory = document.createElement('option');
                        optionCategory.innerText = incomeItem.title;
                        optionCategory.setAttribute('data-id', incomeItem.id);
                        if (this.page === 'update-operation') {
                            if (incomeItem.title === that.routeParams.category) {
                                optionCategory.selected = true;
                            }
                        }
                        selectCategory.appendChild(optionCategory);
                    });

                } else if (that.routeParams.type === 'expense') {
                    that.categoryExpense.forEach(expenseItem => {
                        const optionCategory = document.createElement('option');
                        optionCategory.innerText = expenseItem.title;
                        optionCategory.setAttribute('data-id', expenseItem.id);
                        if (this.page === 'update-operation') {
                            if (expenseItem.title === that.routeParams.category) {
                                optionCategory.selected = true;
                            }
                        }
                        selectCategory.appendChild(optionCategory);
                    });
                }
                if (this.page === 'update-operation') {
                    inputAmount.value = that.routeParams.amount;
                    inputDate.value = that.routeParams.date;
                    inputComment.value = that.routeParams.comment;
                }
            }
        });

        selectType.addEventListener('change', function () {
            selectCategory.innerHTML = '';
            if (event.target.value === 'income') {
                that.categoryIncome.forEach(incomeItem => {
                    const optionCategory = document.createElement('option');
                    optionCategory.innerText = incomeItem.title;
                    optionCategory.setAttribute('data-id', incomeItem.id);
                    selectCategory.appendChild(optionCategory);
                })
            } else if (event.target.value === 'expense') {
                that.categoryExpense.forEach(expenseItem => {
                    const optionCategory = document.createElement('option');
                    optionCategory.innerText = expenseItem.title;
                    optionCategory.setAttribute('data-id', expenseItem.id);
                    selectCategory.appendChild(optionCategory);
                })
            }
        });
    };

    validateFields() {
        const fields = document.getElementsByClassName(' control-input');
        return Array.from(fields).every(field => {
            if (!field.value) {
                field.style.borderColor = "red";
                return false;
            } else {
                field.removeAttribute("style");
                return true;
            }
        });
    };

    async processUpdateOperation() {
        if (this.validateFields()) {
            const type = document.getElementById('select-type').value;
            const amount = Number(document.getElementById('input-amount').value);
            const date = document.getElementById('input-date').value;
            const comment = document.getElementById('input-comment').value;

            const categoryOptions = document.getElementById('select-category').options;
            const categoryActiveOption = Array.from(categoryOptions).find(categoryOption => {
                return categoryOption.selected;
            });
            const categoryId = Number(categoryActiveOption.getAttribute('data-id'));

            if (this.page === 'update-operation') {
                try {
                    const result = await CustomHttp.request(config.host + '/operations/' + this.routeParams.id, "PUT", {
                        type: type,
                        amount: amount,
                        date: date,
                        comment: comment,
                        category_id: categoryId
                    });
                    if (result) {
                        if (result.error) {
                            throw new Error(result.message);
                        }
                        config.balance.innerText = await Balance.balanceUpdate();
                        location.href = '#/operations';
                    }
                } catch (error) {
                    console.log(error);
                }
            } else if (this.page === 'create-operation') {
                try {
                    const result = await CustomHttp.request(config.host + '/operations', "POST", {
                        type: type,
                        amount: amount,
                        date: date,
                        comment: comment,
                        category_id: categoryId
                    });
                    if (result) {
                        if (result.error) {
                            throw new Error(result.message);
                        }
                        config.balance.innerText = await Balance.balanceUpdate();
                        location.href = '#/operations';
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        }
    };
}
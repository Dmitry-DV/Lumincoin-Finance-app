import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {NavigationControl} from "../services/navigation-control.js";
import {Balance} from "../services/balance.js";

export class CategoryIncomeAndExpense {
    constructor(page) {
        this.page = page;
        switch (this.page) {
            case 'income':
                NavigationControl.selectActiveNavigationItem(document.getElementById('nav-income'), document.getElementById('nav-category'));
                break;
            case 'expense':
                NavigationControl.selectActiveNavigationItem(document.getElementById('nav-expense'), document.getElementById('nav-category'));
                break;
        }

        this.categoryMain = document.getElementById('category-items');
        this.dataCategories = [];
        this.init();
    };

    async init() {
        if (this.page === 'income') {
            try {
                const result = await CustomHttp.request(config.host + '/categories/income');
                if (result) {
                    if (result.error) {
                        throw new Error(result.message);
                    }
                    this.dataCategories = result;
                    this.processCreateCategories();
                }
            } catch (error) {
                console.log(error);
            }
        } else if (this.page === 'expense') {
            try {
                const result = await CustomHttp.request(config.host + '/categories/expense');
                if (result) {
                    if (result.error) {
                        throw new Error(result.message);
                    }
                    this.dataCategories = result;
                    this.processCreateCategories();
                }
            } catch (error) {
                console.log(error);
            }
        }
    };

    processCreateCategories() {
        this.categoryMain = document.getElementById('category-items');
        let that = this;

        this.dataCategories.forEach(category => {
            const categoryElement = document.createElement("div");
            categoryElement.className = "category-item";
            categoryElement.setAttribute('data-id', category.id);
            categoryElement.setAttribute('data-title', category.title);

            const categoryTitleElement = document.createElement("h2");
            categoryTitleElement.className = 'category-item-title';
            categoryTitleElement.innerText = category.title;

            const categoryActionElement = document.createElement("div");
            categoryActionElement.className = 'category-item-actions d-flex align-items-center';
            const categoryActionLinkElement = document.createElement("a");
            if (this.page === 'income') {
                categoryActionLinkElement.setAttribute('href', '#/income-update?id=' + category.id + "&title=" + category.title);
            } else if (this.page === 'expense') {
                categoryActionLinkElement.setAttribute('href', '#/expense-update?id=' + category.id + "&title=" + category.title);
            }
            const categoryActionLinkButtonElement = document.createElement("button");
            categoryActionLinkButtonElement.className = 'btn btn-primary btn-create';
            categoryActionLinkButtonElement.innerText = 'Редактировать';
            const categoryActionButtonDeleteElement = document.createElement("button");
            categoryActionButtonDeleteElement.className = 'btn btn-danger btn-delete';
            categoryActionButtonDeleteElement.setAttribute('data-bs-toggle', 'modal');
            categoryActionButtonDeleteElement.setAttribute('data-bs-target', '#exampleModal');
            categoryActionButtonDeleteElement.innerText = 'Удалить';

            categoryActionLinkElement.appendChild(categoryActionLinkButtonElement);
            categoryActionElement.appendChild(categoryActionLinkElement);
            categoryActionElement.appendChild(categoryActionButtonDeleteElement);

            categoryElement.appendChild(categoryTitleElement);
            categoryElement.appendChild(categoryActionElement);

            that.categoryMain.prepend(categoryElement);

            categoryActionButtonDeleteElement.addEventListener('click', function () {
                that.processDeleteCategories.call(arguments, categoryElement, that);
            });
        });
    };

    async processDeleteCategories(categoryActiveElement, that) {
        const categoryActiveElementId = categoryActiveElement.getAttribute('data-id');
        const categoryActiveElementTitle = categoryActiveElement.getAttribute('data-title');

        document.getElementById('delete-category').onclick = async function () {
            let allOperations = [];

            try {
                const result = await CustomHttp.request(config.host + '/operations/?period=all');
                if (result) {
                    if (result.error) {
                        throw new Error(result.message);
                    }
                    allOperations = result;
                }
            } catch (error) {
                console.log(error);
            }

            allOperations.forEach(operation => {
                if (operation.category === categoryActiveElementTitle) {
                    that.processDeleteOperation(operation.id);
                }
            });

            if (that.page === 'income') {
                try {
                    const result = await CustomHttp.request(config.host + '/categories/income/' + categoryActiveElementId, 'DELETE');
                    if (result) {
                        if (result.error) {
                            throw new Error(result.message);
                        }
                        that.categoryMain.innerHTML = '';
                        that.init();
                    }
                } catch (error) {
                    console.log(error);
                }
            } else if (that.page === 'expense') {
                try {
                    const result = await CustomHttp.request(config.host + '/categories/expense/' + categoryActiveElementId, 'DELETE');
                    if (result) {
                        if (result.error) {
                            throw new Error(result.message);
                        }
                        that.categoryMain.innerHTML = '';
                        that.init();
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        };
    };

    async processDeleteOperation(operationId) {
        try {
            const result = await CustomHttp.request(config.host + '/operations/' + operationId, 'DELETE');
            if (result) {
                if (result.error) {
                    throw new Error(result.message);
                }
                config.balance.innerText = await Balance.balanceUpdate();
            }
        } catch (error) {
            console.log(error);
        }
    };
}
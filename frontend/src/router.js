import {Form} from "./components/form.js";
import {CategoryIncomeAndExpense} from "./components/category-income-and-expense.js";
import {CategoryCreateUpdate} from "./components/category-create-update.js";
import {Operations} from "./components/operations.js";
import {OperationCreateUpdate} from "./components/operation-create-update.js";
import {ChartOperations} from "./components/сhart-operations.js";
import {Auth} from "./services/auth.js";
import {Balance} from "./services/balance.js";
import config from "../config/config.js";

export class Router {
    constructor() {
        this.contentElement = document.getElementById('content');
        this.stylesElement = document.getElementById('styles');
        this.titleElement = document.getElementById('title');
        this.profileFullName = document.getElementById('profile-Full-Name');

        this.routes = [
            {
                route: '#/',
                title: 'Главная',
                template: 'templates/main.html',
                styles: "",
                load: () => {
                    new ChartOperations();
                }
            },
            {
                route: '#/login',
                title: 'Вход',
                template: 'templates/login.html',
                styles: "styles/form.css",
                load: () => {
                    new Form('login');
                }
            },
            {
                route: '#/signup',
                title: 'Регистрация',
                template: 'templates/signup.html',
                styles: "styles/form.css",
                load: () => {
                    new Form('signup');
                }
            },
            {
                route: '#/income',
                title: 'Доходы',
                template: 'templates/income.html',
                styles: "styles/category-income-and-expense.css",
                load: () => {
                    new CategoryIncomeAndExpense('income');
                }
            },
            {
                route: '#/income-update',
                title: 'Редактировать доход',
                template: 'templates/income-update.html',
                styles: "styles/category-create-change.css",
                load: () => {
                    new CategoryCreateUpdate('income-update');
                }
            },
            {
                route: '#/income-create',
                title: 'Создать категорию дохода',
                template: 'templates/income-create.html',
                styles: "styles/category-create-change.css",
                load: () => {
                    new CategoryCreateUpdate('income-create');
                }
            },

            {
                route: '#/expense',
                title: 'Расходы',
                template: 'templates/expense.html',
                styles: "styles/category-income-and-expense.css",
                load: () => {
                    new CategoryIncomeAndExpense('expense');
                }
            },
            {
                route: '#/expense-update',
                title: 'Редактировать расходы',
                template: 'templates/expense-update.html',
                styles: "styles/category-create-change.css",
                load: () => {
                    new CategoryCreateUpdate('expense-update');
                }
            },
            {
                route: '#/expense-create',
                title: 'Создать категорию расхода',
                template: 'templates/expense-create.html',
                styles: "styles/category-create-change.css",
                load: () => {
                    new CategoryCreateUpdate('expense-create');
                }
            },
            {
                route: '#/operations',
                title: 'Операции',
                template: 'templates/operations.html',
                styles: "styles/operations.css",
                load: () => {
                    new Operations();
                }
            },
            {
                route: '#/operations-update',
                title: 'Редактировать операцию',
                template: 'templates/operations-update.html',
                styles: "styles/category-create-change.css",
                load: () => {
                    new OperationCreateUpdate('update-operation');
                }
            },
            {
                route: '#/operations-create',
                title: 'Создать операцию',
                template: 'templates/operations-create.html',
                styles: "styles/category-create-change.css",
                load: () => {
                    new OperationCreateUpdate('create-operation');
                }
            },
        ];
    };

    async openRoute() {
        const urlRoute = window.location.hash.split('?')[0];
        if (urlRoute === '#/logout') {
            await Auth.logout();
            window.location.href = '#/login';
            return false;
        }

        const newRoute = this.routes.find(item => {
            return item.route === urlRoute;
        });

        if (!newRoute) {
            window.location.href = '#/';
            return;
        }

        this.contentElement.innerHTML =
            await fetch(newRoute.template).then(response => response.text());
        this.stylesElement.setAttribute('href', newRoute.styles);
        this.titleElement.innerText = newRoute.title;

        const userInfo = Auth.getUserInfo();
        const accessToken = localStorage.getItem(Auth.accessTokensKey);
        if (userInfo && accessToken) {
            config.balance.innerText = await Balance.balanceInfo();
            this.profileFullName.innerText = userInfo.name + ' ' + userInfo.lastName;
        }

        newRoute.load();
    }
}
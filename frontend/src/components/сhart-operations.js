import Chart from 'chart.js/auto';
import {NavigationControl} from "../services/navigation-control.js";
import {OperationsFilter} from "../services/operations-filter";

export class ChartOperations {
    constructor() {
        NavigationControl.selectActiveNavigationItem(document.getElementById('nav-main'));
        this.chartIncome = null;
        this.canvasIncome = document.getElementById('graph-operation-income');
        this.chartExpense = null;
        this.canvasExpense = document.getElementById('graph-operation-expense');
        this.allOperations = [];
        this.activeItemFilter = 'today';

        const that = this;
        const filter = document.querySelector('.filter-menu');
        filter.addEventListener('click', function (e) {
            const filterItems = document.querySelectorAll('.filter-menu-btn');
            const target = e.target;

            Array.from(filterItems).forEach(filterItem => {
                filterItem.classList.remove('active');
            });

            target.classList.add('active');
            that.activeItemFilter = target.id;
            that.processFilterChart.call(that);
        });

        this.processFilterChart();
    }

    async processFilterChart() {
        this.allOperations = await OperationsFilter.filter(this.activeItemFilter);

        if (this.allOperations) {
            this.processCreateChart();
        }
    };

    processCreateChart() {
        let allIncome = [];
        let allExpense = [];

        this.allOperations.forEach(operation => {
            if (operation.type === 'income') {
                if (allIncome.every(item => item.category !== operation.category)) {
                    allIncome.push(operation);
                } else {
                    let element = allIncome.find(item => item.category === operation.category);
                    element.amount += operation.amount;
                }
            } else if (operation.type === 'expense') {
                if (allExpense.every(item => item.category !== operation.category)) {
                    allExpense.push(operation);
                } else {
                    let element = allExpense.find(item => item.category === operation.category);
                    element.amount += operation.amount;
                }
            }
        });

        const configIncome = {
            type: 'pie',
            data: {
                labels: allIncome.map(income => income.category),
                datasets: [{
                    data: allIncome.map(income => income.amount)
                }]
            }
        };

        const configExpense = {
            type: 'pie',
            data: {
                labels: allExpense.map(expense => expense.category),
                datasets: [{
                    data: allExpense.map(expense => expense.amount)
                }]
            }
        };

        if (this.chartIncome != null) {
            this.chartIncome.destroy();
        }
        this.chartIncome = new Chart(this.canvasIncome, configIncome);

        if (this.chartExpense != null) {
            this.chartExpense.destroy();
        }
        this.chartExpense = new Chart(this.canvasExpense, configExpense);
    };
}
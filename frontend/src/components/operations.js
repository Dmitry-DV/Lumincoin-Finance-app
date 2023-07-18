import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {NavigationControl} from "../services/navigation-control.js";
import {Balance} from "../services/balance.js";
import {OperationsFilter} from "../services/operations-filter.js";

export class Operations {
    constructor() {
        NavigationControl.selectActiveNavigationItem(document.getElementById('nav-operations'));
        this.tableBody = document.getElementById('table-body');
        this.dataTable = [];
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
            that.processFilterTable.call(that);
        });

        this.processFilterTable();
    };

    async processFilterTable() {
        this.dataTable = await OperationsFilter.filter(this.activeItemFilter);

        if (this.dataTable) {
            this.processCreateTable();
        }
    };

    processCreateTable() {
        const that = this;
        this.tableBody.innerHTML = '';

        this.dataTable.forEach(itemTable => {
            const tableTr = document.createElement('tr');
            tableTr.className = 'table-element';
            tableTr.setAttribute('data-id', itemTable.id);

            const tableId = document.createElement('td');
            tableId.innerText = itemTable.id;

            const tableType = document.createElement('td');
            if (itemTable.type === 'income') {
                tableType.innerText = 'Доход';
                tableType.className = 'table-income';
            } else if (itemTable.type === 'expense') {
                tableType.innerText = 'Расход';
                tableType.className = 'table-expense';
            }

            const tableCategory = document.createElement('td');
            tableCategory.innerText = itemTable.category;

            const tableAmount = document.createElement('td');
            tableAmount.innerText = itemTable.amount;

            const tableDate = document.createElement('td');
            tableDate.innerText = itemTable.date;

            const tableComment = document.createElement('td');
            tableComment.innerText = itemTable.comment;

            const tableIcon = document.createElement('td');
            tableIcon.className = 'table-icon';

            const tableIconDelete = document.createElement('button');
            tableIconDelete.className = 'btn';
            tableIconDelete.setAttribute('data-bs-target', '#exampleModal');
            tableIconDelete.setAttribute('data-bs-toggle', 'modal');
            const tableIconDeleteImg = document.createElement('img');
            tableIconDeleteImg.setAttribute('src', '/images/icon-delete.png');
            tableIconDeleteImg.setAttribute('alt', 'icon-delete');
            tableIconDelete.appendChild(tableIconDeleteImg);

            const tableIconUpdate = document.createElement('button');
            tableIconUpdate.className = 'btn';
            const tableIconUpdateImg = document.createElement('img');
            tableIconUpdateImg.setAttribute('src', '/images/icon-update.png');
            tableIconUpdateImg.setAttribute('alt', 'icon-update');
            tableIconUpdate.appendChild(tableIconUpdateImg);

            tableIcon.appendChild(tableIconDelete);
            tableIcon.appendChild(tableIconUpdate);

            tableTr.appendChild(tableId);
            tableTr.appendChild(tableType);
            tableTr.appendChild(tableCategory);
            tableTr.appendChild(tableAmount);
            tableTr.appendChild(tableDate);
            tableTr.appendChild(tableComment);
            tableTr.appendChild(tableIcon);

            that.tableBody.appendChild(tableTr);

            tableIconDelete.addEventListener('click', function () {
                that.processDeleteOperation.call(arguments, tableTr, that);
            });

            tableIconUpdate.addEventListener('click', function () {
                location.href = "#/operations-update?"
                    + "id=" + itemTable.id
                    + "&type=" + itemTable.type
                    + "&category=" + itemTable.category
                    + "&amount=" + itemTable.amount
                    + "&date=" + itemTable.date
                    + "&comment=" + itemTable.comment;
            });
        });
    };

    processDeleteOperation(tableElement, that) {
        const operationActiveElementId = tableElement.getAttribute('data-id');

        document.getElementById('delete-operation').onclick = async function () {
            try {
                const result = await CustomHttp.request(config.host + '/operations/' + operationActiveElementId, 'DELETE');
                if (result) {
                    if (result.error) {
                        throw new Error(result.message);
                    }
                    that.tableBody.innerHTML = '';
                    config.balance.innerText = await Balance.balanceUpdate();
                    that.processFilterTable();
                }
            } catch (error) {
                console.log(error);
            }
        };
    };
}
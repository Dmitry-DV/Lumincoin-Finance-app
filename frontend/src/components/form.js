import {CustomHttp} from "../services/custom-http.js";
import {Auth} from "../services/auth.js";
import config from "../../config/config.js";

export class Form {
    constructor(page) {
        this.sidebar = document.getElementById('sidebar');
        this.sidebar.style.display = "none";
        this.processElementButton = null;
        this.page = page;

        this.fields = [
            {
                name: "email",
                id: "email",
                element: null,
                regex: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                valid: false,
            },
            {
                name: "password",
                id: "password",
                element: null,
                regex: /((?=.*\d)(?=.*[A-Z]).{8,})/,
                valid: false,
            }
        ];

        if (this.page === 'signup') {
            this.fields.unshift({
                    name: "fullName",
                    id: "full-name",
                    element: null,
                    regex: /^[А-Я][а-я]+\s[А-Я][а-я]+\s[А-Я][а-я]+\s*$/,
                    valid: false,
                },
                {
                    name: "passwordRepeat",
                    id: "password-repeat",
                    element: null,
                    regex: /((?=.*\d)(?=.*[A-Z]).{8,})/,
                    valid: false,
                }
            );
        }

        const that = this;
        this.fields.forEach(field => {
            field.element = document.getElementById(field.id);
            field.element.onchange = function () {
                that.validateField.call(that, field, this);
            };
        });

        this.processElementButton = document.getElementById("process");
        this.processElementButton.onclick = function () {
            that.processForm();
        };
    };

    validateField(field, element) {
        if (!element.value || !element.value.match(field.regex)) {
            element.style.borderColor = "red";
            field.valid = false;
        } else {
            element.removeAttribute("style");
            field.valid = true;
        }
        this.validateForm();
    };

    validatePassword() {
        if (this.page === 'signup') {
            const password = this.fields.find(item => item.name === "password").element.value;
            const passwordRepeat = this.fields.find(item => item.name === "passwordRepeat").element.value;

            if (password !== passwordRepeat) {
                return false;
            }
        }
        return true;
    };

    validateForm() {
        const validForm = this.fields.every(item => item.valid);
        const isValid = validForm ? validForm : validForm;

        if (isValid && this.validatePassword()) {
            this.processElementButton.removeAttribute("disabled");
        } else {
            this.processElementButton.setAttribute("disabled", "disabled");
        }
        return isValid;
    };

    async processForm() {
        if (this.validateForm()) {
            const email = this.fields.find(item => item.name === 'email').element.value;
            const password = this.fields.find(item => item.name === 'password').element.value;

            if (this.page === 'signup') {
                try {
                    const result = await CustomHttp.request(config.host + '/signup', "POST", {
                        name: this.fields.find(item => item.name === 'fullName').element.value.split(' ')[1],
                        lastName: this.fields.find(item => item.name === 'fullName').element.value.split(' ')[0],
                        email: email,
                        password: password,
                        passwordRepeat: this.fields.find(item => item.name === 'passwordRepeat').element.value
                    })

                    if (result) {
                        if (result.error || !result.user) {
                            throw new Error(result.message);
                        }
                    }
                } catch (error) {
                    return console.log(error);
                }
            }
            try {
                const result = await CustomHttp.request(config.host + '/login', "POST", {
                    email: email,
                    password: password,
                })

                if (result) {
                    if (!result.tokens.accessToken || !result.tokens.refreshToken
                        || !result.user.id || !result.user.name || !result.user.lastName) {
                        throw new Error();
                    }
                    Auth.setTokens(result.tokens.accessToken, result.tokens.refreshToken);
                    Auth.setUserInfo({
                        name: result.user.name,
                        lastName: result.user.lastName,
                        userId: result.user.id
                    });
                    location.href = '/#';
                    this.sidebar.style.display = "flex";
                }

            } catch (error) {
                console.log(error);
            }
        }
    };
}
import config from "../../config/config.js";

export class Auth {
    static accessTokensKey = 'accessTokens';
    static refreshTokensKey = 'refreshTokens';
    static userInfoKey = 'userInfo';

    static async processUnauthorizedResponse() {
        const refreshToken = localStorage.getItem(this.refreshTokensKey);
        if (refreshToken) {
            const response = await fetch(config.host + '/refresh', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({refreshToken: refreshToken})
            })
            if (response && response.status === 200) {
                const result = await response.json();
                if (result && !result.error) {
                    this.setTokens(result.tokens.accessToken, result.tokens.refreshToken);
                    return true;
                }
            }
        }
        this.removeTokens();
        location.href = '#/login';
        return false;
    };

    static async logout() {
        const refreshToken = localStorage.getItem(this.refreshTokensKey);
        if (refreshToken) {
            const response = await fetch(config.host + '/logout', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({refreshToken: refreshToken})
            })
            if (response && response.status === 200) {
                const result = await response.json();
                if (result && !result.error) {
                    Auth.removeTokens();
                    localStorage.removeItem(Auth.userInfoKey);
                    return true;
                }
            }
        }
    };

    static setTokens(accessTokens, refreshTokens) {
        localStorage.setItem(this.accessTokensKey, accessTokens);
        localStorage.setItem(this.refreshTokensKey, refreshTokens);
    };

    static removeTokens() {
        localStorage.removeItem(this.accessTokensKey);
        localStorage.removeItem(this.refreshTokensKey);
    };

    static setUserInfo(info) {
        localStorage.setItem(this.userInfoKey, JSON.stringify(info));
    };

    static getUserInfo() {
      const userInfo = localStorage.getItem(this.userInfoKey);
      if (userInfo) {
          return JSON.parse(userInfo);
      }

      return null;
    };
}
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwitterGuestAuth = void 0;
const got_scraping_1 = require("got-scraping");
/**
 * A guest authentication token manager. Automatically handles token refreshes.
 */
class TwitterGuestAuth {
    constructor(bearerToken, cookie, xCsrfToken, proxyUrl) {
        this.bearerToken = bearerToken;
        this.cookie = cookie;
        this.xCsrfToken = xCsrfToken;
        this._proxyUrl = proxyUrl;
    }
    /**
     * Deletes the authentication token.
     */
    deleteToken() {
        delete this.guestToken;
        delete this.guestCreatedAt;
    }
    /**
     * Returns if the authentication state has a token.
     * @returns `true` if the authentication state has a token; `false` otherwise.
     */
    hasToken() {
        return this.guestToken != null;
    }
    /**
     * Returns the time that authentication was performed.
     * @returns The time at which the authentication token was created, or `null` if it hasn't been created yet.
     */
    authenticatedAt() {
        if (this.guestCreatedAt == null) {
            return null;
        }
        return new Date(this.guestCreatedAt);
    }
    /**
     * Sets a cookie string for use in requests.
     * @param value The new cookie to use in requests.
     */
    useCookie(value) {
        this.cookie = value;
    }
    /**
     * Sets a new CSRF token for use in requests.
     * @param value The new CSRF token to use in requests.
     */
    useCsrfToken(value) {
        this.xCsrfToken = value;
    }
    /**
     * Installs the authentication information into a headers-like object. If needed, the
     * authentication token will be updated from the API automatically.
     * @param headers A key-value object representing a request's headers.
     * @returns A builder that can be used to add or override other relevant data, or to
     * complete the task.
     */
    installTo(headers) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.shouldUpdate()) {
                yield this.updateToken();
            }
            const token = this.guestToken;
            if (token == null) {
                throw new Error('Authentication token is null or undefined.');
            }
            headers['Authorization'] = `Bearer ${this.bearerToken}`;
            headers['X-Guest-Token'] = token;
            if (this.cookie != null && this.xCsrfToken != null) {
                headers['Cookie'] = this.cookie;
                headers['x-csrf-token'] = this.xCsrfToken;
            }
        });
    }
    /**
     * Updates the authentication state with a new guest token from the Twitter API.
     */
    updateToken() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield got_scraping_1.gotScraping.post({
                url: 'https://api.twitter.com/1.1/guest/activate.json',
                headers: {
                    Authorization: `Bearer ${this.bearerToken}`,
                },
                proxyUrl: this._proxyUrl,
            });
            if (res.statusCode != 200) {
                throw new Error(res.body);
            }
            const o = JSON.parse(res.body);
            if (o == null || o['guest_token'] == null) {
                throw new Error('guest_token not found.');
            }
            const newGuestToken = o['guest_token'];
            if (typeof newGuestToken !== 'string') {
                throw new Error('guest_token was not a string.');
            }
            this.guestToken = newGuestToken;
            this.guestCreatedAt = new Date();
        });
    }
    /**
     * Returns if the authentication token needs to be updated or not.
     * @returns `true` if the token needs to be updated; `false` otherwise.
     */
    shouldUpdate() {
        return (!this.hasToken() ||
            (this.guestCreatedAt != null &&
                this.guestCreatedAt <
                    new Date(new Date().valueOf() - 3 * 60 * 60 * 1000)));
    }
    /**
     * Returns proxy url if exists
     */
    get proxyUrl() {
        return this._proxyUrl;
    }
}
exports.TwitterGuestAuth = TwitterGuestAuth;
//# sourceMappingURL=auth.js.map
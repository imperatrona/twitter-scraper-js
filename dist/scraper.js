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
exports.Scraper = void 0;
const api_1 = require("./api");
const auth_1 = require("./auth");
const profile_1 = require("./profile");
const search_1 = require("./search");
const trends_1 = require("./trends");
const tweets_1 = require("./tweets");
/**
 * An interface to Twitter's undocumented API.
 * Reusing Scraper objects is recommended to minimize the time spent authenticating unnecessarily.
 */
class Scraper {
    /**
     * Creates a new Scraper object. Scrapers maintain their own guest tokens for Twitter's internal API.
     * Reusing Scraper objects is recommended to minimize the time spent authenticating unnecessarily.
     */
    constructor(proxyUrl) {
        this.auth = new auth_1.TwitterGuestAuth(api_1.bearerToken, undefined, undefined, proxyUrl);
        this.authTrends = new auth_1.TwitterGuestAuth(api_1.bearerToken2, undefined, undefined, proxyUrl);
    }
    /**
     * Fetches a Twitter profile.
     * @param username The Twitter username of the profile to fetch, without an `@` at the beginning.
     * @returns The requested profile.
     */
    getProfile(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield (0, profile_1.getProfile)(username, this.auth);
            return this.handleResponse(res);
        });
    }
    /**
     * Fetches the user ID corresponding to the provided screen name.
     * @param screenName The Twitter screen name of the profile to fetch.
     * @returns The ID of the corresponding account.
     */
    getUserIdByScreenName(screenName) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield (0, profile_1.getUserIdByScreenName)(screenName, this.auth);
            return this.handleResponse(res);
        });
    }
    /**
     * Fetches tweets from Twitter.
     * @param query The search query. Any Twitter-compatible query format can be used.
     * @param maxTweets The maximum number of tweets to return.
     * @param includeReplies Whether or not replies should be included in the response.
     * @param searchMode The category filter to apply to the search. Defaults to `Top`.
     * @returns An async generator of tweets matching the provided filters.
     */
    searchTweets(query, maxTweets, includeReplies, searchMode = search_1.SearchMode.Top) {
        return (0, search_1.searchTweets)(query, maxTweets, includeReplies, searchMode, this.auth);
    }
    /**
     * Fetches profiles from Twitter.
     * @param query The search query. Any Twitter-compatible query format can be used.
     * @param maxProfiles The maximum number of profiles to return.
     * @returns An async generator of tweets matching the provided filters.
     */
    searchProfiles(query, maxProfiles) {
        return (0, search_1.searchProfiles)(query, maxProfiles, this.auth);
    }
    /**
     * Fetches tweets from Twitter.
     * @param query The search query. Any Twitter-compatible query format can be used.
     * @param maxTweets The maximum number of tweets to return.
     * @param includeReplies Whether or not replies should be included in the response.
     * @param searchMode The category filter to apply to the search. Defaults to `Top`.
     * @param cursor The search cursor, which can be passed into further requests for more results.
     * @returns A page of results, containing a cursor that can be used in further requests.
     */
    fetchSearchTweets(query, maxTweets, includeReplies, searchMode, cursor) {
        return (0, search_1.fetchSearchTweets)(query, maxTweets, includeReplies, searchMode, this.auth, cursor);
    }
    /**
     * Fetches profiles from Twitter.
     * @param query The search query. Any Twitter-compatible query format can be used.
     * @param maxProfiles The maximum number of profiles to return.
     * @param cursor The search cursor, which can be passed into further requests for more results.
     * @returns A page of results, containing a cursor that can be used in further requests.
     */
    fetchSearchProfiles(query, maxProfiles, cursor) {
        return (0, search_1.fetchSearchProfiles)(query, maxProfiles, this.auth, cursor);
    }
    /**
     * Fetches the current trends from Twitter.
     * @returns The current list of trends.
     */
    getTrends() {
        return (0, trends_1.getTrends)(this.authTrends);
    }
    /**
     * Fetches tweets from a Twitter user.
     * @param user The user whose tweets should be returned.
     * @param maxTweets The maximum number of tweets to return.
     * @param includeReplies Whether or not to include tweet replies.
     * @returns An async generator of tweets from the provided user.
     */
    getTweets(user, maxTweets, includeReplies) {
        return (0, tweets_1.getTweets)(user, maxTweets, includeReplies, this.auth);
    }
    /**
     * Fetches a single tweet.
     * @param id The ID of the tweet to fetch.
     * @param includeReplies Whether or not to include tweet replies.
     * @returns The request tweet, or `null` if it couldn't be fetched.
     */
    getTweet(id, includeReplies) {
        return (0, tweets_1.getTweet)(id, includeReplies, this.auth);
    }
    /**
     * Returns if the scraper has a guest token. The token may not be valid.
     * @returns `true` if the scraper has a guest token; otherwise `false`.
     */
    hasGuestToken() {
        return this.auth.hasToken() || this.authTrends.hasToken();
    }
    /**
     * Sets the optional cookie to be used in requests.
     * @param cookie The cookie to be used in requests.
     * @returns This scraper instance.
     */
    withCookie(cookie) {
        this.auth.useCookie(cookie);
        this.authTrends.useCookie(cookie);
        return this;
    }
    /**
     * Sets the optional CSRF token to be used in requests.
     * @param token The CSRF token to be used in requests.
     * @returns This scraper instance.
     */
    withXCsrfToken(token) {
        this.auth.useCsrfToken(token);
        this.authTrends.useCsrfToken(token);
        return this;
    }
    handleResponse(res) {
        if (!res.success) {
            throw res.err;
        }
        return res.value;
    }
}
exports.Scraper = Scraper;
//# sourceMappingURL=scraper.js.map
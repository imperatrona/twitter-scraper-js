import { Profile } from './profile';
import { SearchMode } from './search';
import { QueryProfilesResponse, QueryTweetsResponse } from './timeline';
import { Tweet } from './tweets';
/**
 * An interface to Twitter's undocumented API.
 * Reusing Scraper objects is recommended to minimize the time spent authenticating unnecessarily.
 */
export declare class Scraper {
    private auth;
    private authTrends;
    /**
     * Creates a new Scraper object. Scrapers maintain their own guest tokens for Twitter's internal API.
     * Reusing Scraper objects is recommended to minimize the time spent authenticating unnecessarily.
     */
    constructor(proxyUrl?: string);
    /**
     * Fetches a Twitter profile.
     * @param username The Twitter username of the profile to fetch, without an `@` at the beginning.
     * @returns The requested profile.
     */
    getProfile(username: string): Promise<Profile>;
    /**
     * Fetches the user ID corresponding to the provided screen name.
     * @param screenName The Twitter screen name of the profile to fetch.
     * @returns The ID of the corresponding account.
     */
    getUserIdByScreenName(screenName: string): Promise<string>;
    /**
     * Fetches tweets from Twitter.
     * @param query The search query. Any Twitter-compatible query format can be used.
     * @param maxTweets The maximum number of tweets to return.
     * @param includeReplies Whether or not replies should be included in the response.
     * @param searchMode The category filter to apply to the search. Defaults to `Top`.
     * @returns An async generator of tweets matching the provided filters.
     */
    searchTweets(query: string, maxTweets: number, includeReplies: boolean, searchMode?: SearchMode): AsyncGenerator<Tweet>;
    /**
     * Fetches profiles from Twitter.
     * @param query The search query. Any Twitter-compatible query format can be used.
     * @param maxProfiles The maximum number of profiles to return.
     * @returns An async generator of tweets matching the provided filters.
     */
    searchProfiles(query: string, maxProfiles: number): AsyncGenerator<Profile>;
    /**
     * Fetches tweets from Twitter.
     * @param query The search query. Any Twitter-compatible query format can be used.
     * @param maxTweets The maximum number of tweets to return.
     * @param includeReplies Whether or not replies should be included in the response.
     * @param searchMode The category filter to apply to the search. Defaults to `Top`.
     * @param cursor The search cursor, which can be passed into further requests for more results.
     * @returns A page of results, containing a cursor that can be used in further requests.
     */
    fetchSearchTweets(query: string, maxTweets: number, includeReplies: boolean, searchMode: SearchMode, cursor?: string): Promise<QueryTweetsResponse>;
    /**
     * Fetches profiles from Twitter.
     * @param query The search query. Any Twitter-compatible query format can be used.
     * @param maxProfiles The maximum number of profiles to return.
     * @param cursor The search cursor, which can be passed into further requests for more results.
     * @returns A page of results, containing a cursor that can be used in further requests.
     */
    fetchSearchProfiles(query: string, maxProfiles: number, cursor?: string): Promise<QueryProfilesResponse>;
    /**
     * Fetches the current trends from Twitter.
     * @returns The current list of trends.
     */
    getTrends(): Promise<string[]>;
    /**
     * Fetches tweets from a Twitter user.
     * @param user The user whose tweets should be returned.
     * @param maxTweets The maximum number of tweets to return.
     * @param includeReplies Whether or not to include tweet replies.
     * @returns An async generator of tweets from the provided user.
     */
    getTweets(user: string, maxTweets: number, includeReplies: boolean): AsyncGenerator<Tweet>;
    /**
     * Fetches a single tweet.
     * @param id The ID of the tweet to fetch.
     * @param includeReplies Whether or not to include tweet replies.
     * @returns The request tweet, or `null` if it couldn't be fetched.
     */
    getTweet(id: string, includeReplies: boolean): Promise<Tweet | null>;
    /**
     * Returns if the scraper has a guest token. The token may not be valid.
     * @returns `true` if the scraper has a guest token; otherwise `false`.
     */
    hasGuestToken(): boolean;
    /**
     * Sets the optional cookie to be used in requests.
     * @param cookie The cookie to be used in requests.
     * @returns This scraper instance.
     */
    withCookie(cookie: string): Scraper;
    /**
     * Sets the optional CSRF token to be used in requests.
     * @param token The CSRF token to be used in requests.
     * @returns This scraper instance.
     */
    withXCsrfToken(token: string): Scraper;
    private handleResponse;
}
//# sourceMappingURL=scraper.d.ts.map
/**
 * A guest authentication token manager. Automatically handles token refreshes.
 */
export declare class TwitterGuestAuth {
    private bearerToken;
    private cookie?;
    private guestToken?;
    private guestCreatedAt?;
    private xCsrfToken?;
    private _proxyUrl?;
    constructor(bearerToken: string, cookie?: string, xCsrfToken?: string, proxyUrl?: string);
    /**
     * Deletes the authentication token.
     */
    deleteToken(): void;
    /**
     * Returns if the authentication state has a token.
     * @returns `true` if the authentication state has a token; `false` otherwise.
     */
    hasToken(): boolean;
    /**
     * Returns the time that authentication was performed.
     * @returns The time at which the authentication token was created, or `null` if it hasn't been created yet.
     */
    authenticatedAt(): Date | null;
    /**
     * Sets a cookie string for use in requests.
     * @param value The new cookie to use in requests.
     */
    useCookie(value: string): void;
    /**
     * Sets a new CSRF token for use in requests.
     * @param value The new CSRF token to use in requests.
     */
    useCsrfToken(value: string): void;
    /**
     * Installs the authentication information into a headers-like object. If needed, the
     * authentication token will be updated from the API automatically.
     * @param headers A key-value object representing a request's headers.
     * @returns A builder that can be used to add or override other relevant data, or to
     * complete the task.
     */
    installTo(headers: {
        [key: string]: unknown;
    }): Promise<void>;
    /**
     * Updates the authentication state with a new guest token from the Twitter API.
     */
    updateToken(): Promise<void>;
    /**
     * Returns if the authentication token needs to be updated or not.
     * @returns `true` if the token needs to be updated; `false` otherwise.
     */
    private shouldUpdate;
    /**
     * Returns proxy url if exists
     */
    get proxyUrl(): string | undefined;
}
//# sourceMappingURL=auth.d.ts.map
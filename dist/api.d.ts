import { TwitterGuestAuth } from './auth';
export declare const bearerToken = "AAAAAAAAAAAAAAAAAAAAAPYXBAAAAAAACLXUNDekMxqa8h%2F40K4moUkGsoc%3DTYfbDKbT3jJPCEVnMYqilB28NHfOPqkca3qaAxGfsyKCs0wRbw";
export declare const bearerToken2 = "AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA";
/**
 * An API result container.
 */
export declare type RequestApiResult<T> = {
    success: true;
    value: T;
} | {
    success: false;
    err: Error;
};
export declare function requestApi<T>(url: string, auth: TwitterGuestAuth): Promise<RequestApiResult<T>>;
export declare function addApiParams(params: URLSearchParams, includeTweetReplies: boolean): URLSearchParams;
//# sourceMappingURL=api.d.ts.map
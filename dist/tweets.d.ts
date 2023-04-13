import { TwitterGuestAuth } from './auth';
import { QueryTweetsResponse } from './timeline';
export interface Video {
    id: string;
    preview: string;
    url?: string;
}
export interface PlaceRaw {
    id?: string;
    place_type?: string;
    name?: string;
    full_name?: string;
    country_code?: string;
    country?: string;
    bounding_box?: {
        type?: string;
        coordinates?: number[][][];
    };
}
/**
 * A parsed Tweet object.
 */
export interface Tweet {
    hashtags: string[];
    html?: string;
    id?: string;
    inReplyToStatus?: Tweet;
    isQuoted?: boolean;
    isPin?: boolean;
    isReply?: boolean;
    isRetweet?: boolean;
    likes?: number;
    permanentUrl?: string;
    photos: string[];
    place?: PlaceRaw;
    quotedStatus?: Tweet;
    replies?: number;
    retweets?: number;
    retweetedStatus?: Tweet;
    text?: string;
    timeParsed?: Date;
    timestamp?: number;
    urls: string[];
    userId?: string;
    username?: string;
    videos: Video[];
    sensitiveContent?: boolean;
}
export declare function fetchTweets(user: string, maxTweets: number, includeReplies: boolean, cursor: string | undefined, auth: TwitterGuestAuth): Promise<QueryTweetsResponse>;
export declare function getTweets(user: string, maxTweets: number, includeReplies: boolean, auth: TwitterGuestAuth): AsyncGenerator<Tweet>;
export declare function getTweet(id: string, includeReplies: boolean, auth: TwitterGuestAuth): Promise<Tweet | null>;
//# sourceMappingURL=tweets.d.ts.map
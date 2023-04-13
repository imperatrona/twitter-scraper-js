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
exports.getTweet = exports.getTweets = exports.fetchTweets = void 0;
const api_1 = require("./api");
const profile_1 = require("./profile");
const timeline_1 = require("./timeline");
const timeline_async_1 = require("./timeline-async");
function fetchTweets(user, maxTweets, includeReplies, cursor, auth) {
    return __awaiter(this, void 0, void 0, function* () {
        if (maxTweets > 200) {
            maxTweets = 200;
        }
        const userIdRes = yield (0, profile_1.getUserIdByScreenName)(user, auth);
        if (!userIdRes.success) {
            throw userIdRes.err;
        }
        const params = new URLSearchParams();
        (0, api_1.addApiParams)(params, includeReplies);
        params.set('count', `${maxTweets}`);
        params.set('userId', userIdRes.value);
        if (cursor != null && cursor != '') {
            params.set('cursor', cursor);
        }
        const res = yield (0, api_1.requestApi)(`https://api.twitter.com/2/timeline/profile/${userIdRes.value}.json?${params.toString()}`, auth);
        if (!res.success) {
            throw res.err;
        }
        return (0, timeline_1.parseTweets)(res.value);
    });
}
exports.fetchTweets = fetchTweets;
function getTweets(user, maxTweets, includeReplies, auth) {
    return (0, timeline_async_1.getTweetTimeline)(user, maxTweets, (q, mt, c) => {
        return fetchTweets(q, mt, includeReplies, c, auth);
    });
}
exports.getTweets = getTweets;
function getTweet(id, includeReplies, auth) {
    return __awaiter(this, void 0, void 0, function* () {
        const params = new URLSearchParams();
        (0, api_1.addApiParams)(params, includeReplies);
        const res = yield (0, api_1.requestApi)(`https://twitter.com/i/api/2/timeline/conversation/${id}.json?${params.toString()}`, auth);
        if (!res.success) {
            throw res.err;
        }
        const { tweets } = (0, timeline_1.parseTweets)(res.value);
        for (const tweet of tweets) {
            if (tweet.id === id) {
                return tweet;
            }
        }
        return null;
    });
}
exports.getTweet = getTweet;
//# sourceMappingURL=tweets.js.map
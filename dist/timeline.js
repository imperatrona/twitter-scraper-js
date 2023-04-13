"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseUsers = exports.parseTweets = exports.parseTweet = void 0;
const profile_1 = require("./profile");
const reHashtag = /\B(\#\S+\b)/g;
const reTwitterUrl = /https:(\/\/t\.co\/([A-Za-z0-9]|[A-Za-z]){10})/g;
const reUsername = /\B(\@\S{1,15}\b)/g;
function parseTweet(timeline, id) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    const tweets = (_b = (_a = timeline.globalObjects) === null || _a === void 0 ? void 0 : _a.tweets) !== null && _b !== void 0 ? _b : {};
    const tweet = tweets[id];
    if (tweet == null || tweet.user_id_str == null) {
        return null;
    }
    const users = (_d = (_c = timeline.globalObjects) === null || _c === void 0 ? void 0 : _c.users) !== null && _d !== void 0 ? _d : {};
    const user = users[tweet.user_id_str];
    const username = user === null || user === void 0 ? void 0 : user.screen_name;
    if (user == null || username == null) {
        // TODO: change the return type to a result, and return an error; this shouldn't happen, but we don't know what data we're dealing with.
        return null;
    }
    const tw = {
        id,
        hashtags: [],
        likes: tweet.favorite_count,
        permanentUrl: `https://twitter.com/${username}/status/${id}`,
        photos: [],
        replies: tweet.reply_count,
        retweets: tweet.retweet_count,
        text: tweet.full_text,
        urls: [],
        userId: tweet.user_id_str,
        username,
        videos: [],
    };
    if (tweet.created_at != null) {
        tw.timeParsed = new Date(Date.parse(tweet.created_at));
        tw.timestamp = Math.floor(tw.timeParsed.valueOf() / 1000);
    }
    if (((_e = tweet.place) === null || _e === void 0 ? void 0 : _e.id) != null) {
        tw.place = tweet.place;
    }
    if (tweet.quoted_status_id_str != null) {
        const quotedStatus = parseTweet(timeline, tweet.quoted_status_id_str);
        if (quotedStatus != null) {
            tw.isQuoted = true;
            tw.quotedStatus = quotedStatus;
        }
    }
    if (tweet.in_reply_to_status_id_str != null) {
        const replyStatus = parseTweet(timeline, tweet.in_reply_to_status_id_str);
        if (replyStatus != null) {
            tw.isReply = true;
            tw.inReplyToStatus = replyStatus;
        }
    }
    if (tweet.retweeted_status_id_str != null) {
        const retweetedStatus = parseTweet(timeline, tweet.retweeted_status_id_str);
        if (retweetedStatus != null) {
            tw.isRetweet = true;
            tw.retweetedStatus = retweetedStatus;
        }
    }
    const pinnedTweets = (_f = user.pinned_tweet_ids_str) !== null && _f !== void 0 ? _f : [];
    for (const pinned of pinnedTweets) {
        if (tweet.conversation_id_str == pinned) {
            tw.isPin = true;
            break;
        }
    }
    const hashtags = (_h = (_g = tweet.entities) === null || _g === void 0 ? void 0 : _g.hashtags) !== null && _h !== void 0 ? _h : [];
    for (const hashtag of hashtags) {
        if (hashtag.text != null) {
            tw.hashtags.push(hashtag.text);
        }
    }
    const media = (_k = (_j = tweet.extended_entities) === null || _j === void 0 ? void 0 : _j.media) !== null && _k !== void 0 ? _k : [];
    for (const m of media) {
        if (m.media_url_https == null) {
            continue;
        }
        if (m.type === 'photo') {
            tw.photos.push(m.media_url_https);
        }
        else if (m.type === 'video' && m.id_str != null) {
            const video = {
                id: m.id_str,
                preview: m.media_url_https,
            };
            let maxBitrate = 0;
            const variants = (_m = (_l = m.video_info) === null || _l === void 0 ? void 0 : _l.variants) !== null && _m !== void 0 ? _m : [];
            for (const variant of variants) {
                const bitrate = variant.bitrate;
                if (bitrate != null && bitrate > maxBitrate && variant.url != null) {
                    let variantUrl = variant.url;
                    const stringStart = 0;
                    const tagSuffixIdx = variantUrl.indexOf('?tag=10');
                    if (tagSuffixIdx !== -1) {
                        variantUrl = variantUrl.substring(stringStart, tagSuffixIdx + 1);
                    }
                    video.url = variantUrl;
                    maxBitrate = bitrate;
                }
            }
            tw.photos.push(video.preview);
            tw.videos.push(video);
        }
        const sensitive = m.ext_sensitive_media_warning;
        if (sensitive != null) {
            tw.sensitiveContent =
                sensitive.adult_content ||
                    sensitive.graphic_violence ||
                    sensitive.other;
        }
    }
    const urls = (_p = (_o = tweet.entities) === null || _o === void 0 ? void 0 : _o.urls) !== null && _p !== void 0 ? _p : [];
    for (const url of urls) {
        if ((url === null || url === void 0 ? void 0 : url.expanded_url) != null) {
            tw.urls.push(url.expanded_url);
        }
    }
    // HTML parsing with regex :)
    let html = (_q = tweet.full_text) !== null && _q !== void 0 ? _q : '';
    html = html.replace(reHashtag, (hashtag) => {
        return `<a href="https://twitter.com/hashtag/${hashtag.replace('#', '')}">${hashtag}</a>`;
    });
    html = html.replace(reUsername, (username) => {
        return `<a href="https://twitter.com/${username[0].replace('@', '')}">${username[0]}</a>`;
    });
    const foundedMedia = [];
    html = html.replace(reTwitterUrl, (tco) => {
        var _a, _b, _c, _d;
        for (const entity of (_b = (_a = tweet.entities) === null || _a === void 0 ? void 0 : _a.urls) !== null && _b !== void 0 ? _b : []) {
            if (tco === entity.url && entity.expanded_url != null) {
                return `<a href="${entity.expanded_url}">${tco}</a>`;
            }
        }
        for (const entity of (_d = (_c = tweet.extended_entities) === null || _c === void 0 ? void 0 : _c.media) !== null && _d !== void 0 ? _d : []) {
            if (tco === entity.url && entity.media_url_https != null) {
                foundedMedia.push(entity.media_url_https);
                return `<br><a href="${tco}"><img src="${entity.media_url_https}"/></a>`;
            }
        }
        return tco;
    });
    for (const url of tw.photos) {
        if (foundedMedia.indexOf(url) !== -1) {
            continue;
        }
        html += `<br><img src="${url}"/>`;
    }
    html = html.replace(/\n/g, '<br>');
    tw.html = html;
    return tw;
}
exports.parseTweet = parseTweet;
function parseTweets(timeline) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
    let cursor;
    let pinnedTweet;
    let orderedTweets = [];
    for (const instruction of (_b = (_a = timeline.timeline) === null || _a === void 0 ? void 0 : _a.instructions) !== null && _b !== void 0 ? _b : []) {
        const pinnedTweetId = (_h = (_g = (_f = (_e = (_d = (_c = instruction.pinEntry) === null || _c === void 0 ? void 0 : _c.entry) === null || _d === void 0 ? void 0 : _d.content) === null || _e === void 0 ? void 0 : _e.item) === null || _f === void 0 ? void 0 : _f.content) === null || _g === void 0 ? void 0 : _g.tweet) === null || _h === void 0 ? void 0 : _h.id;
        if (pinnedTweetId != null) {
            const tweet = parseTweet(timeline, pinnedTweetId);
            if (tweet != null) {
                pinnedTweet = tweet;
            }
        }
        for (const entry of (_k = (_j = instruction.addEntries) === null || _j === void 0 ? void 0 : _j.entries) !== null && _k !== void 0 ? _k : []) {
            const tweetId = (_p = (_o = (_m = (_l = entry.content) === null || _l === void 0 ? void 0 : _l.item) === null || _m === void 0 ? void 0 : _m.content) === null || _o === void 0 ? void 0 : _o.tweet) === null || _p === void 0 ? void 0 : _p.id;
            if (tweetId != null) {
                const tweet = parseTweet(timeline, tweetId);
                if (tweet != null) {
                    orderedTweets.push(tweet);
                }
            }
            const operation = (_q = entry.content) === null || _q === void 0 ? void 0 : _q.operation;
            if (((_r = operation === null || operation === void 0 ? void 0 : operation.cursor) === null || _r === void 0 ? void 0 : _r.cursorType) === 'Bottom') {
                cursor = (_s = operation === null || operation === void 0 ? void 0 : operation.cursor) === null || _s === void 0 ? void 0 : _s.value;
            }
        }
        const operation = (_v = (_u = (_t = instruction.replaceEntry) === null || _t === void 0 ? void 0 : _t.entry) === null || _u === void 0 ? void 0 : _u.content) === null || _v === void 0 ? void 0 : _v.operation;
        if (((_w = operation === null || operation === void 0 ? void 0 : operation.cursor) === null || _w === void 0 ? void 0 : _w.cursorType) === 'Bottom') {
            cursor = operation.cursor.value;
        }
    }
    if (pinnedTweet != null && orderedTweets.length > 0) {
        orderedTweets = [pinnedTweet, ...orderedTweets];
    }
    return {
        tweets: orderedTweets,
        next: cursor,
    };
}
exports.parseTweets = parseTweets;
function parseUsers(timeline) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
    const users = new Map();
    const userObjects = (_b = (_a = timeline.globalObjects) === null || _a === void 0 ? void 0 : _a.users) !== null && _b !== void 0 ? _b : {};
    for (const id in userObjects) {
        const legacy = userObjects[id];
        if (legacy == null) {
            continue;
        }
        const user = (0, profile_1.parseProfile)(legacy);
        users.set(id, user);
    }
    let cursor;
    const orderedProfiles = [];
    for (const instruction of (_d = (_c = timeline.timeline) === null || _c === void 0 ? void 0 : _c.instructions) !== null && _d !== void 0 ? _d : []) {
        for (const entry of (_f = (_e = instruction.addEntries) === null || _e === void 0 ? void 0 : _e.entries) !== null && _f !== void 0 ? _f : []) {
            const userId = (_k = (_j = (_h = (_g = entry.content) === null || _g === void 0 ? void 0 : _g.item) === null || _h === void 0 ? void 0 : _h.content) === null || _j === void 0 ? void 0 : _j.user) === null || _k === void 0 ? void 0 : _k.id;
            const profile = users.get(userId);
            if (profile != null) {
                orderedProfiles.push(profile);
            }
            const operation = (_l = entry.content) === null || _l === void 0 ? void 0 : _l.operation;
            if (((_m = operation === null || operation === void 0 ? void 0 : operation.cursor) === null || _m === void 0 ? void 0 : _m.cursorType) === 'Bottom') {
                cursor = (_o = operation === null || operation === void 0 ? void 0 : operation.cursor) === null || _o === void 0 ? void 0 : _o.value;
            }
        }
        const operation = (_r = (_q = (_p = instruction.replaceEntry) === null || _p === void 0 ? void 0 : _p.entry) === null || _q === void 0 ? void 0 : _q.content) === null || _r === void 0 ? void 0 : _r.operation;
        if (((_s = operation === null || operation === void 0 ? void 0 : operation.cursor) === null || _s === void 0 ? void 0 : _s.cursorType) === 'Bottom') {
            cursor = operation.cursor.value;
        }
    }
    return {
        profiles: orderedProfiles,
        next: cursor,
    };
}
exports.parseUsers = parseUsers;
//# sourceMappingURL=timeline.js.map
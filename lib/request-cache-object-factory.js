/*global require, module */

function createRequestCache(req, resp) {
    var request = {
        key: JSON.stringify({
            url: req.url,
            body: req.string,
            method: req.method
        }),
        timestamp: (new Date()).getTime()
    };
    if (resp) {
        request.res = {
            statusCode: resp.statusCode,
            data: resp.string
        };
        if (resp.cacheId) {
            request._id = resp.cacheId;
        }
    }

    return request;
}

module.exports = {
    createRequestCache: createRequestCache
};
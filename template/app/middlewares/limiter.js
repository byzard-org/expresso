const LangService = require("../services/lang");
const Utils = require("../utils");

// 100 requests per min
const DEFAULT_MAX_LIMIT = 100;
const DEFAULT_TIME_DELAY = Utils.toMs({ m: 1 })

const Limiter = ({ maxLimit, timeDelay } = {
    maxLimit: DEFAULT_MAX_LIMIT,
    timeDelay: DEFAULT_TIME_DELAY,
}) => {
    maxLimit = maxLimit ?? DEFAULT_MAX_LIMIT;
    timeDelay = timeDelay ?? DEFAULT_TIME_DELAY;

    const requests = {};

    return (req, res, next) => {
        try {
            const ip = req.ip;
            const now = Date.now();

            if (!requests[ip]) {
                requests[ip] = {
                    count: 0,
                    lastTime: now,
                };
                return next();
            }

            const delay = now - requests[ip].lastTime;
            if (delay < timeDelay) {
                requests[ip].count++;
            } else {
                requests[ip] = {
                    count: 0,
                    lastTime: now,
                };
            }

            if (requests[ip].count > maxLimit) {
                if (!res.locals.tr) {
                    LangService.tr(req, res, function () { });
                }
                LangService.setVars(res, {
                    time: Math.round((timeDelay - delay) / 1000),
                })
                return res.send(res.locals.tr.req_limit_reached);
            }

            return next();
        } catch (err) {
            return res.redirect("back");
        }
    }
};

module.exports = Limiter;

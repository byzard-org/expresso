const AppService = require("..");
const Errors = require("../../../config/errors");
const RoutesService = require("../routes");
const jwt = require("jsonwebtoken");
const express = require('express');
const ROUTES = require("../../routes/routes");

class GoogleAuthService {

    static #CLIENT_ID = AppService.config.googleAuthClientId;
    static #CLIENT_SECRET = AppService.config.googleAuthClientSecret;

    static #_route = ROUTES.GOOGLE_AUTH;
    static #_redirectTo = ROUTES.GOOGLE_AUTH_REDIRECT;
    static #_scope = "profile email";


    /**
     * 
     * @param {object} obj The oject to stringify 
     * @returns Object to URL query string
     */
    static querystring(obj) {
        return new URLSearchParams(obj).toString();
    }

    /**
     * Sets `req.google_user` as response on decoded google jwt and then calls `handler` or redirects to `/`
     * 
     * @param {function} handler Function to handle google auth callback (default redirects to `/`). If setted, it receives two parameters `req` and `res` which should be used like in a middleware handler. 
     * @param {object} [options] Options to configure the middleware
     * @param {string} [options.route] route to google auth consent
     * @param {string} [options.redirectTo] route to redirect to after consent
     * @param {string} [options.scope] OAuth2 scope
     * 
     */
    static middleware(handler, options = { route: this.#_route, redirectTo: this.#_redirectTo, scope: this.#_scope, }) {
        let { route, redirectTo, scope } = options;

        if (!route) route = this.#_route;
        if (!redirectTo) redirectTo = this.#_redirectTo;
        if (!scope) scope = this.#_scope;

        const router = express.Router();
        router.get(route, (req, res) => {
            const redirect_uri = RoutesService.getFullUrl(redirectTo);
            const authUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' + this.querystring({
                redirect_uri,
                scope,
                client_id: this.#CLIENT_ID,
                response_type: 'code',
                access_type: 'offline',
                prompt: 'consent'
            });
            res.redirect(authUrl);
        });

        router.get(redirectTo, async (req, res) => {
            if (req.query.error) {
                return res.redirect(ROUTES.BASE);
            }
            const code = req.query.code;
            const error = Errors.from(req, res);
            if (!code) {
                return error.json(error.code.USER_NOT_AUTHORIZED);
            }

            const redirect_uri = `${RoutesService.host}${redirectTo}`;
            try {
                const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: this.querystring({
                        code,
                        redirect_uri,
                        client_id: this.#CLIENT_ID,
                        client_secret: this.#CLIENT_SECRET,
                        grant_type: 'authorization_code'
                    })
                });

                const tokenData = await tokenResponse.json();
                if (tokenData.error) {
                    return res.json(tokenData.error);
                }

                const idToken = tokenData.id_token;
                const user = jwt.decode(idToken);

                req.google_user = user;
                if (handler) return handler(req, res);

                res.redirect(ROUTES.BASE);
            } catch (err) {
                console.error(err);
                return error.json(error.code.INVALID_REQUEST);
            }
        });

        return router;
    }

}

module.exports = GoogleAuthService;
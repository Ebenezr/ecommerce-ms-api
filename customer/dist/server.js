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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server.ts
const http_1 = __importDefault(require("http"));
const schema_1 = require("@graphql-tools/schema");
const koa_1 = __importDefault(require("koa"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const cors_1 = __importDefault(require("@koa/cors"));
const server_1 = require("@apollo/server");
const drainHttpServer_1 = require("@apollo/server/plugin/drainHttpServer");
const koa_2 = require("@as-integrations/koa");
const koa_session_1 = __importDefault(require("koa-session"));
const koa_helmet_1 = __importDefault(require("koa-helmet"));
const koa_logger_1 = __importDefault(require("koa-logger"));
const koa_useragent_1 = require("koa-useragent");
const request_ip_1 = __importDefault(require("request-ip"));
const dotenv_1 = __importDefault(require("dotenv"));
const koa_router_1 = __importDefault(require("koa-router"));
const logging_1 = require("./utils/logging");
const graphql_depth_limit_1 = __importDefault(require("graphql-depth-limit"));
const schema_2 = __importDefault(require("./schema"));
const resolvers_1 = __importDefault(require("./resolvers"));
const graphql_query_complexity_1 = require("graphql-query-complexity");
const utils_1 = require("./utils");
const schema = (0, schema_1.makeExecutableSchema)({ typeDefs: schema_2.default, resolvers: resolvers_1.default });
const ApolloServerPluginLandingPageDisabled = require('@apollo/server/plugin/disabled').ApolloServerPluginLandingPageDisabled;
dotenv_1.default.config();
const configValues = process.env;
const configurations = configValues.NODE_ENV === 'production'
    ? require('../configs/production.json')
    : require('../configs/development.json');
const { GRAPHQL_PATH } = process.env;
const depthLimitValue = 10;
const MAX_COMPLEXITY = 700;
function startApolloServer(typeDefsParam, resolversParam) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const router = new koa_router_1.default();
        const app = new koa_1.default();
        const httpServer = http_1.default.createServer(app.callback());
        const channel = yield (0, utils_1.CreateChannel)();
        app.channel = channel;
        const server = new server_1.ApolloServer({
            schema,
            formatError: (formattedError) => {
                // Strip any url that can be shown returned
                if (/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/.test(formattedError.message)) {
                    return Object.assign(Object.assign({}, formattedError), { message: 'Oops! An error occurred somewhere. Please try again later.', extensions: Object.assign(Object.assign({}, formattedError === null || formattedError === void 0 ? void 0 : formattedError.extensions), { code: 'Unknown' }) });
                }
                // Otherwise, return the original error. The error can also
                // be manipulated in other ways, as long as it's returned.
                return formattedError;
            },
            plugins: [
                (0, drainHttpServer_1.ApolloServerPluginDrainHttpServer)({ httpServer }),
                ApolloServerPluginLandingPageDisabled(),
                {
                    requestDidStart: () => __awaiter(this, void 0, void 0, function* () {
                        return ({
                            didResolveOperation({ request, document }) {
                                return __awaiter(this, void 0, void 0, function* () {
                                    /**
                                     * Provides GraphQL query analysis to be able to react on complex queries to the GraphQL server
                                     * It can be used to protect the GraphQL server against resource exhaustion and DoS attacks
                                     * More documentation can be found at https://github.com/ivome/graphql-query-complexity
                                     */
                                    const complexity = (0, graphql_query_complexity_1.getComplexity)({
                                        schema,
                                        operationName: request.operationName,
                                        // GraphQL query document
                                        query: document,
                                        variables: request.variables,
                                        estimators: [
                                            (0, graphql_query_complexity_1.fieldExtensionsEstimator)(),
                                            (0, graphql_query_complexity_1.simpleEstimator)({ defaultComplexity: 1 }),
                                        ],
                                    });
                                    if (complexity > MAX_COMPLEXITY) {
                                        logging_1.Logger.log('error', 'Error: ', {
                                            fullError: 'max complexity exceeded',
                                            customError: 'max complexity exceeded',
                                            systemError: 'max complexity exceeded',
                                            actualError: 'max complexity exceeded',
                                            customerMessage: `Sorry, too complicated query! ${complexity} exceeded the maximum allowed complexity of ${MAX_COMPLEXITY}`,
                                        });
                                        throw new Error(`Sorry, too complicated query! ${complexity} exceeded the maximum allowed complexity of ${MAX_COMPLEXITY}`);
                                    }
                                });
                            },
                        });
                    }),
                },
            ],
            introspection: false,
            validationRules: [(0, graphql_depth_limit_1.default)(depthLimitValue)],
        });
        yield server.start();
        if (configValues.NODE_ENV === 'dev') {
            app.proxy = true;
        }
        app.use((0, koa_logger_1.default)());
        app.use(koa_useragent_1.userAgent);
        app.use((0, koa_helmet_1.default)({
            contentSecurityPolicy: configValues.NODE_ENV === 'production' ? undefined : false,
        }));
        app.use((0, koa_session_1.default)(configurations.session.options, app));
        app.keys = configurations.session.keys;
        const whitelist = ((_a = configValues.ORIGIN) !== null && _a !== void 0 ? _a : '').split(',');
        const checkOriginAgainstWhitelist = (ctx) => {
            const requestOrigin = ctx.request.header.origin;
            if (!whitelist.includes(requestOrigin)) {
                return whitelist[0];
            }
            return requestOrigin;
        };
        app.use((ctx, next) => {
            try {
                // copy session to native Node's req object because GraphQL execution context doesn't have access to Koa's
                // context, see https://github.com/apollographql/apollo-server/issues/1551
                ctx.cookie = ctx.cookies;
                ctx.req.session = ctx.session;
                return next();
            }
            catch (err) {
                ctx.status = err.status || 500;
                ctx.body = err.message;
                ctx.app.emit('error', err, ctx);
                return null;
            }
        });
        app.on('error', (err, ctx) => {
            /* centralized error handling:
             *   console.log error
             *   write error to log file
             *   save error and request information to database if ctx.request match condition
             *   ...
             */
            logging_1.Logger.log('error', 'Error: ', {
                fullError: err,
                customError: err.message,
                systemError: '',
                actualError: err.message,
                customerMessage: 'Sorry we are experiencing a technical problem. Please try again later.',
            });
            ctx.status = err.status;
            ctx.body = err.message;
        });
        app.use((0, cors_1.default)({
            origin: checkOriginAgainstWhitelist,
            credentials: true,
        }));
        app.use((0, koa_bodyparser_1.default)());
        const koaMiddlewareFunc = (0, koa_2.koaMiddleware)(server, {
            context: ({ ctx }) => __awaiter(this, void 0, void 0, function* () {
                const { cache } = server;
                const clientIp = request_ip_1.default.getClientIp(ctx.req);
                // context is now passed to each of your datasource separately
                const context = {
                    session: ctx.req.session,
                    cookie: ctx.cookie,
                    userAgent: ctx.userAgent,
                    clientIp,
                };
                return Promise.resolve(context);
            }),
        });
        if (typeof GRAPHQL_PATH === 'string') {
            router.post(GRAPHQL_PATH, koaMiddlewareFunc);
        }
        else {
            throw new Error('GRAPHQL_PATH is not defined or is not a string');
        }
        app.use(router.routes());
        return { server, app, httpServer };
    });
}
module.exports = { startApolloServer };

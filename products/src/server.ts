// server.ts
import http from 'http';
import { makeExecutableSchema } from '@graphql-tools/schema';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { koaMiddleware } from '@as-integrations/koa';
import session from 'koa-session';
import helmet from 'koa-helmet';
import logger from 'koa-logger';
import { userAgent } from 'koa-useragent';
import requestIp from 'request-ip';
import config from 'dotenv';
import Router from 'koa-router';
import { Logger } from './utils/logging';
import depthLimit from 'graphql-depth-limit';
import typeDefs from './schema';
import resolvers from './resolvers';
import {
  fieldExtensionsEstimator,
  simpleEstimator,
  getComplexity,
} from 'graphql-query-complexity';
import { CreateChannel } from './utils';
import ProductAPI from './datasources/ProductAPI';

const schema = makeExecutableSchema({ typeDefs, resolvers });

const ApolloServerPluginLandingPageDisabled =
  require('@apollo/server/plugin/disabled').ApolloServerPluginLandingPageDisabled;

config.config();
const configValues = process.env;
const configurations =
  configValues.NODE_ENV === 'production'
    ? require('../configs/production.json')
    : require('../configs/development.json');

const { GRAPHQL_PATH } = process.env;
const depthLimitValue = 10;

const MAX_COMPLEXITY = 700;

async function startApolloServer(typeDefsParam: any, resolversParam: any) {
  const router = new Router();
  const app = new Koa();
  const httpServer = http.createServer(app.callback());
  const channel = await CreateChannel();
  (app as any).channel = channel;

  const server = new ApolloServer({
    schema,
    formatError: (formattedError) => {
      // Strip any url that can be shown returned
      if (
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/.test(
          formattedError.message
        )
      ) {
        return {
          ...formattedError,
          message: 'Oops! An error occurred somewhere. Please try again later.',
          extensions: { ...formattedError?.extensions, code: 'Unknown' },
        };
      }

      // Otherwise, return the original error. The error can also
      // be manipulated in other ways, as long as it's returned.
      return formattedError;
    },
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageDisabled(),
      {
        requestDidStart: async () => ({
          async didResolveOperation({ request, document }) {
            /**
             * Provides GraphQL query analysis to be able to react on complex queries to the GraphQL server
             * It can be used to protect the GraphQL server against resource exhaustion and DoS attacks
             * More documentation can be found at https://github.com/ivome/graphql-query-complexity
             */
            const complexity = getComplexity({
              schema,
              operationName: request.operationName,
              // GraphQL query document
              query: document,
              variables: request.variables,
              estimators: [
                fieldExtensionsEstimator(),
                simpleEstimator({ defaultComplexity: 1 }),
              ],
            });

            if (complexity > MAX_COMPLEXITY) {
              Logger.log('error', 'Error: ', {
                fullError: 'max complexity exceeded',
                customError: 'max complexity exceeded',
                systemError: 'max complexity exceeded',
                actualError: 'max complexity exceeded',
                customerMessage: `Sorry, too complicated query! ${complexity} exceeded the maximum allowed complexity of ${MAX_COMPLEXITY}`,
              });
              throw new Error(
                `Sorry, too complicated query! ${complexity} exceeded the maximum allowed complexity of ${MAX_COMPLEXITY}`
              );
            }
          },
        }),
      },
    ],
    introspection: false,

    validationRules: [depthLimit(depthLimitValue)],
  });

  await server.start();

  if (configValues.NODE_ENV === 'dev') {
    app.proxy = true;
  }

  app.use(logger());
  app.use(userAgent);
  app.use(
    helmet({
      contentSecurityPolicy:
        configValues.NODE_ENV === 'production' ? undefined : false,
    })
  );
  app.use(session(configurations.session.options, app));

  app.keys = configurations.session.keys;

  const whitelist = (configValues.ORIGIN ?? '').split(',');

  const checkOriginAgainstWhitelist = (ctx: any) => {
    const requestOrigin = ctx.request.header.origin;
    if (!whitelist.includes(requestOrigin)) {
      return whitelist[0];
    }
    return requestOrigin;
  };
  app.use((ctx: any, next: any) => {
    try {
      // copy session to native Node's req object because GraphQL execution context doesn't have access to Koa's
      // context, see https://github.com/apollographql/apollo-server/issues/1551
      ctx.cookie = ctx.cookies;
      ctx.req.session = ctx.session;
      return next();
    } catch (err: any) {
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
    Logger.log('error', 'Error: ', {
      fullError: err,
      customError: err.message,
      systemError: '',
      actualError: err.message,
      customerMessage:
        'Sorry we are experiencing a technical problem. Please try again later.',
    });
    ctx.status = err.status;
    ctx.body = err.message;
  });

  app.use(
    cors({
      origin: checkOriginAgainstWhitelist,
      credentials: true,
    })
  );

  app.use(bodyParser());

  const koaMiddlewareFunc = koaMiddleware(server, {
    context: async ({ ctx }: any) => {
      const { cache } = server;
      const clientIp = requestIp.getClientIp(ctx.req);
      // context is now passed to each of your datasource separately
      const context = {
        session: ctx.req.session,
        cookie: ctx.cookie,
        userAgent: ctx.userAgent,
        clientIp,
      };
      return {
        dataSources: {
          ProductAPI: new ProductAPI({ cache, context }),
        },
      };
    },
  });
  if (typeof GRAPHQL_PATH === 'string') {
    router.post(GRAPHQL_PATH, koaMiddlewareFunc);
  } else {
    throw new Error('GRAPHQL_PATH is not defined or is not a string');
  }

  app.use(router.routes());

  return { server, app, httpServer };
}

module.exports = { startApolloServer };

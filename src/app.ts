import express from 'express';
import {Request, Response, NextFunction} from 'express';
import path from 'path';
import logger from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import {createContainer, asClass, asValue, Lifetime} from 'awilix';
import { scopePerRequest } from 'awilix-express';

import indexRouter from './routes';
import config from './config';

const app = express();

/*************************
 * IoC container
 *************************/

const container = createContainer();

// Scoped lifetime = new instance per request
container.loadModules([
        'daos/**/*.js',
        'services/**/*.js',
        'models/**/*.js',
    ], {
        formatName: 'camelCase',
        resolverOptions: {
            lifetime: Lifetime.SCOPED,
            register: asClass,
        }
    }
);

// config
container.register({
    config: asValue(config),
});


// Add the middleware, passing it your Awilix container.
// This will attach a scoped container on the context.
app.use(scopePerRequest(container));

/*************************
 * Express
 *************************/
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

// Cross site
if(config.server.cors.enable) {
    const corsOptions = {
        origin: config.server.cors.origin,
        credentials: true,
        optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
    };
    app.options('*', cors(corsOptions));
    app.use(cors(corsOptions));
}

// router
app.use('/', indexRouter);

export default app;

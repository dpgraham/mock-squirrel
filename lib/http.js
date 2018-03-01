import express from 'express';
import winston from 'winston';
import _ from 'lodash';
import config from './config';
import { update } from './handlers';

const app = express();

function bindHandler (handler) {
  return async function (req, res) {
    try {
      winston.info(`Executing handler '${handler.name}'`);
      const result = await handler(req.params);
      winston.info(`Executed handler '${handler.name}'`);
      res.status(result.status);
      res.json(_.omit(result, 'status'));
    } catch (e) {
      winston.error(`An error occurred in handler '${handler.name}': ${e.message} ${e.stacktrace}`)
      res.status(500);
      res.send(e.message);
    }
  }
}

/** 
 * Programatically run mock squirrel server 
 */
export function startServer () {

  app.get('/', (req, res) => {
    res.send('Hello World!!');
  });

  app.get('/update/:platform/:version', bindHandler(update));
  app.get('/update/:platform', bindHandler(update));

  winston.info('Listening on port', config.PORT);
  return app.listen(config.PORT);
}
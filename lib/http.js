import express from 'express';
import _ from 'lodash';
import config from './config';
import { update } from './handlers';

const app = express();

function bindHandler (handler) {
  return async function (req, res) {
    try {
      const result = await handler(req.params);
      res.status(result.status);
      res.json(_.omit(result, 'status'));
    } catch (e) {
      res.status(500);
      res.send(e.message);
    }
  }
}

export function startServer () {

  app.get('/', (req, res) => {
    res.send('Hello World!!');
  });

  app.get('/update/:platform/:version', bindHandler(update));

  console.log('Listening on port', config.PORT);
  return app.listen(config.PORT);
}
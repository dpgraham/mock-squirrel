import request from 'request-promise';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { startServer } from '../../lib';

chai.should();
chai.use(chaiAsPromised);

describe('routes', function () {
  const baseUrl = `http://127.0.0.1:8080/`;
  before(function () {
    startServer();
  });
  describe('index route', function () {
    it('should return 200 no matter what', async function () {
      const res = await request.get(`${baseUrl}`);
      res.should.match(/Hello World!/);
    });
  });
  describe('/updates route', function () {
    it('should return 204 if no updates have been created', async function () {
      const res = await request.get(`${baseUrl}update/mac/1.00`, {resolveWithFullResponse: true});
      res.statusCode.should.equal(204);
    });
  });
});
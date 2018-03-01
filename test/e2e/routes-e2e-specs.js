import request from 'request-promise';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import path from 'path';
import { startServer, addElectronRelease, reset } from '../../lib';

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
    it('should return 204 if no updates have been created and alias platform used', async function () {
      const res = await request.get(`${baseUrl}update/DARWIN/1.00`, {resolveWithFullResponse: true});
      res.statusCode.should.equal(204);
    });
    it('should return 500 for invalid platform', async function () {
      await request.get(`${baseUrl}update/bogus/1.00`).should.eventually.be.rejectedWith(/500/);
    });

    describe('when adding a release', function () {
      const version = '1.1.0'
    
      beforeEach(async function () {
        await addElectronRelease(
          path.resolve(__dirname, '..', '..', 'test', 'assets', 'release'),
          version,
          'Some notes',
          12345,
        );
      });
      afterEach(function () {
        reset();
      });
      it('should return 204 if version number is the same', async function () {
        const res = await request.get(`${baseUrl}update/mac/1.1.0`, {resolveWithFullResponse: true});
        res.statusCode.should.equal(204);
      });
      it('should return 200 if version number is different for Mac', async function () {
        const res = await request.get(`${baseUrl}update/darwin/1.0.0`, {resolveWithFullResponse: true, json: true});
        res.statusCode.should.equal(200);
        const {name, notes, pub_date, url} = res.body;
        name.should.equal('1.1.0');
        notes.should.equal('Some notes');
        pub_date.should.equal(12345);
        url.should.equal('download/darwin/');
      });
      it('should return 200 if version number is different for Windows', async function () {
        const res = await request.get(`${baseUrl}update/Win32/1.0.0`, {resolveWithFullResponse: true, json: true});
        res.statusCode.should.equal(200);
        const {name, notes, pub_date, url} = res.body;
        url.should.equal('download/win32/');
      });
      it('should return 200 if version changes again', async function () {
        // Check that no updates for same version
        let res = await request.get(`${baseUrl}update/Win32/1.1.0`, {resolveWithFullResponse: true, json: true});
        res.statusCode.should.equal(204);

        // Add new releases
        await addElectronRelease(
          path.resolve(__dirname, '..', '..', 'test', 'assets', 'release'),
          '1.2.0',
          'Some new notes',
          54321,
        );

        // Now check again
        res = await request.get(`${baseUrl}update/darwin/1.0.0`, {resolveWithFullResponse: true, json: true});
        res.statusCode.should.equal(200);
        const {name, notes, pub_date, url} = res.body;
        name.should.equal('1.2.0');
        notes.should.equal('Some new notes');
        pub_date.should.equal(54321);
        url.should.equal('download/darwin/');

      });
    });
  });
});
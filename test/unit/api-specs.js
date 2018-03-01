import { addElectronRelease, addEntry, latest } from '../../lib/api';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { fs } from 'appium-support';
import sinon from 'sinon';

chai.should();
chai.use(chaiAsPromised);

describe('api.js', function () {
  describe('.addEntry', function () {

    it('should reject entries to non-existent platforms', async function () {
      (() => addEntry('fakePlatform')).should.throw(/no such platform/);
    });

    it('should add entries by platform', async function () {
      addEntry('darwin', 'v1.1.0', '/fake/path');
      latest.platforms.darwin.should.eql({
        version: 'v1.1.0',
        path: '/fake/path',
      });
      addEntry('darwin', 'v1.2.0', '/a/new/path');
      latest.platforms.darwin.should.eql({
        version: 'v1.2.0',
        path: '/a/new/path',
      });
    });
  });
});
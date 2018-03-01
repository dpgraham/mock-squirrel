import { update } from '../../lib/handlers';
import { reset, addEntry, PLATFORMS } from '../../lib/api';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.should();
chai.use(chaiAsPromised);

describe('handlers.js', function () {
  beforeEach(function () {
    reset();
  });
  describe('update()', function () {
    it('should reject invalid platform name with 500 status', async function () {
      await update({platform: 'bogus'}).should.eventually.eql({status: 500, message: 'Invalid platform'});
    });
    it('should find nothing if nothing was created', async function () {
      await update({platform: 'darwin', version: 'v0.0.1'}).should.eventually.eql({status: 204});
    });
    for (let platform of ['mac', 'MAC', 'MacOS', 'Win', 'windows', 'AppImage', 'appImage']) {
      it(`should find nothing if nothing was created and alias ${platform} was used`, async function () {
        await update({platform, version: 'v0.0.1'}).should.eventually.eql({status: 204});
      });
    }
    it('should do 204 if latest is same version', async function () {
      addEntry(PLATFORMS.MAC, '1.1.0', '/fake/path', 1);
      await update({platform: PLATFORMS.MAC, version: '1.1.0'}).should.eventually.eql({status: 204});
    });
    it('should do 204 if latest is same version and should respect SEMVER', async function () {
      addEntry(PLATFORMS.MAC, '1.1.0', '/fake/path', 1);
      await update({platform: PLATFORMS.MAC, version: 'v1.1.0'}).should.eventually.eql({status: 204});
    });
    it('should do 200 if latest is different from passed-in version', async function () {
      addEntry(PLATFORMS.MAC, '1.1.0', '/fake/path', 'notes', 1);
      await update({platform: PLATFORMS.MAC, version: '1.2.0'}).should.eventually.eql({
        status: 200,
        name: '1.1.0',
        pub_date: 1,
        notes: 'notes',
        // url: `` // TODO: Add URL with BaseURL from a config
      });
    });
    it('should do 200 if latest is different from passed-in version and should respect SEMVER', async function () {
      addEntry(PLATFORMS.MAC, '1.1.0', '/fake/path', 'notes', 1);
      await update({platform: PLATFORMS.MAC, version: 'v1.2.0'}).should.eventually.eql({
        status: 200,
        name: '1.1.0',
        pub_date: 1,
        notes: 'notes',
        // url: `` // TODO: Add URL with BaseURL from a config
      });
    });

  });

});
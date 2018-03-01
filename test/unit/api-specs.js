import { addElectronRelease, addEntry, latest, PLATFORMS } from '../../lib/api';
import chai from 'chai';
import path from 'path';
import chaiAsPromised from 'chai-as-promised';
import { fs } from 'appium-support';
import sinon from 'sinon';

chai.should();
chai.use(chaiAsPromised);

describe('api.js', function () {
  describe('.addEntry', function () {
    it('should reject entries to non-existent platforms', function () {
      (() => addEntry('fakePlatform')).should.throw(/no such platform/);
    });
    it('should add entries by platform', function () {
      addEntry('darwin', 'v1.1.0', '/fake/path');
      latest.platforms[PLATFORMS.MAC].should.eql({
        version: 'v1.1.0',
        path: '/fake/path',
      });
      addEntry('darwin', 'v1.2.0', '/a/new/path');
      latest.platforms[PLATFORMS.MAC].should.eql({
        version: 'v1.2.0',
        path: '/a/new/path',
      });
    });
  });

  describe('.addElectronRelease', function () {
    const release = path.resolve(__dirname, '..', '..', 'test', 'assets', 'release');

    it.only('should save platforms to their respective folders', async function () {
      await addElectronRelease(release, 'v1.4.0');
      latest.platforms.darwin.should.eql({
        version: 'v1.4.0',
        path: path.resolve(release, 'Appium-1.4.0.dmg'),
      });
      latest.platforms.win32.should.eql({
        version: 'v1.4.0',
        path: path.resolve(release, 'appium-desktop-setup-1.4.0.exe'),
      });
      latest.platforms.linux.should.eql({
        version: 'v1.4.0',
        path: path.resolve(release, 'appium-desktop-1.4.0-x86_64.AppImage'),
      });
    });
  });
});
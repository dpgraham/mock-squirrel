import { addElectronRelease, addEntry, latest, PLATFORMS, reset } from '../../lib/api';
import chai from 'chai';
import path from 'path';
import chaiAsPromised from 'chai-as-promised';
import { fs } from 'appium-support';
import sinon from 'sinon';

chai.should();
chai.use(chaiAsPromised);

describe('api.js', function () {
  beforeEach(function () {
    reset();
  });
  describe('.addEntry', function () {
    it('should reject entries to non-existent platforms', function () {
      (() => addEntry('fakePlatform')).should.throw(/no such platform/);
    });
    it('should add entries by platform', function () {
      addEntry('darwin', 'v1.1.0', '/fake/path', 1);
      latest.platforms[PLATFORMS.MAC].should.eql({
        version: 'v1.1.0',
        path: '/fake/path',
        pubDate: 1,
      });
      addEntry('darwin', 'v1.2.0', '/a/new/path', 1);
      latest.platforms[PLATFORMS.MAC].should.eql({
        version: 'v1.2.0',
        path: '/a/new/path',
        pubDate: 1,
      });
    });
  });

  describe('.addElectronRelease', function () {
    const release = path.resolve(__dirname, '..', '..', 'test', 'assets', 'release');

    it('should save platforms to their respective folders', async function () {
      await addElectronRelease(release, 'v1.4.0', 1);
      latest.platforms[PLATFORMS.MAC].should.eql({
        version: 'v1.4.0',
        path: path.resolve(release, 'Appium-1.4.0.dmg'),
        pubDate: 1,
      });
      latest.platforms[PLATFORMS.WIN].should.eql({
        version: 'v1.4.0',
        path: path.resolve(release, 'appium-desktop-setup-1.4.0.exe'),
        pubDate: 1,
      });
      latest.platforms[PLATFORMS.APPIMAGE].should.eql({
        version: 'v1.4.0',
        path: path.resolve(release, 'appium-desktop-1.4.0-x86_64.AppImage'),
        pubDate: 1,
      });
    });
  });
});
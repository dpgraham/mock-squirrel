import path from 'path';
import { fs } from 'appium-support';

export const latest = {
  platforms: {
    darwin: {},
    win32: {},
    linux: {},
  }
};

const releasesPath = path.resolve(__dirname, 'releases');
const macPath = path.resolve(releasesPath, 'darwin');
const winPath = path.resolve(releasesPath, 'win32');
const linuxPath = path.resolve(releasesPath, 'darwin');

export function addEntry (platform, version, pathToBinary) {
  if (!latest.platforms[platform]) {
    throw new Error(`no such platform: ${platform}`);
  }
  latest.platforms[platform] = {version, path:pathToBinary};
}

export async function addElectronRelease (releaseDir, version, date=+new Date()) {
  /*if (!await fs.exists(releasesPath)) {
    await fs.mkdir(releasesPath);
    await fs.mkdir(macPath);
    await fs.mkdir(winPath);
    await fs.mkdir(linuxPath);
  }*/

  // Copy release dir to a 'releases' dir

  // Update JS specifying which one is the 'latest'
}
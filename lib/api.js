import path from 'path';
import _ from 'lodash';
import { fs } from 'appium-support';


export const PLATFORMS = {
  WIN: 'win32',
  MAC: 'darwin',
  APPIMAGE: 'appimage',
};

export const latest = {
  platforms: {
  }
};

export function reset () {
  _.values(PLATFORMS).forEach((platform) => latest.platforms[platform] = {});
}

reset();

// TODO: Add a '.clean' method

/**
 * Add entry to 'latest'
 * @param {string} platform 
 * @param {string} version 
 * @param {string} pathToBinary 
 */
export function addEntry (platform, version, pathToBinary, pubDate) {
  pubDate = pubDate || (+new Date());
  if (!latest.platforms[platform]) {
    throw new Error(`no such platform: ${platform}`);
  }
  latest.platforms[platform] = {version, path:pathToBinary, pubDate};
}

/**
 * 
 * @param {string} releaseDir 
 * @param {string} version 
 * @param {} date 
 */
export async function addElectronRelease (releaseDir, version, pubDate) {
  for (let release of await fs.readdir(releaseDir)) {
    const pathName = path.extname(release);
    let platform;
    if (pathName === '.dmg') {
      platform = PLATFORMS.MAC;
    } else if (pathName === '.exe') {
      platform = PLATFORMS.WIN;
    } else if (pathName === '.AppImage') {
      platform = PLATFORMS.APPIMAGE;
    }

    if (platform) {
      addEntry(platform, version, path.resolve(releaseDir, release), pubDate);
    }
  }
}
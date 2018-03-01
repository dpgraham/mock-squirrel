import path from 'path';
import winston from 'winston';
import _ from 'lodash';
import { fs } from 'appium-support';


export const PLATFORMS = {
  WIN: 'win32',
  MAC: 'darwin',
  APPIMAGE: 'appimage',
};

/** 
 * Keep latest updates in memory (don't need to persist, only for testing)
 */
export const latest = {
  platforms: {
  }
};

/**
 * Remove all latest platforms
 */
export function reset () {
  _.values(PLATFORMS).forEach((platform) => latest.platforms[platform] = {});
}

reset();

/**
 * Add entry to 'latest'
 * @param {string} platform 
 * @param {string} version 
 * @param {string} pathToBinary 
 */
export function addEntry (platform, version, pathToBinary, notes, pubDate) {
  pubDate = pubDate || (+new Date());
  if (!latest.platforms[platform]) {
    throw new Error(`no such platform: ${platform}`);
  }
  latest.platforms[platform] = {version, path:pathToBinary, notes, pubDate};
}

/**
 * Add an electron release folder to latest
 * @param {string} releaseDir 
 * @param {string} version 
 * @param {number} date 
 */
export async function addElectronRelease (releaseDir, version, notes, pubDate) {
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
      winston.info(`Adding ${version} as latest '${platform}'`);
      addEntry(platform, version, path.resolve(releaseDir, release), notes, pubDate);
    }
  }
}
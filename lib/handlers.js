import { compare } from 'semver';
import winston from 'winston';
import { latest } from './api';
import { HOST, PORT } from './config';
import _ from 'lodash';

function dealias (platformName) {
  platformName = platformName.toLowerCase();
  const aliases = {
    darwin: ['mac', 'macos', 'osx'],
    win32: ['exe', 'windows', 'win'],
    appimage: []
  };

  if (aliases[platformName]) {
    return platformName;
  }

  for (let [platform, platformAliases] of _.toPairs(aliases)) {
    if (_.includes(platformAliases, platformName)) {
      return platform.toLowerCase();
    }
  }

  return platformName;
}

/**
 * Check if platform has an update ready
 * @param {*} params 
 */
export async function update (params) {
  let {platform, version} = params;

  if (!platform) {
    platform = process.platform;
  }

  platform = dealias(platform);

  const info = latest.platforms[platform];

  if (!info) {
    winston.info(`Not a valid platform '${platform}'`)
    return {
      status: 500,
      message: 'Invalid platform',
    };
  }

  if (_.isEmpty(info)) {
    winston.info(`No updates available for '${platform}'`);
    return {
      status: 204,
    }
  }

  const {version: latestVersion, notes, pubDate} = info;
  if (!version || compare(latestVersion, version) !== 0) {
    winston.info(`Found update for '${platform}' at version: ${latestVersion}`);
    return {
      status: 200,
      name: latestVersion,
      notes,
      pub_date: pubDate,
      url: `download/${platform}/`
    };
  }

  winston.info(`Already up to latest for ${platform}`);
  return {
    status: 204,
  };
}
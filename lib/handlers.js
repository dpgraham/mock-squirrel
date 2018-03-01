import { compare } from 'semver';
import { latest } from './api';
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
}

export async function update (params) {
  let {platform, version} = params;

  platform = dealias(platform);

  const info = latest.platforms[platform];

  if (!info) {
    return {
      status: 500,
      message: 'Invalid platform',
    };
  }

  if (_.isEmpty(info)) {
    return {
      status: 204,
    }
  }

  const {version: latestVersion, notes, pubDate} = info;
  if (compare(latestVersion, version) !== 0) {
    return {
      status: 200,
      name: latestVersion,
      notes,
      pub_date: pubDate,
      //url: `url goes here`
    };
  }

  return {
    status: 204,
  };
}
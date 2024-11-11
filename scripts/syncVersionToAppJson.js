const fs = require('fs');
const appJson = require('../app.json');
const version = require('../package.json').version;

const fillWithZeros = (version) =>
  version < 10 ? `0${version}` : `${version}`;
const getAndroidVersionCode = (version) => {
  const [major, minor, patch] = version.split('.');
  return parseInt(`${major}${fillWithZeros(minor)}${fillWithZeros(patch)}`);
};

appJson.expo.version = version;
appJson.expo.ios.buildNumber = version;
appJson.expo.android.versionCode = getAndroidVersionCode(version);

const fileContent = JSON.stringify(appJson, null, 2);
fs.writeFileSync(__dirname + '/../app.json', fileContent);

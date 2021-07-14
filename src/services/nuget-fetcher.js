const compareVersions = require('compare-versions');
const fetch = require('node-fetch');

const BASE_URL = 'https://api.nuget.org/v3/registration5-gz-semver2/';

const getLatestVersion = async (packageName) => {
    const url = BASE_URL + packageName.toLowerCase() + '/index.json';
    console.log(url);

    const data = await fetch(url).then(res => res.json());

    const items = data.items;
    var highestVersion = '0.0.0';

    items.forEach(item => {
        var maxVersion = item.upper;
        if(compareVersions(maxVersion, highestVersion) === 1){
            highestVersion = maxVersion;
        }
    });

    return highestVersion;

};

exports.isUpToDate = async (packageName, version) => {
    return await getLatestVersion(packageName);

};
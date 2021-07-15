const compareVersions = require('compare-versions');
const fetch = require('node-fetch');

const BASE_URL = 'https://api.nuget.org/v3/registration5-gz-semver2/';

const getLatestVersion = async (packageName) => {
    const url = BASE_URL + packageName.toLowerCase() + '/index.json';

    try{
        const data = await fetch(url).then(res => res.json());

        const items = data.items;
        var highestVersion = '0.0.0';

        items.forEach(item => {
            var maxVersion = item.upper;
            if(compareVersions(maxVersion, highestVersion) === 1){
                highestVersion = maxVersion;
            }
        });

        return{
            status: 200,
            version: highestVersion
        }
    }catch(err){
        return {
            status: 500,
            message: err
        }
    }
};

exports.isUpToDate = async (packageName, version) => {
    var latest = await getLatestVersion(packageName);

    if(latest.status !== 200){
        return{
            status: latest.status,
            message: latest.message
        }
    }

    if(compareVersions(latest.version, version) === 1){
        return {
            status: 200,
            upToDate: false,
            latestVersion: latest.version,
            installed: version
        }
    }

    return {
        status: 200,
        upToDate: true,
    };
};
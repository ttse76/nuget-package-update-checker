const compareVersions = require('compare-versions');
const fetch = require('node-fetch');

const BASE_URL = 'https://api.nuget.org/v3/registration5-gz-semver2/';

/**
 * Retreives latest version of the package from the NuGet API
 * 
 * @param {*} packageName - Name of package being searched
 * @returns - latest version or message if error
 */
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

/**
 * Checkes if specified version is the latest version of the specified package
 * 
 * @param {*} packageName - Name of package that is being evaluated
 * @param {*} version - Current installed version
 * @returns package evaluation or message if error
 */
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
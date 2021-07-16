const fs = require('fs');
const xml2js = require('xml2js');

const xmlParser = async (path) => {
    try{
        const f = fs.readFileSync(path);
        const data = await xml2js.parseStringPromise(f.toString());
        return { status: 200, data: data};
    }catch(err)
    {
        return { status:500, message: 'Error parsing xml for path ' + path};
    }
};

/**
 * Scans .csproj file for package references installed version number
 * 
 * @param {*} path - Path to .csproj file
 * @returns packages with their installed versions or message if error
 */
exports.getInstalledVersions = async (path) => {
    const data = await xmlParser(path);

    if(data.status !== 200){
        return data;
    }

    var versions = {};

    const packageList = data.data["Project"]["ItemGroup"][1]["PackageReference"];
    if(packageList === undefined){
        return { status: 500, message: "PackageReferecnce not found" };
    }

    packageList.forEach(package => {
        versions[String(package['$']['Include'])] = package['$']['Version'];
    });

    return {
        status: 200,
        packages: versions
    }

};

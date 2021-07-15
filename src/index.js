const fs = require('fs');
const xml2js = require('xml2js');
const parser = xml2js.Parser({attrkey: "ATTR"});
const nuget = require('./services/nuget-fetcher');

const fileloc = require('../config/fileloc.json');
const fileLocLabels = Object.keys(fileloc);

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

const getInstalledVersions = async (path) => {
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

const main = async () => {
    const numFile = process.argv[2];

    if(fileLocLabels.length <= numFile){
        console.error('Number of files less than ' + numFile);
        return;
    }
    const label = fileLocLabels[numFile];
    
    console.log('Evaluating packages for ' + label + '...');
    const path = fileloc[label];
    const data = await getInstalledVersions(path);
    if(data.status !== 200){
        console.error('Error for project ' + label + ': '  + data.message);
        return;
    }

    const packages = data.packages;
    const packageNames = Object.keys(packages);

    packageNames.forEach(async package => {
        const version = packages[package];
        const res = await nuget.isUpToDate(package, version);
        if(res.status !== 200){
            console.error('Error on version check for ' + package + ': ' + res.message);
            console.log('\n');
            return;
        }
        if(res.isUpToDate){
            console.log(package + ' is up to date.\n' + version);
        }else{
            console.log(package + ' is not up to date\n' + res.installed + ' => ' + res.latestVersion);
        }
        console.log('\n');
    });
    return;
}

main();

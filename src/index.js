const fs = require('fs');
const parser = require('./services/parser');
const nuget = require('./services/nuget-fetcher');

const fileloc = require('../config/fileloc.json');
const fileLocLabels = Object.keys(fileloc);

const main = async () => {
    const numFile = process.argv[2];

    if(fileLocLabels.length <= numFile){
        console.error('Number of files less than ' + numFile);
        return;
    }
    const label = fileLocLabels[numFile];
    
    console.log('Evaluating packages for ' + label + '...');
    const path = fileloc[label];
    const data = await parser.getInstalledVersions(path);
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
            console.log('Error in version check for ' + package + ': ' + res.message);
            var errStr = package + ',,,' + res.message;
            fs.appendFile(label + '.packages.txt', errStr, err => {});
            return;
        }
        var outStr = package + ',' + res.installed + ',' + res.latestVersion + ',\n';
        fs.appendFile(label + '.packages.txt', outStr, err => {});
    });
    return;
}

main();

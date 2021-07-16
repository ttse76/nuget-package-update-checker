const fs = require('fs');
const parser = require('./services/parser');
const nuget = require('./services/nuget-fetcher');

const main = async () => {
    var fileloc = {};
    var fileLocLabels = [];

    try{
        fileloc = require('../config/fileloc.json');
        fileLocLabels = Object.keys(fileloc);
    }catch(err){
        console.error('Error: No fileloc.json file found');
        return;
    }

    fileLocLabels.forEach(async label => {
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
                return;
            }

            var outStr = package + ',' + res.installed + ',' + res.latestVersion + '\n';
            fs.appendFile(label + '.packages.csv', outStr, err => {});
        });
    });
    return;
}

main();

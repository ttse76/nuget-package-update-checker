# NuGet Update Checker

Node program to check installed nuget packages and see if it is the latest version

## Setup
1. Clone repo and run `npm i` to install required dependencies
2. Following `fileloc.template.json`, add a file called `fileloc.json` to the `config` folder pointing to the `.csproj` files you want analyzed
3. Run `npm start` to run application. Results will be printed to `.csv` files.

## fileloc.json
The `.csproj` are stored in a file called `fileloc.json`. `fileloc.template.json` provides an example of how it should be organized but in general it should look like:
```javascript
{
  "MyProject": "C:\\src\\MyProject.csproj"
}
```

There can be multiple projects. The resulting `.csv` file will be named something like `MyProject.packages.csv`

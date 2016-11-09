+[![build-status](https://pipelines-badges-service.useast.staging.atlassian.io/badge/atlassian/confluence-web-components.svg)](https://bitbucket.org/atlassian/replaceit/addon/pipelines/home)

## Info
Goes through files and replaces determined text, currently does not support symbolic links however.

## How To

Install with npm
```
npm i replaceit
```

Run unit tests with `npm test' make sure you either do an npm i inside pathit or install mocha and chai before hand since the tests require these modules.

To use Replaceify simply require it and use it as a function

```js
const replaceify = require('replaceify');
replaceify({
    path: 'Path/To/Your/File',
    regex: 'Regex String',
    replacement: 'Replace string or Object',
    async: true, //defaults to true
    loop: false //defaults to false, if true replaceify will loop directories if the path given is a directory
    })
```

replacement accepts both a string or an object of strings. For example:

```js
{
    'valuetomatch': 'valuetoreplaceitwith'
}
```

This can be as long as you want, and if your regex finds a match that match will be used to find the property of the object and replace it with that value.

## Known Issues
* There seems to be an issue when claling replaceify with a for loop
* Still some Sync related issues (might contribute to the above issue)
* Replaces files with null, or incorrect text when provided (need some better catches)
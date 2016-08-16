## Info
Goes through files and replaces determined text, currently does not support symbolic links however.

## How To
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

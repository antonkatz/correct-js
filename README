# Correct JS

CorrectJS helps you write cleaner, maintainable code and spot bugs early on.
It tries to provide all the benefits of static-typing (plus more) without the extra overhead.
It does this through the magic of **dynamic analysis**: because many bugs can only be caught by running the code. 

The project is split into two parts: *Babel plugin* and the *lib*.

To install
```
    npm install https://github.com/antonkatz/correct-js.git
```

## Babel plugin
- [x] Generate warnings when a function is called with a variable/non-expected number of arguments
- [ ] Generate warnings when the shape of the given arguments changes
- [ ] Generate warnings when the shape of the return value changes in the same function
- [ ] Create execution logs:
    - [x] logging function arguments
    - [ ] logging internal function variables
    - [ ] logging return values

To enable the plugin, add the following to your babel config
```$js
  "plugins": [
    "@onest.network/correct-js/babel/argument-watch-plugin"
  ]
```

The logs will be automatically created, besides the source files in which the functions are defined, and will have the extension `.cjslog`
To remove the logs a convenience script is provided (best run before executions/tests). Add following to your *package.json*:
```
"scripts": {
    "clear-logs": "node node_modules/@onest.network/correct-js/babel/delete-logs.js"
  }  
```

Adding `CORRECT_JS_STRICT=false` to your env will log warnings instead of throwing errors

#### Current limitations
The provided build is made for nodejs and does not work in the browser.
You can still run your tests and thus get the benefits.  

## Lib

Revolves around providing an opinionated way to encapsulate data objects 
- [x] preventing accidental access to non-existent values
- [x] preventing state/data mutation outside of internal functions
- [x] preventing initialization with missing data
- [ ] ease of serialization/export of parts of encapsulated data/state

To prevent checks during runtime, add `CORRECT_JS_ENV=production` or `NODE_ENV=production` to your env

## Performance
When building and running with `NODE_ENV=production` the *Babel plugin* is disabled,
and majority of correctness checks inside the *lib* as well

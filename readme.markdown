# browser-badge

Generate browser version compatibility badges.

# example

With a json file like this:

``` json
{
  "explorer" : { "7.0" : false, "8.0" : false, "9.0" : false },
  "firefox" : { "10.0" : true, "11.0" : true, "12.0" : false, "13.0" : true, "nightly" : true },
  "chrome" : { "14.0" : true, "15.0" : true, "16.0" : true, "canary" : true },
  "safari" : { "5.0.5" : false, "5.1.0" : false, "5.1.1" : true },
  "opera" : { "10.6" : false, "11.0" : "pending", "11.6" : "pending" }
}
```

```
$ browser-badge browsers.json -o badge.png
```

![badge](http://substack.net/images/badge.png)

# usage

```
browser-badge {infile | -i infile | -} {outfile | -o outfile | -} {-s scale | -}

  infile should be a json object mapping browser names to version
  compatabilities
  
  outfile will be a png file with the browser badge data

  scale should be a factor by which the badge will be scaled.
```

# methods

``` js
var browserBadge = require('browser-badge')
```

## browserBadge(browsers[, opts])

Return a readable stream of png data from the browser version compatability
object `browsers`.

`browsers` should map browser names to maps of versions to booleans expressing
compatbility or `"pending"` to indicate that the browser tests have not yet
finished.

`opts` can be:

* `scale (Default: 1)`: The factor by which the badge will be scaled. Use `2`
for retina readiness.

# install

To get the command-line tool, with [npm](http://npmjs.org) do:

```
npm install -g browser-badge
```

to install the library do:

```
npm install browser-badge
```

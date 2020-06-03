# 💣nuk
A package manager that installs only what you need.

## Motivation
It often happens to add resources hosted on CDN to websites or web applications. CDNs, I know, are very convenient and 
quick to include a lib. But how safe is it to do it? How many times does it happen that these are unreachable 
for traffic reasons? For example, it happens to me with unkpg.com. Get the files from the node_modules folder? No! 
it is not done. Too big. So I thought of creating a simple package manager (I don't know if I can call it that) that 
simply downloads the resources you want in a folder.

***The files should be kept "local". But if you have your own CDN, even better.*** 😎

## Installation
```
$ npm install -g nuk
```

## Usage

Do you need to install only the UMD version of React?
```
$ nuk install react/umd
```

After this a `vendors/react-x.x.x/umd` folder will be created with only the files of the React umd folder present in the package on npm.
Now, you can include your file:
```html
<script src="vendors/react-x.x.x/umd/react.production.min.js"></script>
```

PS: if it doesn't already exist, a configuration file called `nuk.json` will be automatically created. This serves as 
a configuration.

**Please don't remove** `nuk-lock.json` useful for keeping track of installed packages.

You can also install multiple packages
```
$ nuk install react/umd doz/dist
```

Obviously you can install the version you want (**recommended**):
```
$ nuk install react@16.12.0/umd
```

If you want to know quickly which files you can include in a given package then you can use "list":
```
$ nuk list react
```

You will receive an output like this:
```
nuk install react/cjs
nuk install react/cjs/react.development.js
nuk install react/cjs/react.production.min.js
nuk install react/index.js
nuk install react/index.min.js
nuk install react/umd
nuk install react/umd/react.development.js
nuk install react/umd/react.production.min.js
nuk install react/umd/react.profiling.min.js
```

I understand that inserting so many scripts into your html page could be tiring. So nuk gives you another command called 
"bundle". This command will only take minified files that conventionally have "min." in the file name and will concatenate 
them into one file bundle.js and bundle.css. It does nothing else. 
**It is not a real bundler**. The files will be created inside the "vendors" folder.
```
$ nuk bundle
```

if you need to exclude certain files or change the order in which nuk generates the bundle then you can add 
the "bundleFiles" property to your nuk.json:
```json
{
  "bundleFiles": [
    "swiper-5.4.1/css/swiper.min.css",
    "react-16.13.1/umd/react.production.min.js"  
  ]
}
```

It will provide two files:
- vendors/bundle.js
- vendors/bundle.css

So, you can include just this:
```html
<script src="vendors/bundle.js"></script>
<link href="vendors/bundle.css" rel="stylesheet" type="text/css">
```

if you need to diversify the bundles you can then do so:
```json
{
    "bundleFiles": {
        "bundle1": [
            "swiper-5.4.1/css/swiper.min.css",
            "react-16.13.1/umd/react.production.min.js"
        ],
        "bundle2": [
            "react-16.13.1/umd/react.profiling.min.js"
        ]
    }
}
```

In this case it will provide three files:
- vendors/bundle1.js
- vendors/bundle1.css
- vendors/bundle2.js

Do you need to uninstall?
```
$ nuk uninstall react
```

if you need to change the name of the vendors folder then add this property to the nuk.json file:
```json
{
  "folderName": "my-vendors"
}
```

## Changelog
You can view the changelog <a target="_blank" href="https://github.com/fabioricali/nuk/blob/master/CHANGELOG.md">here</a>

## License
nuk is open-sourced software licensed under the <a target="_blank" href="http://opensource.org/licenses/MIT">MIT license</a>

## Author
<a target="_blank" href="http://rica.li">Fabio Ricali</a>
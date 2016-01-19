![fox](img/icons/fox128x128.png)

# SMSFox
Firefox OS application to serve as a web relay to send and receive messages.

## Initial objectives
* Mastering the entire compilation process of applications under Firefox OS
* Understanding the native SMS application of Firefox OS
* Developping a secure website which can send SMS through the application
* Communicating with connected objects
* ...

## How to make it work ?
#### Cloning the repository
```batchfile
$ git clone https://github.com/FoxHoundAlphaUnit/SMSFox.git SMSFox
$ cd SMSFox
```

#### Compiling SASS
You'll have to compile the SASS file from css/app.sass to css/app.css.
So, first, if you don't have SASS installed, install the Gem:
```batchfile
$ gem install sass
```
Then, to compile the file:
```batchfile
$ sass css/app.sass > css/app.css
```

#### Minifying
First, if you don't have a tool to minify, install one. For example, minifier.
```batchfile
$ npm install -g minifier
```

Then, minify all the app css and js files:
```batchfile
$ minify css/app.css
$ minify css/libs/materialize.css
$ minify js/app.js
$ minify js/server.js
```

#### Alternative
Or you can just launch the update.sh script which will transform and minify the necessary files but don't forget to install sass and the minifier or it won't work.
```batchfile
$ ./update.sh
```

#### Web IDE
Finally, you can load the app into an emulator or your own Firefox OS phone using WebIDE (available in the Firefox browser, Tools/Web Developer/Web IDE) and it should work!

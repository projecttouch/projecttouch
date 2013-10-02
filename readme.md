ProjectTouch
=======

**Community built HTML 5 video editor.**

![Editor](http://staging.codedazur.nl/projecttouch/screens/1.0-Full-view-full.jpg)

There are three tough challenges in developing the web-based video editor for Touch:
- UX and touch input
- Video loading, sequencing and manipulation
- Effects, overlays, and transitions

Videos you can use for testing:
- [Street](https://www.theinternetoftouch.com/videos/street.zip) 
- [Human Flight](https://www.theinternetoftouch.com/videos/humanflight.zip) 
- [Nature](https://www.theinternetoftouch.com/videos/nature.zip) 
- [Trailer](https://www.theinternetoftouch.com/videos/trailer.zip) 

Check out the [ProjectTouch microsite](http://www.theinternetoftouch.com) for updates.

## Installing and deploying
You need to have the following dependencies installed:
* [Compass](http://compass-style.org/) together with [compass-colors](https://github.com/chriseppstein/compass-colors) for sass file compilation
* [Bower](http://bower.io/) for initially loading all the external dependencies.
* [Grunt](http://gruntjs.com/) for deployment, a lightweight webserver and an automatic [livereload](https://github.com/livereload/livereload-server) server.

When you have these dependencies installed you should initially run
* ```bower install```
* ```npm install```
This will install all the frontend and grunt dependencies. Respectively ```bower.json``` and ```package.json``` are used to define the dependencies.

You could have a look inside the ```Gruntfile.js``` to find all the available tasks. The most important tasks are:
* ```grunt serve``` This starts up a webserver and livereload server and automatically recompiles your sass files upon a change
* ```grunt deploy``` This will create a deploy ready version of the app in tmp/deploy. It runs the requirejs optimizer and switches to loading the minified file. Files that are irrelevant for production are omitted and the html file will be optimized.
* ```grunt deploy:local``` The same as the previous command, but automatically starting a webserver. This could be used for checking if the build did not break anything.
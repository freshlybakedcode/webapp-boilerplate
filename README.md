## Webapp boiler plate

### Whatcha got?
Boiler plate set up with Gulp as a task runner.

<i>Development:</i>
* Start a server with BrowserSync for hot reloading of HTML/CSS/JS
* Watch and compile SCSS to CSS
* Auto-prefix CSS

<i>Distribution</i>
* Concatenate all CSS and JS
* Transpile ES2015 -> ES5
* Minify JavaScript
* Strip console.logs from JavaScript
* Compile SCSS to CSS
* Auto-prefix CSS
* Minify CSS
* Optimise images

### How to use
* Clone
* `npm i`
* `gulp`

### To build distribution files:
* `gulp build`
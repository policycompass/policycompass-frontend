# Policy Compass Frontend

## Installation

* Requirements: node.js (http://nodejs.org/download/), git (http://git-scm.com/downloads)
* Clone the repository
* Navigate to the cloned folder
* Install node packages
```
npm install
```
* Install front-end packages (linux)
```
./node_modules/.bin/bower install
```
* Install front-end packages (windows)
```
node_modules\.bin\bower install
```
* Copy the development.sample.json to development.json and configure the development.json with your service domains
* Copy the app/config.sample.js to config.js and configure it with your service domains
* If you don't have the services locally installed set 'useRemoteServices' in the config.js to true
* Start App
```
npm start
```
* By default the App is running on http://localhost:9000/app/
* Running Tests:
```
npm test
```
* Running E2E-Tests:
```
npm run-script protractor
```
* If you have Problems with running the E2E-Tests, try updating the webdriver and make sure you have Chrome installed
```
node_modules/.bin/webdriver-manager update
```

* Install Ruby/Sass/compass for compile css files: 
* Ruby: https://www.ruby-lang.org/en/documentation/installation/ (http://rubyinstaller.org/ for Ruby for Windows)
* install sass:
```
gem install sass
```
* install compass:
```
gem install compass
```
* the file config.rb defines the Sass variables and directories
* for compile Sass files into Css while editing run command in the config.rb directory:
```
compass watch
```
* for modify certain styles inspect the element in Chrome and click the .css file at the right panel, the comment has the exact .scss line in which the style is defined.


## Policy Compass is Free Software

This project (i.e. all files in this repository if not declared otherwise) is
licensed under the GNU Affero General Public License (AGPLv3), see
LICENSE.txt.

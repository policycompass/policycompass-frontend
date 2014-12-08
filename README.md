# Policy Compass Frontend

## Installation

* Requirements: node.js (http://nodejs.org/download/)
* Clone the repository
* Navigate to the cloned folder
* Install node packages
```
npm install
```
* Install front-end packages
```
./node_modules/.bin/bower install
```
* Copy the development.sample.json to development.json and configure the development.json with your service domains
* Copy the app/config.sample.js to config.js and configure it with your service domains
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

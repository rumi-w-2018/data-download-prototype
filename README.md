 
# data-download-prototype #
 
----------
Built on create-react-app

To install


    npm install

### Run ###

    npm start

To run with REACT_APP_ENV=development.


    npm run start-dev


### Build ###

To build for production.  (This uses "https://viewer.nationalmap.gov/" API Endpoint)


    npm run build

To build for **development** in **Linux**.  (This uses "https://tnmbeta.cr.usgs.gov/" API Endpoint)


    npm run build-dev

To build for **development** in **Windows**.  (This uses "https://tnmbeta.cr.usgs.gov/" API Endpoint)


    npm run build-win-dev

Note: This runs "start-dev": "SET REACT_APP\_ENV=development&& npm run build", in package.json.<br>  **Important**: **No space between development and &&**



Added below to package.json.  This sets the correct root path used in the generated HTML file.


    "homepage": ".",

<br>


## Deployment  ##
### Initial Deployment ###


Copy ALL contents in "build" folder to the physical servers/Cloud S3.<br>

g
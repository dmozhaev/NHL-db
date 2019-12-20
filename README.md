# Backend

## Database

Database name: nhl_db
Database user: nhl

## Scripts

### Start the project from scratch

manage.py makemigrations nhl
manage.py migrate
manage.py load_data
manage.py runserver 8080

### Created Django admin superuser

manage.py createsuperuser

## URLs

Django admin console: http://localhost:8080/admin
API urls and routes: http://localhost:8080/api

----------------------------------------------------------

# Frontend

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Antd installation

### `npm install antd`

(https://www.npmjs.com/package/antd)

## Axios installation

### `npm install axios`

(https://www.npmjs.com/package/axios)

## React router installation

### `npm install --save react-router-dom`

(https://www.npmjs.com/package/react-router-dom)

## Redux thunk installation

### `npm install --save redux redux-thunk`

(https://www.npmjs.com/package/redux-thunk)

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

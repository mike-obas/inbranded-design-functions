# Cloud functions for a React cloud-based online Image Editor

This is the backend codebase for React cloud-based online Image Editor (Repo Url: https://github.com/mike-obas/inbranded-design), it uses NODE JS and EXPRESS JS for API scripting which is deployed as GOOGLE CLOUD FUNCTIONS. It is completely agnostic to the frontend codebase; making the web application a super scalable and extendable one.

## How to run this project

Firstly, create a firebase project from firebase console: initialize storage, firestore and cloud functions. (Jump this step, if you have already done that).

Next, clone this repository, then replace the config object in functions/src/utils/config.ts with your custom configuration for web from firebase.

Finally, run the following commands in your project's root directory's terminal. 

### `firebase init` Then select cloud functions.
### `cd functions` Moves to functions directory
### `npm install` To install all dependencies
### `npm run build` 
### `cd ../` Moves to your project's root directory
### `firebase deploy` To deploy cloud functions

Upon a successful deployment, the URL to the APIs (cloud functions) will be provided. You can now use this URL as baseUrl on your frontend - in axiosConfig.js

Happy hacking. 

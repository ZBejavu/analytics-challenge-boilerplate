# Analytics Dashboard

## Introduction

**This project is based on the existing project "Cypress Real World App".
- added an admin user functionality
-  database endpoints to handle events 
- manipulated event data in order to display a dashboard with event tiles.
- created tiles using recharts library, google maps api , material-ui.

## Getting Started

Fork this repo and build your project on top of it.   
you can use `npm run init` __in the project root__ to download both the client and server dependencies, or :   
- Setup server  
    1. `cd server`  
    3. `npm i` 
    3. `npm start` in `/server`. (yes, in server)
    4. `npm run test` - runs backend tests (required to pass).
- Setup client  
    1. `cd client`  
    3. `npm i` 
    3. `npm start` in `/client`. this can take a while
- After installing all dependencies, you can also use `npm run dev` in in either folder to run both concurrently.

- Note: do not delete the root folder's package.json, it is necessary.
  
# admin credentials :
  ## username: admin123
  ## password: password

# walkthrough of the feature
1. login with admin credentials : 
![](/readmefiles/loginpage2.png)
2. navigate to the analytics dashboard using the side bar : 
![](/readmefiles/navbar.png)
3. play around with the analytics
![](/readmefiles/dashboard.gif)


note- the repo uses 'husky' and you might find you can't push to github while there are errors in the code.
- Any changes will be coded using Typescript.

## I hope you enjoyed : )
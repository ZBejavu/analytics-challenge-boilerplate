# Analytics Dashboard

## Introduction
This project is a feature that was built on the existing project "Cypress Real World App".  
The feature is called "Analytics Dashboard" and is a fullstack Event Analysis system that works by collecting events sent to the platform and analysing the data.  
the analysed data is showcased by corresponding tiles in the FE side of the application.  
In order to view the Dashboard you need to log in to the site with a user that has admin privileges.  
(user provided below).

## Getting Started

Fork this repo  
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
  
## Admin Credentials :
  - username: admin123
  - password: password

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
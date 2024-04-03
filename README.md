# socializemedia

"SocializeMedia" is an e-commerce app to demonstrate how to put "full-stack" development together. It contains the basic CRUD for creating post, editing post, deleting and updating the posts. Follow and accept or ignore other 

Access the website using the link below  
[Socialize Media](https://socializemedia.web.app)

## Tech Stack

**Backend:**

- Node.js / Express.js
- MongoDB

**Frontend:**

- React
- Redux-Toolkit
- Material UI
- Typescript

## Features

- Create Post
- Update/Edit existing Post
- Delete Existing Post
- Follow other users on platform
- Accept or ignore the Friend Request
- Like a Post
- comment on a Post

## Environment Variables (Client APP - React)

To run this project, you will need to add the following environment variables to your .env file

`REACT_APP_BASE_URL` - base url of the server(localhost server), change it to the server url after deploying.

- Environment variables of api routes defined in server
- These are used in async thunks in redux toolkit

`REACT_APP_USER_LOGIN`  
`REACT_APP_USER_REGISTER`  
`REACT_APP_USER_LOGOUT`  
`REACT_APP_REFRESH_TOKEN`  
`REACT_APP_PROFILE`  
`REACT_APP_GET_UPDATED_POST`  
`REACT_APP_UPDATE_BIO`  
`REACT_APP_ADD_POST`  
`REACT_APP_DELETE_POST`  
`REACT_APP_EDIT_POST`  
`REACT_APP_ADD_COMMENT`  
`REACT_APP_LIKE_POST`  
`REACT_APP_REMOVE_LIKE`  
`REACT_APP_SEND_FRIEND_REQUEST`  
`REACT_APP_ACCEPT_FRIEND_REQUEST`  
`REACT_APP_REMOVE_FRIEND`  
`REACT_APP_SEARCH`  
`REACT_APP_GET_USER`  


- After creating a project in firebase add these environment variables in .env file

`REACT_APP_FIREBASE_API_KEY`  
`REACT_APP_FIREBASE_AUTH_DOMAIN`  
`REACT_APP_FIREBASE_PROJECT_ID`  
`REACT_APP_FIREBASE_STORAGE_BUCKET`  
`REACT_APP_FIREBASE_MESSAGING_SENDER_ID`  
`REACT_APP_FIREBASE_APP_ID`  
`REACT_APP_FIREBASE_MEASUREMENT_ID`  


- These are environment variables for paths for storing pictures in firebase storage  
`REACT_APP_FIREBASE_STORAGE_ROOT`  
`REACT_APP_FIREBASE_STORAGE_POSTS`  

## Run Locally

Clone the project (client app - Frontend)

```bash
  git clone https://github.com/lkm14001/Social-Media-Frontend.git
```

Clone the project (client app - Backend)

```bash
  git clone https://github.com/lkm14001/Social-Media-Backend.git
```


Install dependencies

```bash
  cd client
  npm install
```

Install dependencies of Server

```bash
  cd server
  npm install
```

## Environment Variables (Server)
To run this project, you will need to add the following environment variables to your .env file  
`mongoURI` - uri of your mongodb cluster  
`SERVER_PORT` - your server port  
`JWT_SECRET` - SECRET variable for signing jwt tokens  
`JWT_REFRESH_SECRET` - SECRET variable for signing jwt refresh tokens  
`NODE_ENV` - environment of your node app - dev or production  
`CLIENT_URL` - url of your client app - for dev usually the react app url, for production use the deployed url of the react app.  


Start the react app

```bash
  cd client
  npm start
```

```bash
  cd server
  npm run dev
```

## Screenshots
Home Page Where user can see posts of users they are following  
![Home Page Where user can see posts of users they are following](https://github.com/lkm14001/Social-Media-Backend/blob/1b5052e4409804b227d9471f8d61330f6f4e21d7/SocializeMedia1.png)  
Profile Page  
![Profile page](https://github.com/lkm14001/Social-Media-Backend/blob/1b5052e4409804b227d9471f8d61330f6f4e21d7/SocializeMedia2.png)  

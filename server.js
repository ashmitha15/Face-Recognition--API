const express = require('express');
const bodyParser = require('body-parser'); //installed body parser to access the body of the req
const cors = require('cors'); //installed cors for cross origin request
const bcrypt = require('bcrypt-nodejs');
const knex = require('knex');
const register = require('./Controllers/register.js');
const signin = require('./Controllers/signin.js');
const profile = require('./Controllers/profile.js');
const image = require('./Controllers/image.js');

const db= knex({
  client: 'pg', //type of database
  connection: {
    host : '127.0.0.1', //where the database is hosted . 127.0.0.1 is the ip address of the local host(home addr)
    port : 5432, //port where postgres is running
    user : 'postgres', //owner of the postgres db
    password : 'Ashsrav@1502', //passwrd of postgres
    database : 'Smart-brain'//name of the db
  }
});


const app = express();

app.use(bodyParser.json()); //body parser a middleware

app.use(cors()); //middleware for CORS

app.get('/',(req,res) => {
	res.send("It's working");
})

//endpoint for signin,checking for the correct user.Have to use post since sending confidential info using get might cause attacks
app.post('/signin', (req,res) => {signin.handleSignIn(req,res, db,bcrypt)})

//endpoint for register (post used since we are posting the data to the server) and displaying the user who has registered
app.post('/register',(req,res) => {register.handleRegister(req,res,db,bcrypt) })

// to display the user's id . used for future installations
app.get('/profile/:id',(req,res) => {profile.handleProfile(req,res,db)})

// to display the rank of the user based on the #images uploaded, increment the entry object
app.put('/image',(req,res) => {image.handleImage(req,res,db)})

app.post('/imageurl',(req,res) => {image.handleApiCall(req,res)}) //endpoint for clarifai api calls

const PORT = process.env.PORT;
app.listen(PORT || 3000, () => {
	console.log("app running on port ${PORT}");
})


/*
/ -> get req - current users
/signin -> post req - sucess/failure
/register -> post req- new user added
/profile/:userId -> get req- user
/image -> put req-user

*/

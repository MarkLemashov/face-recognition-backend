const bodyParser = require('body-parser');
const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const signin = require('./controllers/signin');
const register = require('./controllers/register');
const image = require('./controllers/image');
const Clarifai = require('clarifai');
const db = require('knex')({
    client: 'pg',
    connection: {
      connectionString : process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      },
    }
  });

const clarifai = new Clarifai.App({
    apiKey: '585d42f3bab543ebb7c64425508f87fc'
   });

let port = process.env.PORT;

const saltRounds = 2;
const app = express();

app.use(bodyParser.json())
app.use(cors());

app.get('/', (req, res) => {
    db.select('*').from('users').then(data => res.send(data));
})

app.post('/signin/', signin.signinPost(db, bcrypt));

app.post('/register/', register.registerPost(db, bcrypt, saltRounds));

app.put('/image', image.imagePut(db, clarifai));

app.listen(port, () => {
    console.log(`app is running on port ${port}`);
})
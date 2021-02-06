const bodyParser = require('body-parser');
const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const signin = require('./controllers/signin');
const register = require('./controllers/register');
const image = require('./controllers/image');
const Clarifai = require('clarifai');
const jwt = require('jsonwebtoken');
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

const ACCESS_TOKEN_SECRET = '9ef328c25aa478187a9603366154967574767e870452f8e74f7dc9a18bc44bc1dc27d69b6757a8e8c65e4317ebba4197405cf7b4774831828d279ab8164bbbdc';
const REFRESH_TOKEN_SECRET = '49d6fe9cd576e9a04712c30e8a0c21a9bd9020ebaf36d27f60b8c3a74f12f6a3ce627c043c80ffdcd47ce77872103b0ffa8464b8a545ab1985729ef19317aa2c';
let PORT = process.env.PORT;
const saltRounds = 2;
const app = express();

app.use(bodyParser.json())
app.use(cors());

app.get('/', (req, res) => {
    db.select('*').from('users').then(data => {
      res.send(data.map(user => {
        return ({name: user.name, entries: user.entries, faces_detected: user.faces_detected, joined: user.joined});
      }));
    });
})

app.post('/signin/', signin.signinPost(db, bcrypt, jwt, ACCESS_TOKEN_SECRET));

app.post('/register/', register.registerPost(db, bcrypt, saltRounds));

app.put('/image', authenticateToken, image.imagePut(db, clarifai));

app.listen(PORT, () => {
    console.log(`app is running on port ${PORT}`);
})

const authenticateToken = (req, res, next) => {
  const authHEader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  })
}
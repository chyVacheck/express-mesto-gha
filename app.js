const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const { NotFound } = require('./utils/NotFound');

const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');

// ? объявление порт`а
const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use((req, res, next) => {
  req.user = {
    _id: '6383552177a97ac698270efa',
  };
  next();
});

app.use('/users', routerUsers);
app.use('/cards', routerCards);
app.use('*', NotFound);

// ? подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', () => {
  console.log('connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`connected to port: [${PORT}]`);
  });
});

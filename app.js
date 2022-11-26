
const express = require('express');
const mongoose = require('mongoose');
const user = require('./models/User.js');
const card = require('./models/Card.js');

const routerUsers = require('./routes/users.js');
const routerCards = require('./routes/cards.js');

//? объявление порт`а
const { PORT = 3000 } = process.env;
//? подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb');

const app = express();

app.use('/users', routerUsers);
app.use('/cards', routerCards);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port [${PORT}]`)
})
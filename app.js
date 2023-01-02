require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
// * свои
const { NotFound } = require('./utils/NotFound');
// ? роутеры
const routerAuth = require('./routes/auth');
const router = require('./routes/main');

// ? middlewares
const { handleErrors } = require('./middlewares/HandleErrors');
const { limiter } = require('./middlewares/Limiter');
const auth = require('./middlewares/Auth');
const cors = require('./middlewares/Cors');
const { Logger } = require('./middlewares/Logger');

// ? объявление порт`а
const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());

// * CORS
app.use(cors);

// * protection
app.use(helmet());
app.use(limiter.simpleRequest);

// * requests logger
app.use(Logger.request);

// * routes
app.use(routerAuth);
app.use(auth, router);
app.use('*', NotFound);

// ? errors logger
app.use(Logger.error);

// ? валидация ошибок
app.use(errors());
app.use(handleErrors);

try {
  // ? подключаемся к серверу mongo
  mongoose.connect('mongodb://localhost:27017/mestodb', () => {
    console.log('Сonnected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Сonnected to port: [${PORT}]`);
    });
  });
} catch (error) {
  console.log(error);
}

/* eslint-disable class-methods-use-this */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// * модель пользователя
const user = require('../models/User');
// ? из констант
const { MESSAGE, STATUS } = require('../utils/constants');

// * errors
const { NotFound } = require('../utils/NotFound');
const NotFoundError = require('../errors/NotFoundError');

// * jwt
const { NODE_ENV, JWT_SECRET } = process.env;

// * кастомные ошибки
const NotAuthorized = require('../errors/NotAuthorized');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');

class Users {
  // * POST
  // ? создает пользователя
  createOne(req, res, next) {
    const {
      name, about, avatar, email, password,
    } = req.body;

    bcrypt.hash(password, 10)
      .then((hash) => user.create({
        name, about, avatar, email, password: hash,
      }))
      .then((data) => {
        res.status(STATUS.INFO.CREATED).send({
          message: MESSAGE.INFO.CREATED,
          data: {
            name: data.name,
            about: data.about,
            avatar: data.avatar,
            email: data.email,
            _id: data._id,
          },
        });
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          next(new BadRequestError('Incorrect data entered'));
        } else if (err.code === 11000) {
          next(new ConflictError(`You can not use this mail ${email} for registration, try another email`));
        } else {
          next(err);
        }
      });
  }

  // ? авторизоация пользователя
  login(req, res, next) {
    const { email, password } = req.body;
    return user.findUserByCredentials(email, password)
      .then((data) => {
        const token = jwt.sign({ _id: data._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
        res.cookie('jwt', token, { expires: new Date(Date.now() + 12 * 3600000), httpOnly: true, sameSite: true });
        res.send({ message: 'User is authorized!', token });
      })
      .catch((err) => {
        if (err.message === 'Email is incorrect') {
          return next(new NotAuthorized('Email or password is incorrect!'));
        }
        next(err);
        return 0; // что бы eslint не ругался
      });
  }

  // * GET
  // ? возвращает всех пользователей
  getAll(req, res) {
    user.find({})
      .then((users) => {
        if (users) {
          res.send({ data: users });
        } else {
          NotFound();
        }
      })
      .catch((err) => {
        if (err.name === 'CastError') {
          res.status(STATUS.ERROR.BAD_REQUEST).send({ message: MESSAGE.ERROR.BAD_REQUEST });
        } else {
          res.status(STATUS.ERROR.SERVER).send({ message: MESSAGE.ERROR.SERVER });
        }
      });
  }

  // ? возвращает пользователя по _id
  getOne(req, res) {
    user.findById(req.params.userId)
      .orFail(new Error('NotValid'))
      .then((data) => {
        res.send({ user: data });
      })
      .catch((err) => {
        // ? если длина id правильная, но такого нет в базе
        if ((err.name === 'TypeError') || (err.message === 'NotValid')) {
          NotFound(req, res);
        } else {
          // ? если длина id неверная
          if (err.name === 'CastError') {
            res.status(STATUS.ERROR.BAD_REQUEST).send({ message: MESSAGE.ERROR.BAD_REQUEST });
            return;
          }// ? для других ошибок
          res.status(STATUS.ERROR.SERVER).send({ message: MESSAGE.ERROR.SERVER });
        }
      });
  }

  getMe(req, res, next) {
    user.findById(req.user._id)
      .orFail(() => new NotFoundError(MESSAGE.ERROR.NOT_FOUND))
      .then((data) => res.send(data))
      .catch(next);
  }

  // * PATCH
  // ? устанавливает новое значение информации о пользователи
  setUserInfo(req, res) {
    const { name, about } = req.body;

    user.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    )
      .orFail(new Error('NotValid'))
      .then(() => {
        res.status(STATUS.INFO.OK).send({ message: `INFO ${MESSAGE.INFO.PATCH}`, Name: name, About: about });
      })
      .catch((err) => {
        if ((err.name === 'CastError') || (err.name === 'ValidationError')) {
          res.status(STATUS.ERROR.BAD_REQUEST).send({ message: MESSAGE.ERROR.BAD_REQUEST });
        } else {
          NotFound(req, res);
          return;
        }
        res.status(STATUS.ERROR.SERVER).send({ message: MESSAGE.ERROR.SERVER });
      });
  }

  // ? устанавливает новый аватар пользователя
  setUserAvatar(req, res) {
    const { avatar } = req.body;
    user.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    )
      .then((data) => {
        if (data) {
          res.status(STATUS.INFO.OK).send({ message: `AVATAR ${MESSAGE.INFO.PATCH}`, avatar: data });
        } else {
          res.status(STATUS.ERROR.NOT_FOUND).send({ message: `USER ${MESSAGE.ERROR.NOT_FOUND}` });
        }
      })
      .catch((err) => {
        if ((err.name === 'CastError') || (err.name === 'ValidationError')) {
          res.status(STATUS.ERROR.BAD_REQUEST).send({ message: MESSAGE.ERROR.BAD_REQUEST });
        } else {
          NotFound(req, res);
          return;
        }
        res.status(STATUS.ERROR.SERVER).send({ message: MESSAGE.ERROR.SERVER });
      });
  }
}

const users = new Users();

module.exports = { users };

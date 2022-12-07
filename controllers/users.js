/* eslint-disable class-methods-use-this */
const { MESSAGE, STATUS } = require('../utils/constants');
const { NotFound } = require('../utils/NotFound');
const user = require('../models/User');

class Users {
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

  // ? возвращает пользователя
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

  // ? создает пользователя
  createOne(req, res) {
    const { name, about, avatar } = req.body;

    user.create({ name, about, avatar })
      .then((d) => {
        res.status(STATUS.INFO.CREATED).send({ message: MESSAGE.INFO.CREATED, data: d });
      })
      .catch((err) => {
        if ((err.name === 'CastError') || (err.name === 'ValidationError')) {
          res.status(STATUS.ERROR.BAD_REQUEST).send({ message: MESSAGE.ERROR.BAD_REQUEST });
        } else {
          res.status(STATUS.ERROR.SERVER).send({ message: MESSAGE.ERROR.SERVER });
        }
      });
  }

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
